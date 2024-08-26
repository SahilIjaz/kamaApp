const User=require('../models/userModel');
const appError = require('../utils/appError');
const handleFactory=require('./handlerFactory')
const catchAsync=require('../utils/caychAsync')

//createProfile
exports.createProfile=catchAsync(async(req,res,next)=>{
    console.log("api hit ");
    if(req.body.password||req.body.confirmPassword)
    {return next(new appError('This is not for password update.',404))};
console.log('Procesdding forward');
    const user=await User.findByIdAndUpdate(
        req.user.id,
        req.body,
        {new:true,runValidators:true}
    );
    console.log('Profile cretaed');
    if(!user)
    {return next(new appError('Profile not created!',404))};
    user.profrileCompleted=true;
    await user.save();
    console.log('status updated!');
    res.status(200).json({
        message:'Profile has successfully created!',
        status:200,
        Profile:{user}
    });
});

//updateProfile
exports.updateProfile=catchAsync(async(req,res,next)=>{
    const {password,confirmPassword}=req.body;

    if(password||confirmPassword)
    {return next(new appError('This is not for password update!',404))};

    const user=await User.findByIdAndUpdate(
        {_id:req.user._id},
        req.body,
        {new:true,
        runValidators:true
        });

        if(!user)
        {return next(new appError('You can-not update profile of other people!'))};

        res.status(200).json({
            message:'Profile updated successfully!',
            statsu:200,
            newProfile:{user}
        });
});

//recomendedProfessionals
exports.getRecommendedProfessionals=catchAsync(async(req,res,next)=>{

    const professional=await User.find({rating: {$gte : 4.5}});

    if(professional.length<1)
        {return res.status(400).json({
            message:'professional not found !',
            status:400
        })};

        res.status(200).json({
            message:'Recommnedesd professionals found !',
            status:200,
            length:professional.length,
            Professionals:{
                professional
            }
        });
});

//gtProfessionals
exports.getProfessionals = catchAsync(async (req, res, next) => {
  // Extracting query parameters from the request
  // const radiusInKm = req.query.radiusInKm || 1; // Use the provided radius or default to 1 km
console.log('START ');

  const radiusInKm = req.query.km||5; 
const Gender= req.query.gender|| 'male';


  const user = await User.findOne({ _id: req.user._id });
  
  if (!user || !user.location || !user.location.coordinates) {
    return res.status(400).json({
      message: 'User location not found',
      status: 400,
    });
  }

  // const userCoordinates = user.location.coordinates;

  const userCoordinates = [req.query.longitude, req.query.latitude];


  console.log('Coordinates are:', userCoordinates);

  const earthRadiusInKm = 6371; // Earth's radius in kilometers

  const options = {
    location: {
      $geoWithin: {
        $centerSphere: [userCoordinates, radiusInKm / earthRadiusInKm], // Convert radius from km to radians
      },
    },
    role: 'professional', 
    Gender,
};

  const professionals = await User.find(options);
console.log("PROFESSIONALS ARE : ",professionals);
  if (professionals.length===0) {
    return res.status(400).json({
      message: 'No professionals near-by',
      status: 400,
    });
  }

  res.status(200).json({
    message: 'Nearby professionals found!',
    status: 200,
    length: professionals.length,
    professionals,
  });
});




//nearestProfessionals
exports.getNearestProfessionals = catchAsync(async (req, res, next) => {
  // Extracting query parameters from the request
  // const radiusInKm = req.query.radiusInKm || 1; // Use the provided radius or default to 1 km


  const radiusInKm = 5; 


  const user = await User.findOne({ _id: req.user._id });
  
  if (!user || !user.location || !user.location.coordinates) {
    return res.status(400).json({
      message: 'User location not found',
      status: 400,
    });
  }

  const userCoordinates = user.location.coordinates;
  // const userCoordinates = [req.query.longitude, req.query.latitude];

  const earthRadiusInKm = 6371; // Earth's radius in kilometers

  const options = {
    location: {
      $geoWithin: {
        $centerSphere: [userCoordinates, radiusInKm / earthRadiusInKm], // Convert radius from km to radians
      },
    },
    role: 'professional', // Add role filter here
  };

  const professionals = await User.find(options);
console.log("PROFESSIONALS ARE : ",professionals);
  if (professionals.length===0) {
    return res.status(400).json({
      message: 'No professionals near-by',
      status: 400,
    });
  }

  res.status(200).json({
    message: 'Nearby professionals found!',
    status: 200,
    length: professionals.length,
    professionals,
  });
});


//remaining to be managed 
// exports.getProfessionals = catchAsync(async (req, res, next) => {
//     // const blockedUserIds = await blockedUsers(req.user._id);
  
//     let km = req.query.km;
//     if (!km) km = 50;
//     let myCords = req.user.location.coordinates;
//     let condition;
//     let gender = [req.user.gender];
//     let preference;
//     let meetingLocation;
//     //  = [req.user.preference];
//     let data;
//     let search;
//     console.log("serach query", req.query.search);
//     if (req.query.search) {
//       const escapedSearch = escapeRegExp(req.query.search);
  
//       const history = await History.findOne({
//         $and: [{ creator: req.user.id }, { text: req.query.search }],
//       });
//       if (history) {
//         history["updatedAt"] = Date.now();
//         await history.save();
//       } else {
//         await History.create({ text: req.query.search, creator: req.user.id });
//       }
  
//       search = {
//         $or: [
//           {
//             name: {
//               $regex: new RegExp(escapedSearch, "i"),
//             },
//           },
//         ],
//       };
//     }
  
//     if (req.query.preference) {
//       let preferences = req.query.preference.split(",");
//       preference = {
//         preference: { $in: [...preferences] },
//       };
//     }
  
//     if (req.query.meetingLocation) {
//       let meetingLocations = req.query.meetingLocation.split(",");
//       meetingLocation = {
//         meetingLocation: { $in: [...meetingLocations] },
//       };
//     }
  
//     if (req.query.gender) {
//       gender = req.query.gender.split(",");
//     }
  
//     if (req.query.location) {
//       myCords = req.query.location.split(",");
//       location = {
//         $or: [
//           {
//             location: locationQuery(
//               req.query.location.split(",")[0],
//               req.query.location.split(",")[1],
//               km
//             ),
//           },
//         ],
//       };
//     }
  
//     condition = {
//       $and: [
//         { _id: { $nin: blockedUserIds } },
//         { ...search },
//         { gender: { $in: [...gender] } },
//         { ...preference },
//         { ...meetingLocation },
//         { role: "provider" },
//         { verified: true },
//         { ...location },
//         { isComplete: true },
//       ],
//     };
//     console.log(condition);
//     req.query.search = undefined;
//     req.query.location = undefined;
//     req.query.km = undefined;
//     req.query.preference = undefined;
//     req.query.meetingLocation = undefined;
//     req.query.gender = undefined;
//     data = await paginationQueryExtracter(req, User, condition);
//     const users = JSON.parse(JSON.stringify(data.data));
  
//     for (const user of users) {
//       if (await likeCheck(req.user._id, user._id)) {
//         user.isLiked = true;
//       } else {
//         user.isLiked = false;
//       }
//       const distance = calculateDistance(
//         myCords[1],
//         myCords[0],
//         user.location.coordinates[1],
//         user.location.coordinates[0]
//       );
//       user.distanceinKm = distance;
//     }
//     users.sort((a, b) => a.distanceinKm - b.distanceinKm);
//     res.json({
//       status: 200,
//       success: true,
//       message: "Data Retrieved Successfully",
//       results: data.data.length,
//       data: {
//         data: users,
//         totalPages: data.totalPages,
//       },
//     });
//   });
  

exports.createUser=handleFactory.createOne(User);
// exports.deleteUser=handleFactory.deleteOne(User);
exports.updateUser=handleFactory.updateOne(User);
exports.getOneUser=handleFactory.getOne(User);
exports.getAllUsers=handleFactory.getAll(User);

