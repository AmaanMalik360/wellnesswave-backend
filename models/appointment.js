const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Appointment Schema
const appointmentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    counsellorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Passed', 'Ongoing', 'Coming'],
        default: 'Coming'
    },
    attendance: {
        type: String,
        enum: ['Present', 'Absent','Unattended'],
        default: 'Unattended'
    }
});
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;