// app.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./Admin/Config/db');
const departmentRoutes = require('./Admin/Routes/departmentRoutes');
const port = 8000;



const app = express();
app.use(express.json());

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Hello, Admin!");
  });


app.use('/departments',departmentRoutes);



  


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });