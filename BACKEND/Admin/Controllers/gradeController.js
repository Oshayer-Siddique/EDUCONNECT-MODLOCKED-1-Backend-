const db = require("../Config/db");

async function getGradesByStudentAndCourse(req, res) {
    const { student_id, course_id } = req.params;
    const sql = 'SELECT * FROM grade WHERE student_id = ? AND course_id = ?';

    try {
        const [results] = await db.promise().query(sql, [student_id, course_id]);
        if (results.length > 0) {
            const gradeData = results[0];
            const totalMarks = gradeData.quiz1_marks + gradeData.quiz2_marks + gradeData.quiz3_marks + gradeData.assignments_marks + gradeData.attendance_marks + gradeData.mid_sem_marks + gradeData.final_sem_marks;

            // Call the PL/SQL function to calculate the grade
            const [gradeResult] = await db.promise().query('SELECT calculate_grade(?, ?, ?, ?, ?, ?, ?) AS grade', [
                gradeData.quiz1_marks,
                gradeData.quiz2_marks,
                gradeData.quiz3_marks,
                gradeData.assignments_marks,
                gradeData.attendance_marks,
                gradeData.mid_sem_marks,
                gradeData.final_sem_marks
            ]);

            const grade = gradeResult[0].grade;

            res.json({ ...gradeData, total_marks: totalMarks, grade });
        } else {
            res.status(404).json({ error: 'Grades not found' });
        }
    } catch (error) {
        console.error('Error fetching grades:', error);
        res.status(500).json({ error: 'Failed to retrieve grades' });
    }
}

async function getCoursesByStudent(req, res) {
    const { student_id } = req.params;
    const sql = 'SELECT course.course_id, course.title FROM course JOIN student_enroll ON course.course_id = student_enroll.course_id WHERE student_enroll.student_id = ?';

    try {
        const [results] = await db.promise().query(sql, [student_id]);
        res.json(results);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Failed to retrieve courses' });
    }
}

module.exports = { getGradesByStudentAndCourse, getCoursesByStudent };