const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {descriptors,places}= require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/YelpCamp', {
    useNewUrlParser:true,
    // useCreateIndex:true,
    useUnifiedTopology:true

});

const sample = array=>array[Math.floor(Math.random()*array.length)];

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connectino error:"));
db.once("open",()=>{
    console.log("Database Connected");
});


const seedDB = async ()=>{
    await Campground.deleteMany({});
    for(let i =0;i<50;i++){
        const price = Math.floor(Math.random()*20) +10;
       const random1000 = Math.floor(Math.random()*1000);
       const c = new Campground({
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        title: `${sample(descriptors)} ${sample(places)}`,
        image: 'https://source.unsplash.com/collection/483251',
        description:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Inventore nihil corrupti iste reprehenderit sit earum tenetur expedita, aperiam cupiditate asperiores eius molestiae eveniet soluta quibusdam laborum voluptas quidem quaerat explicabo?',
        price
    })
    
    await c.save();
}
}

seedDB().then(()=>{
    mongoose.connection.close();
});