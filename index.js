const express = require('express');
const app = express();
const userRouter = require('./Routes/userRoutes');
const clientRouter = require('./Routes/AddClientRoutes');
const viewClientRouter = require('./Routes/ViewClientRoutes');
const DailyTaskRouter = require('./Routes/DailyTaskRoutes');
const AttendenceRouter = require('./Routes/AttendenceRoutes');
const Database = require('./DataBase/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const eventRouter = require('./Routes/EventRouter');
const deliverableRouter = require('./Routes/deliverableRouter');
dotenv.config({ path: './config.env' });
const path = require('path');
const PORT = 5002;

app.use(express.static(path.join(__dirname, "frontend/build")));
app.get("*", function (_, res) {
    res.setHeader("Content-Type", "text/html");
    res.sendFile(
        path.join(__dirname, "frontend/build/index.html"),
        function (err) {
            res.status(500).send(err);
        }, 
    );
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/', userRouter);

app.use(clientRouter);
app.use(eventRouter);
app.use(deliverableRouter);

app.use('/', AttendenceRouter);
app.use('/', viewClientRouter);
app.use('/', DailyTaskRouter);


app.listen(PORT, () => {
  try {
    console.log(`Server is running at port ${PORT}`);
  } catch (error) {
    console.log('Server Error');
  }
});
