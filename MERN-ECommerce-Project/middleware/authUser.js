const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config()

const fetchUser = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        console.log("AUTH HEADER:", authHeader);

        if (!authHeader) {
            return res.status(401).send("Access denied - No header");
        }

        // ✅ FIX 1: Remove "Bearer"
        const token = authHeader.split(" ")[1];
        console.log(token);
        

        if (!token) {
            return res.status(401).send("Access denied - No token");
        }

        const data = jwt.verify(token, process.env.JWT_SECRET);
        console.log(data);
        

        // ✅ FIX 2: Handle BOTH token formats
        if (data.user) {
            req.user = data.user;
        } else {
            req.user = { id: data.id };
        }

        console.log("DECODED:", data);
        console.log("REQ.USER:", req.user);

        next();

    } catch (error) {
        console.log("AUTH ERROR:", error.message);
        res.status(401).send("Invalid token");
    }
};

module.exports = fetchUser