CREATE DATABASE university_management;
USE university_management;


-- Department table
CREATE TABLE department (
    department_id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location TEXT,
    dept_email VARCHAR(255) UNIQUE NOT NULL
);



-- Admin table
CREATE TABLE admin (
    admin_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Teacher table
CREATE TABLE teacher (
    teacher_id BIGINT PRIMARY KEY,
    department_id BIGINT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    date_of_birth DATE,
    blood_group VARCHAR(3),
    department_name VARCHAR(100),
    address TEXT,
    phone_number VARCHAR(15),
    FOREIGN KEY (department_id) REFERENCES department(department_id) ON DELETE SET NULL
);
-- Student table
CREATE TABLE student (
    student_id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address TEXT,
    date_of_birth DATE,
    department VARCHAR(100),
    phone_number VARCHAR(15),
    blood_group VARCHAR(3)
);


-- Course table
CREATE TABLE course (
    course_id BIGINT PRIMARY KEY,
    department_id BIGINT,
    course_department VARCHAR(255),  -- New column for department name
    title VARCHAR(255) NOT NULL,
    description TEXT,
    FOREIGN KEY (department_id) REFERENCES department(department_id) ON DELETE SET NULL
);

-- Teacher Assignment table (relationship between teacher and course)
CREATE TABLE teacher_assignment (
    teacher_id BIGINT,
    course_id BIGINT,
    PRIMARY KEY (teacher_id, course_id),
    FOREIGN KEY (teacher_id) REFERENCES teacher(teacher_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE
);

-- Student Enrollment table (relationship between student and course)
CREATE TABLE student_enroll (
    student_id BIGINT,
    course_id BIGINT,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE
);



CREATE TABLE announcement (
    announcement_id BIGINT NOT NULL AUTO_INCREMENT,
    course_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    PRIMARY KEY (announcement_id, course_id),
    FOREIGN KEY (course_id) REFERENCES student_enroll(course_id) ON DELETE CASCADE
);


-- Assignment table
CREATE TABLE assignment (
    assignment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    course_id BIGINT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATETIME,
    max_points BIGINT,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE
);

ALTER TABLE assignment ADD COLUMN file_path VARCHAR(255);


-- Submission table
CREATE TABLE submission (
    submission_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    assignment_id BIGINT,
    student_id BIGINT,
    content TEXT,
    submitted_at DATETIME,
    score BIGINT,
    FOREIGN KEY (assignment_id) REFERENCES assignment(assignment_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE
);


--notification table


CREATE TABLE notifications (
    notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT,
    course_id BIGINT,  -- Match this data type with course(course_id)
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (course_id) REFERENCES course(course_id)
);



-- Grade table


CREATE TABLE grade (
    student_id BIGINT,
    course_id BIGINT,
    quiz1_marks BIGINT, 
    quiz2_marks BIGINT,
    quiz3_marks BIGINT,
    mid_sem_marks BIGINT,
    final_sem_marks BIGINT,
    assignments_marks BIGINT,
    attendance_marks BIGINT,
    total_marks BIGINT,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE
);


CREATE TABLE student_calender_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE
);


CREATE TABLE messages (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  course_id BIGINT NOT NULL,
  student_id BIGINT,
  teacher_id BIGINT,
  sender_type ENUM('student', 'teacher') NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES teacher(teacher_id) ON DELETE CASCADE
);




-----------------------------------
-------FUNCTIONS-------------------
-----------------------------------

-------------caluculate_grade function----------------

DELIMITER $$

CREATE FUNCTION calculate_grade (
    quiz1_marks BIGINT,
    quiz2_marks BIGINT,
    quiz3_marks BIGINT,
    assignments_marks BIGINT,
    attendance_marks BIGINT,
    mid_sem_marks BIGINT,
    final_sem_marks BIGINT
) RETURNS VARCHAR(2)
DETERMINISTIC
BEGIN
    DECLARE total_marks BIGINT;
    DECLARE grade VARCHAR(2);

    -- Calculate total marks
    SET total_marks = quiz1_marks + quiz2_marks + quiz3_marks +
                      assignments_marks + attendance_marks +
                      mid_sem_marks + final_sem_marks;

    -- Determine grade based on total marks
    IF total_marks >= 240 THEN
        SET grade = 'A+';
    ELSEIF total_marks >= 225 THEN
        SET grade = 'A';
    ELSEIF total_marks >= 210 THEN
        SET grade = 'A-';
    ELSEIF total_marks >= 195 THEN
        SET grade = 'B+';
    ELSEIF total_marks >= 180 THEN
        SET grade = 'B';
    ELSEIF total_marks >= 165 THEN
        SET grade = 'B-';
    ELSEIF total_marks >= 150 THEN
        SET grade = 'C';
    ELSEIF total_marks >= 135 THEN
        SET grade = 'D';
    ELSE
        SET grade = 'F';
    END IF;

    RETURN grade;
END$$

DELIMITER ;



--------- trigger to calculate grade----------------




DELIMITER $$

CREATE TRIGGER grade_marks_validation
BEFORE INSERT ON grade
FOR EACH ROW
BEGIN
    -- Validate quiz1_marks (0-15)
    IF NEW.quiz1_marks < 0 OR NEW.quiz1_marks > 15 THEN
        SET NEW.quiz1_marks = 0;
    END IF;

    -- Validate quiz2_marks (0-15)
    IF NEW.quiz2_marks < 0 OR NEW.quiz2_marks > 15 THEN
        SET NEW.quiz2_marks = 0;
    END IF;

    -- Validate quiz3_marks (0-15)
    IF NEW.quiz3_marks < 0 OR NEW.quiz3_marks > 15 THEN
        SET NEW.quiz3_marks = 0;
    END IF;

    -- Validate assignments_marks (0-15)
    IF NEW.assignments_marks < 0 OR NEW.assignments_marks > 15 THEN
        SET NEW.assignments_marks = 0;
    END IF;

    -- Validate attendance_marks (0-30)
    IF NEW.attendance_marks < 0 OR NEW.attendance_marks > 30 THEN
        SET NEW.attendance_marks = 0;
    END IF;

    -- Validate mid_sem_marks (0-75)
    IF NEW.mid_sem_marks < 0 OR NEW.mid_sem_marks > 75 THEN
        SET NEW.mid_sem_marks = 0;
    END IF;

    -- Validate final_sem_marks (0-150)
    IF NEW.final_sem_marks < 0 OR NEW.final_sem_marks > 150 THEN
        SET NEW.final_sem_marks = 0;
    END IF;

    -- Optionally: Recalculate total_marks
    SET NEW.total_marks = NEW.quiz1_marks + NEW.quiz2_marks + NEW.quiz3_marks +
                          NEW.assignments_marks + NEW.attendance_marks +
                          NEW.mid_sem_marks + NEW.final_sem_marks;
END$$

DELIMITER ;










