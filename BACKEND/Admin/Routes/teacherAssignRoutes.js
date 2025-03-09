const express = require('express');
const router = express.Router();

const {enrollMultipleTeachers,
    unenrollTeacher,
    getAllAssignments,
    getCoursesForTeacher} = require('../Controllers/teacherAssignController');


router.post('/enroll',enrollMultipleTeachers);
router.delete('/unenroll',unenrollTeacher);
router.get('/assignments',getAllAssignments);
router.get('/courses/:teacherId',getCoursesForTeacher);

module.exports = router;
