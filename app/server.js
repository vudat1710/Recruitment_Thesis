const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const errors = require("http-errors");
const cookieParser = require("cookie-parser");
const formData = require("express-form-data");

const app = express();

var corsOptions = {
  origin: "http://localhost: 8081",
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");
db.sequelize.sync()

require("./routes/post.routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});