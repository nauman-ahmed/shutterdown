const express = require('express');
const app = express();
const userRouter = require('./Routes/userRoutes');
const clientRouter = require('./Routes/AddClientRoutes');
const viewClientRouter = require('./Routes/ViewClientRoutes');
const previewClientRouter = require('./Routes/MyProfileRoutes');
const MyProfileRouter = require('./Routes/userRoutes');
const DailyTaskRouter = require('./Routes/DailyTaskRoutes');
const AttendenceRouter = require('./Routes/AttendenceRoutes');
const Database = require('./DataBase/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const eventRouter = require('./Routes/EventRouter');
dotenv.config({ path: './config.env' });
const PORT = 5002;
// const path = require('path');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/', userRouter);

app.use(clientRouter);
app.use(eventRouter);

app.use('/', AttendenceRouter);
app.use('/', previewClientRouter);
app.use('/', viewClientRouter);
app.use('/', MyProfileRouter);
app.use('/', DailyTaskRouter);


app.listen(PORT, () => {
  try {
    console.log(`Server is running at port ${PORT}`);
  } catch (error) {
    console.log('Server Error');
  }
});
