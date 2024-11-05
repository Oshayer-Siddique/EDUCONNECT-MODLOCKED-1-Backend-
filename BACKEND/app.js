// app.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./Admin/Config/db');
const departmentRoutes = require('./Admin/Routes/departmentRoutes');
const courseRoutes = require('./Admin/Routes/courseRoutes');
const studentRoutes = require('./Admin/Routes/studentRoutes');

// const a = require('./Admin/Routes/studentRoutes');
const port = 8000;



const app = express();
app.use(express.json());

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Hello, Admin!");
  });


app.use('/departments',departmentRoutes);
app.use('/courses',courseRoutes);
app.use('/students',studentRoutes);




  


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });