const db = require("../Config/db")

async function getAllStudents(req, res) {
    try {
        const [results] = await db.promise().query('SELECT * FROM student');
        res.json(results);
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ error: 'Failed to retrieve student' });
    }
}

async function createStudent(req, res) {
    const sql = 'INSERT INTO student (name, email, password) VALUES (?, ?, ?)';
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    // Check if the email is already taken
    db.query('SELECT * FROM student WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error checking email:', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }
        if (results.length > 0) {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        // Proceed to insert the new student
        db.query(sql, [name, email, password], (err, result) => {
            if (err) {
                console.error('Error inserting student:', err);
                return res.status(500).json({ message: 'Internal server error.' });
            }
            res.status(201).json({ id: result.insertId, name, email });
        });
    });
}


//get by dept ID
async function getStudentById  (req, res) {
    const sql = 'SELECT * FROM student WHERE student_id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
};



// Update a department
async function updateStudent(req, res) {
    const { student_id, name, email, password } = req.body;
    const currentStudentId = req.params.id; // The original student ID from the URL parameters

    // Validate input
    if (!name && !email && !password && !student_id) {
        return res.status(400).json({ message: 'At least one field (name, email, password, student_id) must be provided for update.' });
    }

    // Build the update object dynamically
    const updatedStudent = {};
    if (name) updatedStudent.name = name;
    if (email) updatedStudent.email = email;
    if (password) updatedStudent.password = password;

    // Check if changing the student_id and if it already exists
    if (student_id && student_id !== currentStudentId) {
        // Check for unique student_id
        db.query('SELECT * FROM student WHERE student_id = ?', [student_id], (err, results) => {
            if (err) {
                console.error('Error checking new student_id:', err);
                return res.status(500).json({ message: 'Internal server error.' });
            }
            if (results.length > 0) {
                return res.status(400).json({ message: 'Student ID already exists.' });
            }

            // Proceed to update the student
            const sql = 'UPDATE student SET ? WHERE student_id = ?';
            db.query(sql, [updatedStudent, currentStudentId], (err, result) => {
                if (err) {
                    console.error('Error updating student:', err);
                    return res.status(500).json({ message: 'Internal server error.' });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'Student not found.' });
                }

                // Update the student_id if it was changed
                const updateIdSql = 'UPDATE student SET student_id = ? WHERE student_id = ?';
                db.query(updateIdSql, [student_id, currentStudentId], (err) => {
                    if (err) {
                        console.error('Error updating student ID:', err);
                        return res.status(500).json({ message: 'Internal server error.' });
                    }
                    res.json({ message: 'Student updated successfully', studentId: student_id });
                });
            });
        });
    } else {
        // Proceed to update the student without changing student_id
        const sql = 'UPDATE student SET ? WHERE student_id = ?';
        db.query(sql, [updatedStudent, currentStudentId], (err, result) => {
            if (err) {
                console.error('Error updating student:', err);
                return res.status(500).json({ message: 'Internal server error.' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Student not found.' });
            }

            res.json({ message: 'Student updated successfully', studentId: currentStudentId });
        });
    }
}




// Delete a department
async function deleteStudent(req, res){
    const sql = 'DELETE FROM student WHERE student_id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Student deleted successfully' });
    });
};





module.exports = { 
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent


 };
