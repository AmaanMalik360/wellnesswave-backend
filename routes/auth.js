const express = require("express");
const router = express.Router();
const { register, login, getAllUsers, changePermission, getAllCounsellors } = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/users", getAllUsers);
router.get("/counsellors", getAllCounsellors);
router.post("/change-permission/:adminId", changePermission);

module.exports = router;
