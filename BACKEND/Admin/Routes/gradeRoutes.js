const express = require('express');
const router = express.Router();
const { getGradesByStudentAndCourse, getCoursesByStudent } = require('../Controllers/gradeController');

router.get('/grades/:student_id/:course_id', getGradesByStudentAndCourse);
router.get('/courses/:student_id', getCoursesByStudent);

module.exports = router;