const express = require('express');
const router = express.Router();

const {enrollMultipleStudents,unenrollStudent} = require('../Controllers/studentEnrollController');


router.post('/enroll',enrollMultipleStudents);
router.delete('/unenroll',unenrollStudent);


module.exports = router;


