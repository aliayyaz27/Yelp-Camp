const mongoose=require('mongoose'); 
const cities=require('./cities');
const {places , descriptors}=require('./seedhelpers');
const Campground=require('../models/campground');

mongoose.set("strictQuery",false);
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample=(array)=>array[Math.floor(Math.random()*array.length)];

const seedDB=async()=>{
    await Campground.deleteMany({});
    // const c=new Campground({title:'Purple Fields'})
    // await c.save();
    for(let i=0;i<200;i++){
        const random1000=Math.floor(Math.random()*1000);
        const price= Math.floor(Math.random()*20)+10;
        const camp=new Campground({
            author:'64e9e72741a54d59cb30d7f7',
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni nulla, fugit voluptates natus nesciunt quo similique excepturi suscipit itaque libero iure, vel qui! Architecto voluptas pariatur voluptatem ipsum similique. Fugit.',
            price,
            geometry: { 
                type: 'Point', 
                coordinates: [ 
                    cities[random1000].longitude, 
                    cities[random1000].latitude 
                ] 
            },
            images:[
                {
                  url: 'https://res.cloudinary.com/dieogu4aj/image/upload/v1693387634/YelpCamp/fzwdaiasg825t5bc4rpn.jpg',
                  filename: 'YelpCamp/fzwdaiasg825t5bc4rpn', 
                },
                {
                  url: 'https://res.cloudinary.com/dieogu4aj/image/upload/v1693387633/YelpCamp/kllr2anofd4pzzpysjfd.jpg',
                  filename: 'YelpCamp/kllr2anofd4pzzpysjfd',
                }
              ]
        })
        await camp.save();
    }
}
seedDB().then(()=>{
    mongoose.connection.close();
})