const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
const path = require("path");


var PORT = process.env.PORT || 3017;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

mongoose.connect(process.env.MONGODB_URI || "mongodb://cnmiller127:superBase93!@ds055525.mlab.com:55525/heroku_rsb12l8c", {useNewUrlParser: true});

// routes
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}! http://localhost:3011`);
});

