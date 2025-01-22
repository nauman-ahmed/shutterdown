const express = require('express');
const http = require("http")
const app = express();
const userRouter = require('./Routes/userRoutes');
const clientRouter = require('./Routes/AddClientRoutes');
const viewClientRouter = require('./Routes/ViewClientRoutes');
const DailyTaskRouter = require('./Routes/DailyTaskRoutes');
const EventOptionsRouter = require('./Routes/EventOptionsRoutes');
const WhatsappRouter = require('./Routes/Whatsapp');
const DeliverableOptionsRouter = require('./Routes/DeliverableOptionsRoutes');
const AttendenceRouter = require('./Routes/AttendenceRoutes');
const DeadlineDaysRouter = require('./Routes/DeadlineDaysRoutes');
const notificationRouter = require("./Routes/notificationRoutes")
const Database = require('./DataBase/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const eventRouter = require('./Routes/EventRouter');
const deliverableRouter = require('./Routes/deliverableRouter');
const BackupRouter = require("./Routes/Backup")
const { applyBackupSchedule } = require('./utils/backupSchedule');
const ClientModel = require('./models/ClientModel');
require('dotenv').config();

const PORT = 5002;

app.use(cors());
// Set CORS headers manually
// Add middleware to set CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET",
    "POST",
    "OPTIONS",
    "PATCH",
    "DELETE",
    "POST",
    "PUT"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const server = http.createServer(app)

require("./socketHandler")(server)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/", userRouter);

app.use(clientRouter);
app.use(eventRouter);
app.use(deliverableRouter);
app.use(notificationRouter);
app.use(DeadlineDaysRouter);
app.use('/', AttendenceRouter);
app.use('/', BackupRouter);
app.use(viewClientRouter);
app.use('/', DailyTaskRouter);
app.use('/eventOptions', EventOptionsRouter);
app.use('/deliverableOptions', DeliverableOptionsRouter);
app.use('/Whatsapp', WhatsappRouter);
applyBackupSchedule()





server.listen(PORT, () => {
  try {
    console.log(`Server is running at port ${PORT}`);
  } catch (error) {
    console.log("Server Error");
  }
});