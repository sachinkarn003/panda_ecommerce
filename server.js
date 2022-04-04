const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');

const user = require('./router/userRoutes');
const category = require('./router/categoriesRoutes');
const subcategory = require('./router/subCategoriesRoutes');
const product = require('./router/productRoutes')
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');

dotenv.config({path:'./config.env'}); 
const app = express();
const port = process.env.PORT;

mongoose.connect('mongodb://localhost:27017/Panda', 
	{
	 useNewUrlParser: true,
	 useUnifiedTopology: true
	}).then(()=>{
	console.log('Database Connected Successfully');
});

// 1) GLOBAL MIDDLEWARE
	// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
// Set security HTTP headers
app.use(helmet());
app.use(cors());
//Development logging
console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}

//Limit requests from same API
const limiter = rateLimit({
	max:100,
	windowMs: 60 * 60 * 1000,
	message:'Too many requests from this IP, please try again in an hour!'
});

app.use('/api',limiter)

//Body,parser, reading data from body into req.body
app.use(express.json({limit:'10kb'}));

// Data sanitization against NoSQL query injection 
app.use(mongoSanitize());

//Data sanitization against xss
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

app.use('/api/v1/users',user);
app.use('/api/v1/category',category);
app.use('/api/v1/subcategory',subcategory);
app.use('/api/v1/product',product);

app.all("*",(req,res,next)=>{
	next(new AppError(`Can't find ${req.originalUrl} on this server!`,404));
});

app.use(globalErrorHandler);

// console.log(process.env)
app.listen(port,()=>{
    console.log(`Server running on ${port}`);
})