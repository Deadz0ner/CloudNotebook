const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/inotebook";

// const connectToMongo = ()=>{
//     mongo.connect(mongoURI, ()=>{
//         console.log("connected to MongoDB")
//     })
// }
// // async function connectToMongo() {
// //     await mongoose.connect(mongoURI).then(()=> console.log("Connected to Mongo Successfully")).catch(err => console.log(err));
// //   }


// module.export = connectToMongo;



    async function connectToMongo() {
        await mongoose.connect(mongoURI).then(()=> console.log("Connected to Mongo Successfully")).catch(err => console.log(err));
      }
    console.log('Connected to MongoDB');


module.exports = connectToMongo;


