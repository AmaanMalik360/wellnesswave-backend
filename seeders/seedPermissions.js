const mongoose = require('mongoose')
const Permission = require('../models/permissions')

const mongoUri = "mongodb+srv://amaanmalik0360:wellnesswave@cluster0.qw0i9kd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(mongoUri)
.then(() => {
  console.log("DB connection established");
})
.catch((err) => {
  console.error("DB connection failed", err);
});

const seedPermissions = [
    {
        name: 'Active'
    }
]

const seedDB = async () =>{
    await Permission.deleteMany({})
    await Permission.insertMany(seedPermissions)
}

seedDB().then(() => {
    mongoose.connection.close();
})