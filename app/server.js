const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const formData = require("express-form-data");
const postRouter = require("./routes/post.routes");
const otherRouter = require("./routes/other.routes");
const userRouter = require("./routes/user.routes");
const majorRouter = require("./routes/major.routes");
const workplaceRouter = require("./routes/workplace.routes");
const companyRouter = require("./routes/company.routes");
const statsRouter = require("./routes/stats.routes");
require('./configs/passport')(passport);

const app = express();

var corsOptions = {
  origin: "http://localhost:8081",
};


// use the strategy
// passport.use(strategy);

app.use(express.json());
app.use(formData.parse());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");
db.sequelize.sync()


app.use('/api/post', postRouter);
app.use('/api/other', otherRouter);
app.use('/api/user', userRouter);
app.use('/api/major', majorRouter);
app.use('/api/workplace', workplaceRouter);
app.use('/api/company', companyRouter);
app.use('/api/stats', statsRouter);

app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  if (err.message){
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  }
  
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});