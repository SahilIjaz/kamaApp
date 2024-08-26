const express=require('express')
const app=express()
app.use(express.json())


const userRoutes=require('./routes/userRoutes');
const termsAndConditionsRoutes=require('./routes/termsAndConditionsRoutes');
const reviewROutes=require('./routes/reviewRoutes');
const reportRoutes=require('./routes/reportRoutes');
const privacyPolicyROutes=require('./routes/privacyPolicyRoutes');
const likeRoutes=require('./routes/likeRoutes');
const bookingRoutes=require('./routes/bookingRutes');
const blockRoutes=require('./routes/blockRoutes');
const historyRoutes=require('./routes/historyRoutes.js');
const feedBackRoutes=require('./routes/feedBackRoutes');
const globalErrorControllers=require('./controllers/errControllers.js');


app.use('/api/v1/user',userRoutes);
app.use('/api/v1/term',termsAndConditionsRoutes);
app.use('/api/v1/review',reviewROutes);
app.use('/api/v1/report',reportRoutes);
app.use('/api/v1/policy',privacyPolicyROutes);
app.use('/api/v1/like',likeRoutes);
app.use('/api/v1/booking',bookingRoutes);
app.use('/api/v1/block',blockRoutes);
app.use('/api/v1/history',historyRoutes);
app.use('/api/v1/feedBack',feedBackRoutes);


app.use(globalErrorControllers);


module.exports=app;
