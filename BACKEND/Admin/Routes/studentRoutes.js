const express = require('express');
const router = express.Router();

const { getAllStudents,getStudentById,
    createStudent,deleteStudent,updateStudent,getStudentEvent,addStudentEvent,deleteStudentEvent} = require('../Controllers/studentController');





router.get('/', getAllStudents);
router.post('/create',createStudent);
router.get('/read/:id',getStudentById);
router.put('/update/:id',updateStudent);
router.delete('/delete/:id',deleteStudent);
router.get('/get-event/:student_id',getStudentEvent);
router.post('/add-event/:student_id',addStudentEvent);
router.delete('/delete-event/:id',deleteStudentEvent);

module.exports = router;
