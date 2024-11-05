const db = require("../Config/db")

async function getAllCourses(req, res) {
    try {
        const [results] = await db.promise().query('SELECT * FROM course');
        res.json(results);
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ error: 'Failed to retrieve courses' });
    }
}

function createCourse(req, res) {
    const sql = 'INSERT INTO course (department_id, title, description) VALUES (?, ?, ?)';
    const { department_id, title, description } = req.body;

    // Validate input
    if (!department_id || !title) {
        return res.status(400).json({ message: 'Department ID and Title are required.' });
    }

    db.query(sql, [department_id, title, description], (err, result) => {
        if (err) {
            console.error('Error inserting course:', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }
        res.status(201).json({ id: result.insertId, department_id, title, description });
    });
}


//get by dept ID
async function getCourseById  (req, res) {
    const sql = 'SELECT * FROM course WHERE course_id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
};



// Update a department
async function updateCourse(req, res) {
    const {  title, description } = req.body;
    const courseId = req.params.id;

    // Validate input
    if (!title && !description) {
        return res.status(400).json({ message: 'At least one field (department_id, title, description) must be provided for update.' });
    }

    // Build the update object dynamically
    const updatedCourse = {};
    if (title) updatedCourse.title = title;
    if (description) updatedCourse.description = description;

    const sql = 'UPDATE course SET ? WHERE course_id = ?';

    db.query(sql, [updatedCourse, courseId], (err, result) => {
        if (err) {
            console.error('Error updating course:', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        res.json({ message: 'Course updated successfully', courseId });
    });
}



// Delete a department
async function deleteCourse(req, res){
    const sql = 'DELETE FROM course WHERE course_id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Department deleted successfully' });
    });
};





module.exports = { 
    getAllCourses,
    createCourse,
    updateCourse,
    getCourseById,
    deleteCourse,


 };
