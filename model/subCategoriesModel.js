const mongoose = require('mongoose');
const slugify = require('slugify');
const subCategoriesSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        trim:true,
        required:[true,'Please provide name!']
    },

    slug:String,
    image:{
        type:String
    },
    Category:{
        type:mongoose.Schema.ObjectId,
        ref:'Category',
        required:[true,'Sub category must belong to Category!']
    },

    // Product:[{
    //     type:mongoose.Schema.ObjectId,
    //     ref:'Product'
    // }],
    createdAt:{
        type:Date,
        defulat:Date.now()
    }
});

subCategoriesSchema.pre('save',function(next){
    this.slug = slugify(this.name,{lower:true});
    next();
});

subCategoriesSchema.pre(/^find/,function(next){
    this.populate({
        path:'Category',
        select:'-SubCategory'
    })
    // .populate({
    //     path:'Product',
    //     select:'-subCategory -description -reviews'
    // })
    next();
});


const Subcategory = mongoose.model('subcategory',subCategoriesSchema);
module.exports = Subcategory;