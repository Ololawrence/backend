const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  const { username, email } = req.body;
  // find by username
  User.findOne({username}).exec((err, user) => {
    if (err) {
      return res.status(500).json({ messgae: err.message });
    }
    if (user) {
      return res.status(400).json({
        message: "failed!, username already in use",
      });
    }

    User.findOne({email}).exec((err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }
      if (result) {
        return res.json(400).json({
          message: "email is already in use",
        });
      }

      next();
    });
  });
  // find by email
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).json({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`,
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};
module.exports = verifySignUp;
