const express = require('express');
const router = express.Router();

const {enrollMultipleTeachers,unenrollTeacher} = require('../Controllers/teacherAssignController');


router.post('/enroll',enrollMultipleTeachers);
router.delete('/unenroll',unenrollTeacher);


module.exports = router;
