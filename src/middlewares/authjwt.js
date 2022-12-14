const db = require("../models/index");
const User = db.user;
const Role = db.role;

function verifyToken (req, res, next) {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).json({ message: "No token provided!" });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};


function isAdmin  (req, res, next) {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).json({ message: err });
      return;
    }
    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).json({ message: err });
          return;
        }
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }
        res.status(403).json({ message: "Require Admin Role!" });
        return;
      }
    );
  });
};
function isModerator (req, res, next)  {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).json({ message: err });
      return;
    }
    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).json({ message: err });
          return;
        }
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "moderator") {
            next();
            return;
          }
        }
        res.status(403).json({ message: "Require Moderator Role!" });
        return;
      }
    );
  });
};
const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
};
module.exports = authJwt;