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
      enum: ["student", "faculty", "staff", "counsellor"],
      required: true,
    },
    picture: {
      type: String,
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
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;