const Product = require('../model/productModel');
const multer = require('multer');
const sharp = require('sharp');
const Subcategory = require('../model/subCategoriesModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


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

exports.uploadProductImage = upload.fields([
    {name:'imageCover',maxCount:1},
    {name:'images',maxCount:3}
]);


exports.resizeProductImage =catchAsync(async (req,res,next)=>{
    if(!req.files.imageCover || !req.files.images) return next();

    // 1) Cover image
     req.body.imageCover = `product-${req.params.id}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
    .resize(2000,1333)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`public/img/products/${req.body.imageCover}`);

    // 2) Images
    req.body.images = [];
   await Promise.all( req.files.images.map(async(file,i) => {
     const filename = `product-${req.params.id}-${Date.now()}-${i+1}.jpeg`;
        await sharp(file.buffer)
        .resize(2000,1333)
        .toFormat('jpeg')
        .jpeg({quality:90})
        .toFile(`public/img/products/${filename}`);
        req.body.images.push(filename);
    }));

  next();
});
exports.getAllProduct = catchAsync(async (req,res,next)=>{
    const allProduct = await Product.find();
    if(!allProduct){
        return next(new AppError('Not found!',404));
    }
    res.status(200).json({
        status:'success',
        data:{
            allProduct
        }
    });
});

exports.getOne = catchAsync(async (req,res,next)=>{
    const product = await Product.findById(req.params.id).populate('subcategory');
    if(!product){
        return next(new AppError('No document found with that ID',404));
    }
    res.status(200).json({
        status:'sucess',
        data:{
            product
        }
    });
});

exports.productList = async(req,res,next)=>{
    try{
    let query = Product.find({subCategory:req.params.subcategory});
    const productLists = await query;
    if(!productLists){
        return next(new AppError('No document found with that ID',404));
    }
    res.status(200).json({
        status:'success',
        productLists
    })
}
catch(err){
    console.log(err.message);
}
};

exports.createOne = catchAsync(async (req,res,next)=>{
    const newProduct = await Product.create(req.body);
    await Subcategory.findByIdAndUpdate({_id:newProduct.subCategory._id},{$push:{Product:newProduct._id}})
    res.status(201).json({
        status:'sucess',
        data:{
            newProduct
        }
    });
});


exports.updateOne = catchAsync(async (req,res,next)=>{
    const updateProduct = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    });
    
    if(!updateProduct){
        return next(new AppError('No document found with that ID',404));
    }

    // await Subcategory.findByIdAndUpdate({_id:updateProduct.subCategory._id},{$push:{Product:updateProduct._id}})


    res.status(200).json({
        status:'sucess',
        data:{
            updateProduct
        }
    });
});

exports.deleteOne = catchAsync(async (req,res,next)=>{
   const _id = req.params.id
    const deleteProduct = await Product.findByIdAndUpdate(_id,{active:false});
    await Subcategory.findByIdAndDelete({_id:deleteProduct._id},{$pull:{Product:deleteProduct._id}})
    if(!deleteProduct){
        return next(new AppError('No document found with that ID',404));
    }

    res.status(204).json({
        status:'sucess',
        data:{
            data:null
        }
    });
});






