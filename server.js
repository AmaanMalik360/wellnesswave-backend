const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require('dotenv');

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = "mongodb+srv://amaanmalik0360:wellnesswave@cluster0.qw0i9kd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

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

// All the routes are used here.
app.use(authRoutes);
app.use(postRoutes);


const port = 3002;
app.listen(port, () => { // Use server.listen instead of app.listen
  console.log(`server listening on port:${port}`);
})