const express = require('express');
const router = express.Router();

const {enrollMultipleTeachers,unenrollTeacher,getAllAssignments} = require('../Controllers/teacherAssignController');


router.post('/enroll',enrollMultipleTeachers);
router.delete('/unenroll',unenrollTeacher);
router.get('/assignments',getAllAssignments);

module.exports = router;
