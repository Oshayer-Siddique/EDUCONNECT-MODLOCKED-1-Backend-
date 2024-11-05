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


function createDepartment (req,res){
    const sql = 'INSERT INTO department SET ?';
    const newDepartment = { name: req.body.name };
    db.query(sql, newDepartment, (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, ...newDepartment });
    });

}


async function getDepartmentByName  (req, res) {
    const sql = 'SELECT * FROM department WHERE department_name = ?';
    db.query(sql, [req.params.name], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
};


module.exports = { 
    getAllDepartments,
    createDepartment,
    getDepartmentByName,



 };
