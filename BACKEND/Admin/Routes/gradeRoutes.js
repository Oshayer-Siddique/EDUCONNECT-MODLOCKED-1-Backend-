const express = require('express');
const router = express.Router();
const { getGradesByStudentAndCourse, getCoursesByStudent, assignGrade, updateGrade } = require('../Controllers/gradeController');

router.get('/grades/:student_id/:course_id', getGradesByStudentAndCourse);
router.get('/courses/:student_id', getCoursesByStudent);
router.post('/assign-grade', assignGrade);
router.put('/update-grade', updateGrade);

module.exports = router;