const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const ExpressError= require('./utils/ExpressError');
const {campgroundSchema,reviewSchema} = require('./schema.js')
const catchAsync = require('./utils/catchAsync')
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const session = require('express-session')
const Campground = require('./models/campground');
const Review = require('./models/review');


const campgrounds = require('./routes/campground')
const reviews = require('./routes/reviews')

mongoose.connect('mongodb://localhost:27017/YelpCamp', {
    useNewUrlParser:true,
    // useCreateIndex:true,
    useUnifiedTopology:true
});



const db = mongoose.connection;
db.on("error",console.error.bind(console,"connectino error:"));
db.once("open",()=>{
    console.log("Database Connected");
});

const app = express();

app.engine('ejs',ejsMate);   //use this instead of below regular one
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))


const sessionConfig = {
    secret:'nagarajgoandkeepforrice',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews',reviews)

app.get('/',(req,res)=>{
    res.render('home');
})

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404));
})

app.use((err,req,res,next)=>{
     const {statusCode=500} = err;
     if(!err.message)  err.message='Ops, Something went wrong!'
     res.status(statusCode).render('error',{err});
})

app.listen(3000, ()=>{
    console.log("listening on port 3000");
})