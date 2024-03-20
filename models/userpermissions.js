const mongoose = require('mongoose');

const userPermissionsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming your User model is named 'User'
    required: true
  },
  permissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission', // Assuming your Permission model is named 'Permission'
    required: true
  }
});

const UserPermissions = mongoose.model('UserPermissions', userPermissionsSchema);
module.exports = UserPermissions;
