const mongoose =  require("mongoose");
require("dotenv").config();
const dbConnection = () => {
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("data base is connected successfully ");
    })
    .catch((err)=>{
        console.log("error while connectioning database");
        console.log(err)
    })
} 
module.exports = dbConnection;
