const io = require("socket.io")();
const moment = require("moment");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");

let activeUsers = [];

const getOnlineUsers = () => {
  io.emit("online-users", {
    status: "success",
    message: "Online users fetched",
    activeUsers,
  });
};

const addActiveUser = (userData, socketId) => {
  if (!activeUsers.some((user) => user.userId === userData._id)) {
    activeUsers.push({
      userId: userData._id,
      socketId,
    });
  }
};

const emitInboxes = async (userData, chats) => {
  io.to(userData._id).emit("inboxes", {
    status: "success",
    message: "Inboxes fetched successfully",
    inboxes: chats,
  });
};

const findOrCreateChat = async (userId, receiverId) => {
  let chat = await Chat.findOne({
    $and: [{ users: userId }, { users: receiverId }],
  });

  if (!chat) {
    chat = await Chat.create({
      users: [userId, receiverId],
    });
  }

  return chat;
};

const updateMessagesAsSeen = async (senderId, receiverId) => {
  await Message.updateMany(
    { sender: senderId, receiver: receiverId },
    { seen: true }
  );
};

const getMessagesForChat = async (userData, receiverId, limit = 20, skip = 0) => {
    return await Message.find({
      $and: [
        { $or: [{ sender: userData._id }, { receiver: userData._id }] },
        { $or: [{ sender: receiverId }, { receiver: receiverId }] },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
  };

  
const handleUserEnter = (socket, userData) => {
  addActiveUser(userData, socket.id);
  socket.join(userData._id);
  getOnlineUsers();
};

const handleGetInboxes = async (userData) => {
  let chats = await Chat.find({ users: { $in: [userData._id] } }).sort(
    "-updatedAt"
  );
  chats = JSON.parse(JSON.stringify(chats));

  for (const chat of chats) {
    const messages = await Message.find({
      chat: chat._id,
      receiver: userData._id,
      seen: false,
    });

    chat.newMessages = messages.length;
    chat.users.forEach((user) => {
      activeUsers.forEach((activeUser) => {
        if (activeUser.userId === user._id.toString()) {
          user.isOnline = true;
        }
      });
    });
  }

  emitInboxes(userData, chats.length ? chats : []);
};

const handleJoinChat = async (socket, userData, receiverId) => {
  const receiver = await User.findById(receiverId);
  if (!receiver) return;

  const chat = await findOrCreateChat(userData._id, receiver._id);
  await updateMessagesAsSeen(receiver._id, userData._id);

  const messages = await getMessagesForChat(userData, receiver._id);
  const chatId = chat._id.toString();

  socket.join(chatId);
  io.to(userData._id).emit("messages", {
    status: "success",
    message: "Messages retrieved successfully",
    messages,
  });
};

const handleSendMessage = async (socket, userData, to, message) => {
  const currentUnixTime = moment().unix();
  const receiver = await User.findById(to);
  if (!receiver) return;

  let chat = await findOrCreateChat(userData._id, receiver._id);

  await Chat.findByIdAndUpdate(chat._id, {
    lastMessageSender: userData._id,
    lastMessage: message,
    messageTime: currentUnixTime,
  });

  const chatId = chat._id.toString();
  const joinedPeople = io.sockets.adapter.rooms.get(chatId);
  const joinedPeopleCount = joinedPeople ? joinedPeople.size : 0;

  const dbMessage = await Message.create({
    chat: chat._id,
    sender: userData._id,
    receiver: receiver._id,
    message,
    messageTime: currentUnixTime,
    seen: joinedPeopleCount > 1,
  });

  const messages = await getMessagesForChat(userData, receiver._id);

  io.to(userData._id).emit("message-sent", {
    status: "success",
    message: "New message sent successfully",
    isMessageSent: true,
    data: message,
  });

  io.to(chatId).emit("messages", {
    status: "success",
    message: "New Message retrieved successfully",
    receiver,
    messages,
  });

  const chats = await Chat.find({ users: { $in: [receiver._id] } }).sort(
    "-updatedAt"
  );

  for (const chat of chats) {
    const messages = await Message.find({
      $and: [
        { chat: chat._id },
        { seen: false },
        { receiver: receiver._id },
      ],
    });

    chat.newMessages = messages.length;
  }

  io.to(to).emit("inboxes", {
    status: "success",
    message: "Inboxes fetched successfully",
    inboxes: chats,
  });
};

const handleDisconnection = (socket, userData) => {
  activeUsers = activeUsers.filter(
    (user) => user.userId !== userData._id.toString()
  );
  getOnlineUsers();
};

io.on("connection", (socket) => {
  console.log("connected to socket.io", socket.id);
  socket.on("user-enter", (userData) => handleUserEnter(socket, userData));
  socket.on("get-online-users", getOnlineUsers);
  socket.on("get-inboxes", async (userData) => {
    await handleGetInboxes(userData);
  });
  socket.on("join-chat", async (userData, receiverId) => {
    await handleJoinChat(socket, userData, receiverId);
  });
  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });
  socket.on("stop-typing", (room) => {
    socket.in(room).emit("stop-typing");
  });

  socket.on("send-message", async (userData, to, message) => {
    await handleSendMessage(socket, userData, to, message);
  });

 socket.on("disconnect", () => {
  handleDisconnection(socket, userData);
});
});

module.exports = { io };
