const Report=require('../models/reportModel');
const catchAsync=require('../utils/caychAsync');
const appError=require('../utils/appError');
const handlerFactory=require('../controllers/handlerFactory');

//creator
// exports.creator=catchAsync(async(req,res,next)=>{
//     req.body.creator=req.user._id;
//     next();
// });

//reportSomene
exports.reportUser=catchAsync(async(req,res,next)=>{

    const report=await Report.create({
        reason:req.body.reason,
        description:req.body.description
    });

    if(!req.body.reason||!req.body.description)
    {
return next(new appError('Reason or Description not provided!',404));
    };

    report.reported=req.params.id;
    report.creator=req.user._id;
    await report.save();

    if(!report)
    {
        return next(new appError('Report was not created!',404));
    };

    res.status(200).json({
        message:`${report.reported.role} has been reported!`,
        status:200,
        Report:{
            report
        }
    });
});


//getAllReport
exports.getAllReport=catchAsync(async(req,res,next)=>{

    const report=await Report.find();

    if(report.length===0)
    {return res.status(404).json({
        message:'Data was not found!',
        status:404,
        reason:'There exists no report!'
    })};

    res.status(200).json({
        message:'Report was added!',
        statu:200,
        length:report.length,
        Report:{
            report
        }
    });
});

//updateReport
exports.updateReport=handlerFactory.updateOne(Report);

//delteReport
exports.deleteReport=handlerFactory.deleteOne(Report);
