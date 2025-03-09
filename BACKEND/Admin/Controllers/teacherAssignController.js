const db = require('../Config/db');


async function enrollMultipleTeachers(req, res) {
    const { course_id, teacher_id } = req.body;

    if (!course_id || !teacher_id) {
        return res.status(400).json({ message: 'Both Course ID and Teacher ID are required.' });
    }

    try {
        // Check if the course exists
        const [courseResults] = await db.promise().query('SELECT * FROM course WHERE course_id = ?', [course_id]);
        if (courseResults.length === 0) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        // Check if the teacher exists
        const [teacherResults] = await db.promise().query('SELECT * FROM teacher WHERE teacher_id = ?', [teacher_id]);
        if (teacherResults.length === 0) {
            return res.status(404).json({ message: 'Teacher not found.' });
        }

        // Check if the course is already assigned to another teacher
        const [existingAssignment] = await db.promise().query(
            'SELECT * FROM teacher_assignment WHERE course_id = ?',
            [course_id]
        );
        if (existingAssignment.length > 0) {
            return res.status(409).json({ message: 'This course is already assigned to a teacher.' });
        }

        // Assign the course to the teacher
        const enrollSql = 'INSERT INTO teacher_assignment (teacher_id, course_id) VALUES (?, ?)';
        await db.promise().query(enrollSql, [teacher_id, course_id]);

        res.status(201).json({ message: 'Teacher successfully assigned to course.' });
    } catch (error) {
        console.error('Error assigning teacher to course:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

async function unenrollTeacher(req, res) {
    const { teacher_id, course_id } = req.body;

    // Validate input
    if (!teacher_id || !course_id) {
        return res.status(400).json({ message: 'Teacher ID and Course ID are required.' });
    }

    // Delete the enrollment record
    const unenrollSql = 'DELETE FROM teacher_assignment WHERE teacher_id = ? AND course_id = ?';
    db.query(unenrollSql, [teacher_id, course_id], (err, result) => {
        if (err) {
            console.error('Error unenrolling teacher:', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Enrollment not found.' });
        }
        res.json({ message: 'Teacher unenrolled successfully' });
    });
}


async function getAllAssignments(req, res) {
    try {
        const [results] = await db.promise().query('SELECT * FROM teacher_assignment');
        res.json(results);
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({ error: 'Failed to retrieve assignments' });
    }
}



module.exports = {
    enrollMultipleTeachers,
    unenrollTeacher,
    getAllAssignments,
}