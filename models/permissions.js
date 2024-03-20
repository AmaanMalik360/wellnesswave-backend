const mongoose = require('mongoose');

const permissionsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

const Permission = mongoose.model('Permission', permissionsSchema);
module.exports = Permission;