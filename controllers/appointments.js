const Appointment = require("../models/appointment");
const User = require("../models/user");

const createAppointment = async (req, res) => {
    const { userId, date, startTime, endTime, counsellorId } = req.body;
    try {        
        const user = await User.findById(userId);

        // Parse date string into Date object
        const parsedDate = new Date(date);
        // Manually adjust the date by adding a day
        parsedDate.setDate(parsedDate.getDate() + 1); 

        // Create new Date objects for startTime and endTime on the server side
        const parsedStartTime = new Date(startTime);
        const parsedEndTime = new Date(endTime);

        // Adjust startTime and endTime for timezone difference (if necessary)
        parsedStartTime.setHours(parsedStartTime.getHours() + 5);
        parsedEndTime.setHours(parsedEndTime.getHours() + 5);

        // Calculate the deadline for appointments until Friday at 4:30 PM
        const fridayDeadline = new Date();
        fridayDeadline.setHours(16, 30, 0, 0); // 4:30 PM
        fridayDeadline.setDate(fridayDeadline.getDate() + (5 - fridayDeadline.getDay())); // Move to Friday
        fridayDeadline.setHours(fridayDeadline.getHours() + 6);

        // Calculate the end of next week (Friday at 4:30 PM)
        const fridayNextWeek = new Date(fridayDeadline);
        fridayNextWeek.setDate(fridayDeadline.getDate() + 7);
        fridayNextWeek.setHours(16, 30, 0, 0);

        console.log("Friday This Deadline",fridayDeadline)
        console.log("Friday Next Deadline",fridayNextWeek)

        // Check if there is an appointment for the user until Friday at 4:30 PM
        const appointmentThisWeek = await Appointment.findOne({
            userId,
            startTime: { $lte: fridayDeadline }
        });
        // Check if there is an appointment for the user until Friday at 4:30 PM
        const appointmentNextWeek = await Appointment.findOne({
            userId,
            startTime: { $gte: fridayDeadline, $lte: fridayNextWeek }
        });
        
        if(appointmentThisWeek)
        {
          if (parsedStartTime < fridayDeadline) {
              return res.status(409).send({ message: "You already have an appointment scheduled this week." });
          }
        }

        if(appointmentNextWeek && parsedStartTime >= fridayDeadline && parsedStartTime <= fridayNextWeek)
        {
          return res.status(409).send({ message: "You already have an appointment scheduled next week." });
        }
        
        // Check if there is a conflicting appointment
        const existingAppointment = await Appointment.findOne({
          startTime: parsedStartTime,
          counsellorId: counsellorId,
        });

        if (existingAppointment) {
          return res.status(409).send({ message: "This slot is already booked" });
        }

        console.log({
          userId,
          date: parsedDate,
          startTime: parsedStartTime,
          endTime: parsedEndTime,
          counsellorId,
        })

        // Create a new appointment object using the parsed fields
        const appointment = new Appointment({
            userId,
            date: parsedDate,
            startTime: parsedStartTime,
            endTime: parsedEndTime,
            counsellorId,
        });

        // Save the appointment to the database
        const savedAppointment = await appointment.save();

        return res.status(201).send({ message: "Appointment created successfully", appointment: savedAppointment });
    } catch (err) {
        console.error("Error creating appointment:", err);
        return res.status(500).send({ message: "An error occurred while creating the appointment" });
    }
};

// Controller function to fetch all appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    return res.status(200).send({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return res.status(500).send({ error: "Failed to fetch appointments" });
  }
};

// Controller function to retrieve a specific appointment by appointmentId
const getAppointmentById = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findById(appointmentId).populate('counsellorId').populate('userId'); 
    if (!appointment) {
      return res.status(404).send({ error: "appointment not found" });
    }

    return res.status(200).send({appointment});
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return res.status(500).send({ error: "Failed to fetch appointment" });
  }
};

// Controller function to retrieve appointments by a specific user
const getAppointmentByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userAppointments = await Appointment.find({userId: userId});

    if (!userAppointments ) {
      return res.status(404).send({ error: "appointments not found" });
    }

    return res.status(200).send({userAppointments});
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return res.status(500).send({ error: "Failed to fetch appointment" });
  }
};

const getAppointmentByCounsellorIdForToday = async (req, res) => {
  try {
    const counsellorId = req.params.counsellorId;
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0); // Set time to start of the day

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999); // Set time to end of the day

    const counsellorAppointments = await Appointment.find({
      counsellorId: counsellorId,
      startTime: { $gte: startOfDay, $lte: endOfDay },
      status: "Coming"
    }).populate('counsellorId') // Populate the counsellor object
      .populate('userId'); // Populate the user object

    // if (counsellorAppointments.length === 0) {
    //   return res.status(404).send({ error: "Appointments not found for today" });
    // }

    return res.status(200).send({ counsellorAppointments });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return res.status(500).send({ error: "Failed to fetch appointment" });
  }
};

const getAllCounsellorAppointmentsForAdmin = async (req, res) =>{
  try {
    const counsellorId = req.params.counsellorId;
    const counsellorAppointments = await Appointment.find({
      counsellorId: counsellorId
    }).populate('counsellorId')
      .populate('userId');

    return res.status(200).send({counsellorAppointments});
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return res.status(500).send({ error: "Failed to fetch counsellors appointment" });
  }
}

const getAllUserAppointmentsForToday = async (req, res) => {
  try {
    const userId = req.params.userId;
    const appointments = await Appointment.find();

    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0); // Set time to start of the day

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999); // Set time to end of the day

    const userAppointments = await Appointment.find({
      userId: userId,
      startTime: { $gte: startOfDay, $lte: endOfDay },
      status: "Coming"
    })
    // .populate('counsellorId') // Populate the counsellor object
    // .populate('userId'); // Populate the user object
    // console.log({ userAppointments, appointments })
    return res.status(200).send({ userAppointments, appointments });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return res.status(500).send({ error: "Failed to fetch appointment" });
  }
};

// Controller function to delete an appointment by ID
const deleteAppointmentById = async (req, res) => {
    try {
      const {id} = req.params;
      console.log("Id", id)
      // Check if the appointment exists
      const appointment = await Appointment.findById(id);
      if (!appointment) {
          return res.status(404).send({ error: "Appointment not found" });
      }

      // Delete the appointment from the database
      await Appointment.findByIdAndDelete(id);

      return res.status(200).send({ message: "Appointment deleted successfully" });
    } catch (error) {
      console.error("Error deleting appointment:", error);
      return res.status(500).send({ error: "Failed to delete appointment" });
    }
};

// Controller to update appointment status to "Ongoing"
const updateAppointmentStatusOngoing = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "Ongoing" },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ appointment });
  } catch (error) {
    console.error("Error updating appointment status to Ongoing:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller to update appointment status to "Passed" and set attendance
const updateAppointmentStatusPassed = async (req, res) => {
  try {
    const { attendance } = req.query;
    // console.log(attendance)
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "Passed", attendance },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ appointment });
  } catch (error) {
    console.error("Error updating appointment status to Passed:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  deleteAppointmentById,
  getAppointmentByUserId,
  getAllCounsellorAppointmentsForAdmin,
  getAppointmentByCounsellorIdForToday,
  getAllUserAppointmentsForToday,
  updateAppointmentStatusOngoing,
  updateAppointmentStatusPassed
};
