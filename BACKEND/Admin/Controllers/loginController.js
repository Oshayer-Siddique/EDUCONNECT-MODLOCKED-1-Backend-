const db = require("../Config/db");
const bcrypt = require('bcrypt');

const loginUser = async (req, res) => {
    const { user_id, user_password } = req.body;

    if (!user_id || !user_password) {
        return res.status(400).json({ message: "Please provide both User ID and Password." });
    }

    try {
        // Query to fetch user details from the database
        const query = "SELECT user_id, user_role, user_password FROM UsersInfo WHERE user_id = ?";
        
        db.query(query, [user_id], async (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Internal Server Error" });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: "Invalid User ID or Password." });
            }

            const user = results[0];

            // Check if the password matches
            const passwordMatch = await bcrypt.compare(user_password, user.user_password);
            if (!passwordMatch) {
                return res.status(401).json({ message: "Invalid User ID or Password." });
            }

            // If login is successful, send the user role for frontend navigation
            return res.status(200).json({
                message: "Login successful",
                user: {
                    user_id: user.user_id,
                    user_role: user.user_role
                }
            });
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { loginUser };