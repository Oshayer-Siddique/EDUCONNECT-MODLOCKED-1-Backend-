const express = require('express');
const router = express.Router();
const { getAllDepartments,getDepartmentByName,
    createDepartment } = require('../Controllers/departmentController');




router.get('/', getAllDepartments);
router.post('/create',createDepartment);
router.get('/:name',getDepartmentByName);
module.exports = router;