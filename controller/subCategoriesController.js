const Subcategory = require('../model/subCategoriesModel');
// const category = require('../model/categoriesModel');
const AppError = require('../utils/appError');
const multer = require('multer');
const sharp = require('sharp')
const catchAsync = require('../utils/catchAsync');


const multerStorage = multer.memoryStorage();
const multerFilter = (req,file,cb)=>{
  if(file.mimetype.startsWith('image')){
    cb(null,true);
  }
  else{
    cb(new AppError('Not an image! Please upload only image...',400),false);
  }
}

const upload = multer({
storage:multerStorage,
fileFilter:multerFilter
});

exports.uploadSubcategoryPhoto = upload.single('image');
exports.resizeSubcategoryPhoto = catchAsync( async (req,res,next)=>{
    let imageName;
    if(!req.params.id){
      imageName =  req.body.name;
    }
    else{
        imageName = req.params.id;
    }
  if(!req.file) return next();
  req.file.filename = `subcategory-${imageName}-${Date.now()}.jpeg`;

 await sharp(req.file.buffer)
  .resize(500,500)
  .toFormat('jpeg')
  .jpeg({quality:90})
  .toFile(`public/img/subcategory/${req.file.filename}`);

  next();
});


exports.getAllSubcategory = catchAsync(async (req,res,next)=>{
    const subCategories = await Subcategory.find();
    if(subCategories.length == 0){
        return next(new AppError("Category is Empty!",404));
    }
    res.status(200).json({
        status:'sucess',
        data:{
            subCategories
        }
    });
});

exports.getOne = catchAsync(async(req,res,next)=>{
    let query = Subcategory.find(req.params.id);
    const doc = await query;
    if(!doc){
        return next(new AppError('No document found with that ID',404));
    }
    res.status(200).json({
        status:'success',
        doc
    })
});


exports.getSubcategory = async(req,res,next)=>{
    try{
    let query = Subcategory.find({Category:req.params.category});
    const subCategories = await query;
    if(!subCategories){
        return next(new AppError('No document found with that ID',404));
    }
    res.status(200).json({
        status:'success',
        subCategories
    })
}
catch(err){
    console.log(err.message);
}
};


exports.createSubcategory = catchAsync(async (req,res,next)=>{
    const name  = req.body.name;
    const Category= req.body.Category;
    const image = req.file.filename;
    const newSubcategory = await Subcategory.create({name,Category,image});
    // await category.findByIdAndUpdate({_id:newSubcategory.Category},{$push:{SubCategory:newSubcategory._id}});
   res.status(201).json({
        status:'sucess',
        category:{
            newSubcategory
        }
    });
});

exports.deleteSubcategory = catchAsync(async (req,res,next)=>{
    const _id = req.params.id
    const deleteSubcategory = await Subcategory.findByIdAndDelete(_id);
 
    await category.updateMany({_id:deleteSubcategory.Category},{$pull:{SubCategory:deleteSubcategory._id}});
    
    if(!deleteSubcategory){
        return next(new AppError('No document found with that ID',404));
    }
    res.status(200).json({
        status:"deleted"
    });
});

exports.updateSubcategory = catchAsync(async(req,res,next)=>{
    const updateSubcategory = await Subcategory.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    });
    
    // updateSubcategory.slugUpdate();
    if(!updateSubcategory){
        return next(new AppError('No document found with that ID',404));
    }
    res.status(200).json({
        status:"sucess",
        data:{
           update: updateSubcategory
        }
    });
});