const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const db = require("./models");
const Role = db.role;
const dbConfig = require("./config/config");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

const uri = process.env.DB_URI;
const port = process.env.PORT || 3000;
require("dotenv").config();
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

app.use(authRoutes);
app.use(userRoutes);

app.get("/", (req, res) => {
  res.send("Welcome our to online shop API...");
});

app.get("/products", (req, res) => {
  // res.send(products);
});

db.mongoose
  .connect(
    `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}` || `${uri}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'user' to roles collection");
      });
      new Role({
        name: "moderator",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'moderator' to roles collection");
      });
      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'admin' to roles collection");
      });
    }
  });
}

app.listen(port, () => {
  console.log(`Server running on port: ${port}...`);
});
