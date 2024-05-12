const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 64,
    },
    contact: {
      type: String,
      required: true,
      unique: true
    },
    role: {
      type: String,
      enum: ["student", "faculty", "staff", "counsellor", 'admin'],
      required: true,
    },
    active:{
      type: Boolean,
      default: false
    },
    picture: {
      type: String,
    },
    counsellorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // Additional fields based on role
    studentDetails: {
      rollNo: {
        type: String
      },
      degree: {
        type: String,
      },
    },
    facultyDetails: {
      employeeId: {
        type: String
      },
      designation: {
        type: String,
      },
      department: {
        type: String,
      },
    },
    staffDetails: {
      employeeId: {
        type: String
      },
      designation: {
        type: String,
      },
    },
    counsellorDetails: {
      employeeId: {
        type: String
      },
      designation: {
        type: String,
      },
    },
    adminDetails:{
      employeeId: {
        type: String
      },
      designation: {
        type: String,
      },
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;