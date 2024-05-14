const express = require("express");
const { createAppointment, getAllAppointments, getAppointmentById, deleteAppointmentById, getAppointmentByUserId, getAppointmentByCounsellorIdForToday, getAllUserAppointmentsForToday, getAllCounsellorAppointmentsForAdmin } = require("../controllers/appointments");
const router = express.Router();

// Route to create a appointment
router.post("/appointments", createAppointment);

// Route to fetch all appointments
router.get("/appointments", getAllAppointments);

// Route to retrieve a specific appointment by appointmentId
router.get("/appointments/:id", getAppointmentById);

// Route to retrieve appointments a user has today by userId
router.get("/appointments/user-today/:userId", getAllUserAppointmentsForToday);

// Route to retrieve a specific appointment by userId
router.get("/appointments/user/:userId", getAppointmentByUserId);

// Route to retrieve appointments a counsellor has today by counsellorId
router.get("/appointments/counsellor/:counsellorId", getAppointmentByCounsellorIdForToday);

// Route to retrieve appointments a counsellor has in total for admin by counsellorId
router.get("/appointments/all-counsellor/:counsellorId", getAllCounsellorAppointmentsForAdmin);

// Route to delete an appointment
router.delete("/appointments/:id", deleteAppointmentById);

module.exports = router;
