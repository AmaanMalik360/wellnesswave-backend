const express = require("express");
const { createAppointment, getAllAppointments, getAppointmentById, deleteAppointmentById, getAppointmentByUserId, getAppointmentByCounsellorId } = require("../controllers/appointments");
const router = express.Router();

// Route to create a appointment
router.post("/appointments", createAppointment);

// Route to fetch all appointments
router.get("/appointments", getAllAppointments);

// Route to retrieve a specific appointment by appointmentId
router.get("/appointments/:id", getAppointmentById);

// Route to retrieve a specific appointment by userId
router.get("/appointments/user/:userId", getAppointmentByUserId);

// Route to retrieve a specific appointment by counsellorId
router.get("/appointments/counsellor/:counsellorId", getAppointmentByCounsellorId);

// Route to delete an appointment
router.delete("/appointments/:id", deleteAppointmentById);

module.exports = router;
