const express = require('express');
const router = express.Router();

const {enrollMultipleStudents,unenrollStudent,getAllEnrollments} = require('../Controllers/studentEnrollController');


router.post('/enroll',enrollMultipleStudents);
router.delete('/unenroll',unenrollStudent);
router.get('/enrollments',getAllEnrollments);

module.exports = router;


