const express = require('express');
const router = express.Router();

const assignmentController = require('../Controllers/assignmentController');


router.post('/create',assignmentController.createAssignment);


module.exports = router;