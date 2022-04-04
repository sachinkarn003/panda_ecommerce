const mongoose = require('mongoose');
const slugify = require('slugify');
const productSchema  = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provide name!'],
        trim:true,
        unique:true
    },

    price:{
        type:Number,
        required:[true,'Please proved price!'],
    },
    imageCover:{
        type:String
    },
    images:[String],
    features:[String],
    color:String,
    ratingAverage:{
        type:Number,
        default:4.5,
        min:[1,'Rating must be above 1.0'],
        max:[5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) / 10
    },
    slug:String,
    description:{
        type:String,
        trim:true,
    },
    reviews:[
        {
        userId:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
        review:String
        }
    ],

    quantity:{
        type:Number,
        required:[true,'specifiy the quantity!']
    },
    
    tag:String,
    subCategory:{
        type:mongoose.Schema.Types.ObjectId, ref:'subcategory',
        required:[true,'Product must belongs to Subcategory']      
    },
    active:{
        type:Boolean,
        default:true,
        select:false
    }
});

productSchema.pre('save',function(next){
    this.slug = slugify(this.name,{lower:true});
    next();
});

productSchema.pre(/^find/,function(next){
    // this points to the current query
    this.find({active:{$ne:false}});
    next();
});

productSchema.pre(/^find/,function(next){
    this.populate({
        path:'reviews.userId'
    })
    // .populate({
    //     path:'subCategory',
    //     select:"-Product -Category"
    // });
    next();
})
const Product = mongoose.model('Product',productSchema);
module.exports  = Product;