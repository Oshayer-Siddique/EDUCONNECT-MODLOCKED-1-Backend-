// app.js
const express = require('express');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const http = require('http');
const db = require('./Admin/Config/db');
const departmentRoutes = require('./Admin/Routes/departmentRoutes');
const courseRoutes = require('./Admin/Routes/courseRoutes');
const studentRoutes = require('./Admin/Routes/studentRoutes');
const studentEnrollRoutes = require('./Admin/Routes/studentEnrollRoutes');
const teacherAssignRoutes = require('./Admin/Routes/teacherAssignRoutes');
const teacherRoutes = require('./Admin/Routes/teacherRoutes');
const assignmentRoutes = require('./Admin/Routes/assignmentRoutes');
const announcementRoutes = require('./Admin/Routes/announcementRoutes');
const loginRoutes = require('./Admin/Routes/loginRoutes');
const gradeRoutes = require('./Admin/Routes/gradeRoutes');
const cors = require('cors');

const port = 8000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello, Admin!");
});
const messagesRoute = require('./Admin/Routes/messageRoutes');

app.use('/departments', departmentRoutes);
app.use('/courses', courseRoutes);
app.use('/students', studentRoutes);
app.use('/teacher', teacherRoutes);
app.use('/studentenroll', studentEnrollRoutes);
app.use('/teacherassign', teacherAssignRoutes);
app.use('/assignment', assignmentRoutes);
app.use('/announcement', announcementRoutes);
app.use('/login', loginRoutes);
app.use('/grades', gradeRoutes);
app.use('/messages', messagesRoute);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('sendMessage', (message) => {
    io.emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});