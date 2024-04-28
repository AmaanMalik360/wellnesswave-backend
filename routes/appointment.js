const express = require("express");
const { createAppointment, getAllAppointments, getAppointmentById } = require("../controllers/appointments");
const router = express.Router();

// Route to create a appointment
router.post("/appointments", createAppointment);

// Route to fetch all appointments
router.get("/appointments", getAllAppointments);

// Route to retrieve a specific appointment by appointmentId
router.get("/appointments/:id", getAppointmentById);

module.exports = router;
