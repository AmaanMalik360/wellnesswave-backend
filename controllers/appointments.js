const Appointment = require("../models/appointment");

const createAppointment = async (req, res) => {
    const { userId, date, startTime, endTime, counsellorId } = req.body;
    try {
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
        
        // Check if there is a conflicting appointment
        const existingAppointment = await Appointment.findOne({
          date: parsedDate,
          startTime: parsedStartTime,
          counsellorId,
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
    res.status(200).send({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

// Controller function to retrieve a specific appointment by appointmentId
const getAppointmentById = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: "appointment not found" });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ error: "Failed to fetch appointment" });
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
};
