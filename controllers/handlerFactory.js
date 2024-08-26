const cathcAsync=require('../utils/caychAsync')
const appError=require('../utils/appError')

//createOne
exports.createOne=(Model)=>cathcAsync(async(req,res,next)=>{
    console.log('API HIt FOR CREATING ONE ')
    const doc=await Model.create(req.body)
    console.log('NEW CREATED !')
    if(!doc)
    {return next(new appErorr('Documnet not created!',404))}
    console.log('CHECKED CNDITION')
    res.status(200).json({
        message:'New document created!',
        status:200,
        success:true,
        document:{
            doc
        }
    })
})


//GetOne
exports.getOne=(Model)=>cathcAsync(async(req,res,next)=>{
    console.log('API HIt FOR Getting ONE ')
    const doc=await Model.findById(req.params.id)
    console.log('Data got!')
    if(!doc)
    {return next(new appError('Requested document not found !',404))}
    console.log('condition checked')
    res.status(200).json({
        message:'Requested data found !',
        status:200,
        success:true,
        Documnent:{
            doc
        }
    })
})

//GetAll
exports.getAll=(Model)=>cathcAsync(async(req,res,next)=>{
    console.log('API HIt FOR Getting all ')
    const doc=await Model.find()
       console.log('DAta got!')
    if(!doc)
    {return next('No data found!',404)}
    console.log('condition checked')
    res.status(200).json({
        message:'Requested documents found',
        status:200,
        success:true,
        length:doc.length,
        documents:{
            doc
        }
    })
})

//updateOne
exports.updateOne=(Model)=>cathcAsync(async(req,res,next)=>{
    const doc=await Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true,
    runValidators:true}
    )
    if(!doc)
    {return next(new appError('Documnet not updated!',404))}
    res.status(200).json({
message:'Document updated successfully !',
status:200,
documnet:{
    doc
}
    })
})

//deletOne
exports.deleteOne=(Model)=>cathcAsync(async(req,res,next)=>{
    const doc=await Model.findByIdAndDelete(req.params.id)
    if(doc)
    {return next(new appError('Data was nor deleted!',404))}
    res.status(201).json({
        message:'Data deleted successfully',
        status:201,
        doc:null
    })
})