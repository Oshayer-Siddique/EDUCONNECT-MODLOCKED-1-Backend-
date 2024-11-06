const db = require("../Config/db");

// Get all teachers
async function getAllTeachers(req, res) {
    try {
        const [results] = await db.promise().query('SELECT * FROM teacher');
        res.json(results);
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ error: 'Failed to retrieve teachers' });
    }
}

// Create a new teacher
async function createTeacher(req, res) {
    const sql = 'INSERT INTO teacher (department_id, name, email, password) VALUES (?, ?, ?, ?)';
    const { department_id, name, email, password } = req.body;

    // Validate input
    if (!department_id || !name || !email || !password) {
        return res.status(400).json({ message: 'Department ID, name, email, and password are required.' });
    }

    // Check if the email is already taken
    db.query('SELECT * FROM teacher WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error checking email:', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }
        if (results.length > 0) {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        // Proceed to insert the new teacher
        db.query(sql, [department_id, name, email, password], (err, result) => {
            if (err) {
                console.error('Error inserting teacher:', err);
                return res.status(500).json({ message: 'Internal server error.' });
            }
            res.status(201).json({ id: result.insertId, department_id, name, email });
        });
    });
}

// Get a teacher by ID
async function getTeacherById(req, res) {
    const sql = 'SELECT * FROM teacher WHERE teacher_id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error('Error fetching teacher:', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Teacher not found.' });
        }
        res.json(result);
    });
}

// Update a teacher
async function updateTeacher(req, res) {
    const { teacher_id, department_id, name, email, password } = req.body;
    const currentTeacherId = req.params.id; // The original teacher ID from the URL parameters

    // Validate input
    if (!name && !email && !password && !teacher_id && !department_id) {
        return res.status(400).json({ message: 'At least one field (name, email, password, teacher_id, department_id) must be provided for update.' });
    }

    // Build the update object dynamically
    const updatedTeacher = {};
    if (name) updatedTeacher.name = name;
    if (email) updatedTeacher.email = email;
    if (password) updatedTeacher.password = password;
    if (department_id) updatedTeacher.department_id = department_id;

    // Check if changing the teacher_id and if it already exists
    if (teacher_id && teacher_id !== currentTeacherId) {
        // Check for unique teacher_id
        db.query('SELECT * FROM teacher WHERE teacher_id = ?', [teacher_id], (err, results) => {
            if (err) {
                console.error('Error checking new teacher_id:', err);
                return res.status(500).json({ message: 'Internal server error.' });
            }
            if (results.length > 0) {
                return res.status(400).json({ message: 'Teacher ID already exists.' });
            }

            // Proceed to update the teacher
            const sql = 'UPDATE teacher SET ? WHERE teacher_id = ?';
            db.query(sql, [updatedTeacher, currentTeacherId], (err, result) => {
                if (err) {
                    console.error('Error updating teacher:', err);
                    return res.status(500).json({ message: 'Internal server error.' });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'Teacher not found.' });
                }

                // Update the teacher_id if it was changed
                const updateIdSql = 'UPDATE teacher SET teacher_id = ? WHERE teacher_id = ?';
                db.query(updateIdSql, [teacher_id, currentTeacherId], (err) => {
                    if (err) {
                        console.error('Error updating teacher ID:', err);
                        return res.status(500).json({ message: 'Internal server error.' });
                    }
                    res.json({ message: 'Teacher updated successfully', teacherId: teacher_id });
                });
            });
        });
    } else {
        // Proceed to update the teacher without changing teacher_id
        const sql = 'UPDATE teacher SET ? WHERE teacher_id = ?';
        db.query(sql, [updatedTeacher, currentTeacherId], (err, result) => {
            if (err) {
                console.error('Error updating teacher:', err);
                return res.status(500).json({ message: 'Internal server error.' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Teacher not found.' });
            }

            res.json({ message: 'Teacher updated successfully', teacherId: currentTeacherId });
        });
    }
}

// Delete a teacher
async function deleteTeacher(req, res) {
    const sql = 'DELETE FROM teacher WHERE teacher_id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error('Error deleting teacher:', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }
        res.json({ message: 'Teacher deleted successfully' });
    });
}

module.exports = {
    getAllTeachers,
    getTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacher
};
