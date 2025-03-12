const express = require('express');
const router = express.Router();

const { enrollMultipleStudents,
        unenrollStudent,
        getAllEnrollments,
        getCoursesByStudentId} = require('../Controllers/studentEnrollController');


router.post('/enroll',enrollMultipleStudents);
router.delete('/unenroll',unenrollStudent);
router.get('/enrollments',getAllEnrollments);
routter.get('/enrollments/:student_id',getCoursesByStudentId);

module.exports = router;


