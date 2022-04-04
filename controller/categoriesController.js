const Category = require('../model/categoriesModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const sharp = require('sharp');

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

exports.uploadCategoryPhoto = upload.single('image');
exports.resizeCategoryPhoto = catchAsync( async (req,res,next)=>{
   let categoryImage;
   if(!req.params.id){
       categoryImage = req.body.name;
    }
    else{
        categoryImage = `${req.params.id}updated`; 
    }
  if(!req.file) return next();
  req.file.filename = `category-${categoryImage}-${Date.now()}.jpeg`;

 await sharp(req.file.buffer)
  .resize(500,500)
  .toFormat('jpeg')
  .jpeg({quality:90})
  .toFile(`public/img/category/${req.file.filename}`);

  next();
});

exports.getAllCategory = catchAsync(async (req,res,next)=>{
    const categories = await Category.find();
    //.populate({path:'SubCategory',select:'-Category -__v -Product'});
    if(categories.length == 0){
        return next(new AppError("Category is Empty!",404));
    }
    res.status(200).json({
        status:'sucess',
        data:{
            categories
        }
    });
});

exports.createCategory = catchAsync(async (req,res,next)=>{
    const newCategory = await Category.create({
        name:req.body.name,
        image:req.file.filename
    });
    res.status(201).json({
        status:'sucess',
        category:{
            newCategory
        }
    });
});

exports.deleteCategory = catchAsync(async (req,res,next)=>{
    const deleteCategory = await Category.findByIdAndDelete(req.params.id);
    if(!deleteCategory){
        return next(new AppError('No document found with that ID',404));
    }
    res.status(200).json({
        status:"deleted"
    });
});

exports.updateCategory = catchAsync(async(req,res,next)=>{
    let query = req.body;
    if(req.file){
        query.image = req.file.filename;
    }
      
    const updateCategory = await Category.findByIdAndUpdate(req.params.id,query,{
        new:true,
        runValidators:true
    });
    // updateCategory.slugUpdate();
    if(!updateCategory){
        return next(new AppError('No document found with that ID',404));
    }
    res.status(200).json({
        status:"sucess",
        data:{
            updateCategory
        }
    });
});