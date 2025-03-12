const express = require('express');
const router = express.Router();

const { 
    getAllTeachers, 
    getTeacherById, 
    createTeacher, 
    updateTeacher, 
    deleteTeacher, 
    getTeacherEvent, 
    addTeacherEvent, 
    deleteTeacherEvent 
} = require('../Controllers/teacherController');

router.get('/', getAllTeachers);
router.post('/create', createTeacher);
router.get('/read/:id', getTeacherById);
router.put('/update/:id', updateTeacher);
router.delete('/delete/:id', deleteTeacher);
router.get('/get-event/:teacher_id', getTeacherEvent);
router.post('/add-event/:teacher_id', addTeacherEvent);
router.delete('/delete-event/:id', deleteTeacherEvent);

module.exports = router;
