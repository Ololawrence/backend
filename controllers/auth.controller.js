const config = require("../config/config");
const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = db.user;
const Role = db.role;

module.exports.Signup = (req, res) => {
  const { password, username, email } = req.body;

  if (!username) {
    res.status(400).json({
      message: "username  filled cannot be empty",
    });
    return;
  }
  if (!email) {
    res.status(400).json({
      message: "email  filled cannot be empty",
    });
    return;
  }
  if (!password) {
    res.status(400).json({
      message: "password  filled cannot be empty",
    });
    return;
  }
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
  });
  try {
    user.save((err, user) => {
      if (err) {
        res.status(500).json({ message: err.message });
        return;
      }
      if (req.body.roles) {
        Role.find(
          {
            name: { $in: req.body.roles },
          },
          (err, roles) => {
            if (err) {
              res.status(500).json({ message: err });
              return;
            }
            user.roles = roles.map((role) => role._id);
            user.save((err) => {
              if (err) {
                res.status(500).json({ message: err });
                return;
              }
              res
                .status(201)
                .json({ message: "User was registered successfully!" });
            });
          }
        );
      } else {
        Role.findOne({ name: "user" }, (err, role) => {
          if (err) {
            res.status(500).json({ message: err.message });
            return;
          }
          user.roles = [role._id];
          user.save((err) => {
            if (err) {
              res.status(500).json({ message: err.message });
              return;
            }
            res.status(201).json({
              message: "User was registered successfully!",
              payload: user,
            });
          });
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).json({ message: err });
        return;
      }
      if (!user) {
        return res.status(404).json({ message: "User Not found." });
      }
      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).json({
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      let token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });
      var authorities = [];
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).json({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
      });
    });
};

exports.getAllUser = (req, res) => {
  User.find()
    .then((user) => {
      return res.status(200).json({
        users: user,
      });
    })
    .catch((err) => {
      return res.send(err.message);
    });
};

exports.getSingleUser = (req, res) => {
  const id = req.params.id;

  User.findOne({ _id: id }).then((user) => {
    if (!user) {
      return res.status(400).json({
        msg: "user not found",
      });
    }
    return res.status(200).json({
      email: user.email,
      username: user.username,
    });
  });
};
