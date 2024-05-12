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

        console.log("Friday Deadline",fridayDeadline)

        // Check if there is an appointment for the user until Friday at 4:30 PM
        const appointmentTillFriday = await Appointment.findOne({
            userId,
            startTime: { $lte: fridayDeadline }
        });

        if (appointmentTillFriday) {
            return res.status(409).send({ message: "You already have an appointment scheduled this week." });
        }
        
        // Check if there is a conflicting appointment
        const existingAppointment = await Appointment.findOne({
          date: parsedDate,
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
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).send({ error: "appointment not found" });
    }

    return res.status(200).send(appointment);
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

const getAppointmentByCounsellorId = async (req, res) => {
  try {
    const counsellorId = req.params.counsellorId;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to start of the day
    const counsellorAppointments = await Appointment.find({
      counsellorId: counsellorId,
      date: { $gte: today }
    }).populate('counsellorId') // Populate the counsellor object
      .populate('userId'); // Populate the user object

    if (!counsellorAppointments.length) {
      return res.status(404).send({ error: "Appointments not found" });
    }

    return res.status(200).send({ counsellorAppointments });
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

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  deleteAppointmentById,
  getAppointmentByUserId,
  getAppointmentByCounsellorId
};
