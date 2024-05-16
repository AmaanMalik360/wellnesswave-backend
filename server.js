const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const User = require("./models/user")
const app = express();
app.use(cors());
app.use(express.json());

// mongodb+srv://amaanmalik0360:wellnesswave@cluster0.qw0i9kd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

const mongoUri = "mongodb+srv://f190349:Up4YupdpeLGWM20g@cluster0.mv1ezb7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


mongoose.connect(mongoUri)
.then(() => {
  console.log("DB connection established");
})
.catch((err) => {
  console.error("DB connection failed", err);
});


// To get environment variable
dotenv.config({ path: './.env' });

// Setting up router
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post')
const appointmentRoutes = require('./routes/appointment');

// All the routes are used here.
app.use(authRoutes);
app.use(postRoutes);
app.use(appointmentRoutes);

// // Define the user object to insert
// const newUser = {
//   _id:'6645704a7367e129527f735b',
//   name: 'Admin 1',
//   email: 'admin1@gmail.com',
//   password: 'Admin123',
//   contact: '03194104235',
//   role: 'admin',
//   active: true, // Assuming you want the user to be inactive initially
//   adminDetails: {
//     employeeId: 'admin1',
//     designation: 'Admin'
//   }
// };

// // Insert the new user
// User.create(newUser)
//   .then((user) => {
//     console.log('User created successfully:', user);
//     mongoose.connection.close(); // Close the MongoDB connection
//   })
//   .catch((error) => {
//     console.error('Error creating user:', error);
//     mongoose.connection.close(); // Close the MongoDB connection in case of error
//   });

const port = 3002;
app.listen(port, () => { // Use server.listen instead of app.listen
  console.log(`server listening on port:${port}`);
})