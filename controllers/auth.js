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

      let userExist = await User.findOne({ email });
      if (userExist) 
        return res.status(400).send({ success: false, message: "Email is already taken"});

      console.log(userExist)
      if(userExist)
      {
        if (userExist['studentDetails']['rollNo'] === rollNo) {
          return res.status(400).send({ success: false, message: "Roll No is already taken" });
        }
      }
        
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

      let userExist = await User.findOne({ email });
      if (userExist) 
        return res.status(400).send({ success: false, message: "Email is already taken"});

      if(userExist)
      {
        if (userExist['facultyDetails']['employeeId'] === employeeId) {
          return res.status(400).send({ success: false, message: "Employee ID is already taken" });
        }
      }  
              
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

      let userExist = await User.findOne({ email });
      if (userExist) 
        return res.status(400).send({ success: false, message: "Email is already taken"});

      if(userExist)
      {
        if (userExist['staffDetails']['employeeId'] === employeeId) {
          return res.status(400).send({ success: false, message: "Employee ID is already taken" });
        }
      }  
      const staffDetails = {
        employeeId,
        designation
      }  

      // hash the password using bcrypt in hashedPassword variable
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, contact,password: hashedPassword,role, staffDetails });
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
    if (!user) {
      return res.status(404).send({ message:"No user found"});
    }


    // Check if the password is correct
    const matchPassword = await bcrypt.compare(password, user.password);
    console.log("Match Password------>",matchPassword)
    if (!matchPassword) 
      return res.status(400)({ message: 'Invalid credentials'});

    const token = jwt.sign(
      { id: user.id }, process.env.JWT_SECRET, { expiresIn: '6h' }
    );


      return res.status(200).send({ message: 'User signed in successfully', user, token })
  } catch (err) {
    return res.status(400).send({message:"Error. Please try again"});
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Successfully logged out" });
  } catch (err) {
    console.log(err);
  }
};

const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id).select("-password").exec();
    console.log("CURRENT_USER", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  register,
  login,
  logout,
  currentUser,
};
