const db = require("../Config/db")

async function getAllDepartments(req, res) {
    try {
        const [results] = await db.promise().query('SELECT * FROM department');
        res.json(results);
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({ error: 'Failed to retrieve departments' });
    }
}

//create dept
function createDepartment (req,res){
    const sql = 'INSERT INTO department SET ?';
    const newDepartment = { name: req.body.name };
    db.query(sql, newDepartment, (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, ...newDepartment });
    });

}

//get by dept ID
async function getDepartmentById  (req, res) {
    const sql = 'SELECT * FROM department WHERE department_id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
};



// Update a department
async function updateDepartment(req, res){
    const updatedDepartment = { name: req.body.name };
    const sql = 'UPDATE department SET ? WHERE department_id = ?';
    db.query(sql, [updatedDepartment, req.params.id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Department updated successfully' });
    });
};


// Delete a department
async function deleteDepartment(req, res){
    const sql = 'DELETE FROM department WHERE department_id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Department deleted successfully' });
    });
};





module.exports = { 
    getAllDepartments,
    createDepartment,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,



 };
