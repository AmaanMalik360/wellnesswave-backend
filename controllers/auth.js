const User = require('../models/user')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    const { formData } = req.body;
    const { name, email, password, contact, role } = formData;
    
    if (!name) 
      return res.status(400).send({ success: false, message: "Name is required"});

    if (!email) 
      return res.status(400).send({ success: false, message: "Email is required"});
    
    let userExist = await User.findOne({ email });
    if (userExist) 
      return res.status(400).send({ success: false, message: "Email is already taken"});

    if (!password || password.length < 6) {
      return res
        .status(400)
        .send({ success: false, message:"Password is required and must be at least 6 characters"});
    }

    if (!contact)
      return res.status(400).send({ success: false, message: 'Contact is required'});
    
    if (contact.length < 11)
      return res.status(400).send({ success: false, message: 'Contact is Invalid'});

    if (!role)
      return res.status(400).send({ success: false, message: 'Role is undefined'});

    // console.log("Request Body", req.body)
    if (role === 'student') {
      const { rollNo, degree } = formData;
      // Validation for student
      const regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
      if (!name.match(regName))
        return res.status(400).send({ success: false, message: "Name is not valid"});

      const mailStudentFormat = /^f\d{6}@cfd\.nu\.edu\.pk$/;
      if (!email.match(mailStudentFormat))
        return res.status(400).send({ success: false, message: "Email is not valid"});

      const studentPasswordFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
      if (!password.match(studentPasswordFormat)) {
        return res
          .status(400)
          .send({
            success: false, message: "Password is not valid. Enter a capital letter along with a special character with a minimum of 6 characters"
          });
      }
      if (!rollNo)
        return res.status(400).send({ success: false, message: "Roll number is required"});

      const regRoll = /^\d{2}F-\d{4}$/;
      if (!regRoll.test(rollNo))
        return res.status(400).send({ success: false, message: "Roll number is invalid"});

      // Check if any user already has the provided rollNo in their studentDetails
      let userRollNoExist = await User.findOne({ role: 'student', 'studentDetails.rollNo': rollNo });
      if (userRollNoExist) 
        return res.status(400).send({ success: false, message: "Roll No is already taken" });
      
        
      const studentDetails = { rollNo, degree }
      // hash the password using bcrypt in hashedPassword variable
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({ name, rollNo, email, contact, password: hashedPassword, role, studentDetails });
      await user.save();
      console.log("User saved", user);

      return res.status(200).send({ success: true, message: 'User Created Successfully' });
    } 
    // if role is faculty
    else if (role === 'faculty') {
      // Logic for faculty registration
      const { employeeId, designation, department } = formData;

      // Validation for faculty
      // Add validation checks for faculty fields here

      // Check if any user already has the provided employeeId in facultyDetails, staffDetails, or counsellorDetails
      let empIdExist = await User.findOne({
        $or: [
          { role: 'faculty', 'facultyDetails.employeeId': employeeId },
          { role: 'staff', 'staffDetails.employeeId': employeeId },
          { role: 'counsellor', 'counsellorDetails.employeeId': employeeId }
        ]
      });
      if (empIdExist) 
        return res.status(400).send({ success: false, message: "Employee ID is already taken" });
              
      const facultyDetails = {
        employeeId,
        designation,
        department
      }

      // hash the password using bcrypt in hashedPassword variable
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, contact, email, password: hashedPassword, role, facultyDetails });
      await user.save();
      console.log("User saved", user);

      return res.status(200).send({ success: true, message: 'User Created Successfully' });
    } 
    // if role is staff
    else if (role === 'staff') {

      // Logic for staff registration
      const { employeeId, designation } = formData;

      // Validation for staff
      // Add validation checks for staff fields here

      // Check if any user already has the provided employeeId in facultyDetails, staffDetails, or counsellorDetails
      let empIdExist = await User.findOne({
        $or: [
          { role: 'faculty', 'facultyDetails.employeeId': employeeId },
          { role: 'staff', 'staffDetails.employeeId': employeeId },
          { role: 'counsellor', 'counsellorDetails.employeeId': employeeId }
        ]
      });
      if (empIdExist) 
        return res.status(400).send({ success: false, message: "Employee ID is already taken" });

      const staffDetails = {
        employeeId,
        designation,
      };  

      // hash the password using bcrypt in hashedPassword variable
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, contact,password: hashedPassword,role, staffDetails });
      await user.save();

      console.log("User Saved", user);
      return res.status(200).send({ success: true, message: 'User Created Successfully' });
    } 
    else if(role === 'counsellor')
    {
      
      // Logic for counsellor registration
      const { employeeId, designation } = formData;

      // Validation for counsellor
      // Add validation checks for counsellor fields here

      // Check if any user already has the provided employeeId in facultyDetails, staffDetails, or counsellorDetails
      let empIdExist = await User.findOne({
        $or: [
          { role: 'faculty', 'facultyDetails.employeeId': employeeId },
          { role: 'staff', 'staffDetails.employeeId': employeeId },
          { role: 'counsellor', 'counsellorDetails.employeeId': employeeId }
        ]
      });

      if (empIdExist) 
        return res.status(400).send({ success: false, message: "Employee ID is already taken" });
      
      const counsellorDetails = {
        employeeId,
        designation
      }  

      // hash the password using bcrypt in hashedPassword variable
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, contact,password: hashedPassword, role, counsellorDetails });
      await user.save();

      console.log("User Saved", user);
      return res.status(200).send({ success: true, message: 'User Created Successfully' }); 
    }
    else if(role === 'admin')
    {
      
      // Logic for counsellor registration
      const { employeeId, designation } = formData;

      // Validation for counsellor
      // Add validation checks for counsellor fields here

      // Check if any user already has the provided employeeId in facultyDetails, staffDetails, or counsellorDetails
      let empIdExist = await User.findOne({
        $or: [
          { role: 'faculty', 'facultyDetails.employeeId': employeeId },
          { role: 'staff', 'staffDetails.employeeId': employeeId },
          { role: 'counsellor', 'counsellorDetails.employeeId': employeeId }
        ]
      });

      if (empIdExist) 
        return res.status(400).send({ success: false, message: "Employee ID is already taken" });
      
      const adminDetails = {
        employeeId,
        designation
      }  

      const user = new User({ name, email, contact,password, role, adminDetails });
      await user.save();

      console.log("User Saved", user);
      return res.status(200).send({ success: true, message: 'User Created Successfully' }); 
    }
    else {
      return res.status(400).send({ success: false, message: "Invalid role" });
    }
  } 
  catch (err) {
    console.log(err);
    return res.status(400).send({ success: false, message: "Error. Please try again" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    const user = await User.findOne({ email });
    console.log(user);
    if (!user) 
      return res.status(404).send({ message:"No user found"});

    if(user.role === 'admin')
    {
      if(password === user.password)
      {
        const token = jwt.sign(
          { id: user.id }, process.env.JWT_SECRET, { expiresIn: '6h' }
        );
    
        return res.status(200).send({ message: 'User signed in successfully', user, token })
      }
    }
    // Check if the password is correct
    const matchPassword = await bcrypt.compare(password, user.password);
    console.log("Match Password------>",matchPassword)
    if (!matchPassword) 
      return res.status(400).send({ message: 'Invalid credentials'});

    if(!user.active)
      return res.status(403).send({ message: 'You are not allowed to sign in.'});
    
    const token = jwt.sign(
      { id: user.id }, process.env.JWT_SECRET, { expiresIn: '6h' }
    );

    return res.status(200).send({ message: 'User signed in successfully', user, token })
  } catch (err) {
    return res.status(400).send({message:"Error. Please try again"});
  }
};

// Controller function to fetch all Users
const getAllUsers = async (req, res) => {
  try {
      const users = await User.find()
      res.status(200).send({users});
  } catch (error) {
      console.error("Error fetching Users:", error);
      res.status(500).send({ error: "Failed to fetch Users" });
  }
};

const changePermission = async (req, res) => {
  try {
    const { userId } = req.body; // Assuming userId is extracted from JWT payload

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).send({ message: "User not found" });
    }
    
    console.log("User Before Updating:", user)
    // Toggle the active flag
    user.active = !user.active;

    console.log("User after updating:", user)
    const newUser = await user.save();
    console.log("User after Saving:", newUser)
    
    res.status(200).send({ message: "User permission changed successfully", newUser });
  } catch (err) {
    console.error("Error changing user permission:", err);
    res.status(500).send({ message: "Failed to change user permission" });
  }
};

const assignCounsellor = async (req, res) => {
  try {
    const { userId, counsellorId } = req.body;

    console.log("Counsellor Id",counsellorId)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { counsellorId },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ message: "Counsellor assigned successfully", user: updatedUser });
  } catch (err) {
    console.error("Error assigning counsellor:", err);
    res.status(500).send({ message: "Failed to assign counsellor" });
  }
};

// Controller function to fetch all counsellor
const getAllCounsellors = async (req, res) => {
  try {
      const counsellors = await User.find({role: 'counsellor'})
      res.status(200).send({counsellors});
  } catch (error) {
      console.error("Error fetching Users:", error);
      res.status(500).send({ error: "Failed to fetch Users" });
  }
};

// Controller function to fetch a Users
const getOneUser = async (req, res) => {
  try {
      const user = await User.findById(req.params.id)
      res.status(200).send({user});
  } catch (error) {
      console.error("Error fetching Users:", error);
      res.status(500).send({ error: "Failed to fetch Users" });
  }
};

module.exports = {
  register,
  login,
  getAllUsers,
  changePermission,
  getAllCounsellors,
  assignCounsellor,
  getOneUser
};
