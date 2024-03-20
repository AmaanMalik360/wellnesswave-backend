const express = require("express");
const router = express.Router();
// const { requireSignin } = require("../middlewares/index");
const { register, login, logout, currentUser } = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
// router.get("/logout", logout);
// router.get("/current-user", requireSignin, currentUser);

module.exports = router;
