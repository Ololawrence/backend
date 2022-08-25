const express = require("express");
const  verifySignUp  = require("../middlewares/verifySignup");
const controller = require("../controllers/auth.controller");
const router = express.Router();

router.post(
  "/api/auth/signup",
  [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
  controller.Signup
);
router.post("/api/auth/signin", controller.signin);
router.get("/api/user/all", controller.getAllUser);
router.get("/api/user/:id", controller.getSingleUser);

module.exports = router;
