const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const User = require('../models/User')
dotenv.config()

const checkAdmin = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log(authHeader);
    
    
    
    if (!authHeader) {
        return res.status(401).send("Access denied");
    }
  

    // 🔥 THIS LINE IS THE FIX
    const token = authHeader.split(" ")[1];
    console.log(token);
    

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data.user;
        console.log(data);
        

        if (req.user.role !== "admin") {
            return res.status(403).send("Only admin can access");
        }

        next();
    } catch (error) {
        console.log("JWT ERROR:", error.message);
        return res.status(401).send("Invalid token");
    }
};

module.exports = checkAdmin