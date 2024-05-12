const express = require("express");
const router = express.Router();
const { register, login, getAllUsers, changePermission, getAllCounsellors, getOneUser, assignCounsellor } = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/users", getAllUsers);
router.get("/users/:id", getOneUser);
router.get("/counsellors", getAllCounsellors);
router.post("/change-permission/:adminId", changePermission);
router.post("/assign-counsellor/:adminId", assignCounsellor);

module.exports = router;
