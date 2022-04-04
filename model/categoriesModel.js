const mongoose = require('mongoose');
const slugify = require('slugify');
const categoriesSchema  = new mongoose.Schema({
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

    // SubCategory:[{
    //     type:mongoose.Schema.ObjectId,
    //     ref:'subcategory'
    // }],
    active:{
        type:Boolean,
        default:true,
        select:false
    }
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
categoriesSchema.pre('save',function(next){
    if(!this.isModified('name')){
        return next();
    } 
    this.slug = slugify(this.name,{lower:true});
    next();
});

categoriesSchema.pre(/^find/,function(next){
    // this points to the current query
    this.find({active:{$ne:false}});
    next();
});

categoriesSchema.pre('save',function(next){
    this.slug = slugify(this.name,{lower:true});
    next();
});


// Slug will update when you update category
categoriesSchema.methods.slugUpdate = function(){
    this.slug = slugify(this.name,{lower:true});
}
const Category = mongoose.model('Category',categoriesSchema);
module.exports = Category;