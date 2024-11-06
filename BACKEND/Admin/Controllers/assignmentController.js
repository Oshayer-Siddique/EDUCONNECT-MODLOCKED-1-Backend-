const db = require('../Config/db')
const notificationController = require('./notificationController');


// Create a new assignment and notify all enrolled students in the course
exports.createAssignment = async (req, res) => {
    const { course_id, title, description, due_date, max_points } = req.body;

    try {
        // Step 1: Insert the assignment into the database
        const [result] = await db.promise().query(
            'INSERT INTO assignment (course_id, title, description, due_date, max_points) VALUES (?, ?, ?, ?, ?)',
            [course_id, title, description, due_date, max_points]
        );

        // Step 2: Notify all students enrolled in the course
        const assignmentId = result.insertId;
        const message = `New assignment created: ${title}`;
        const notificationResults = await notificationController.notifyAllEnrolledStudents(course_id, message);

        res.json({
            message: 'Assignment created and notifications sent.',
            assignmentId: assignmentId,
            notificationResults: notificationResults // To check if all notifications were successfully sent
        });
    } catch (error) {
        console.error('Error creating assignment:', error);
        res.status(500).json({ error: 'Failed to create assignment and send notifications.' });
    }
};




// Get all notifications for a specific student
exports.getNotificationsForStudent = async (req, res) => {
    const studentId = req.params.studentId;

    try {
        const [results] = await db.promise().query(
            'SELECT * FROM notifications WHERE student_id = ? ORDER BY created_at DESC',
            [studentId]
        );

        if (results.length === 0) {
            res.json({ message: 'No notifications found for this student.' });
        } else {
            res.json(results);
        }
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Error fetching notifications' });
    }
};
