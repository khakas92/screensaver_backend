const jwt = require("jsonwebtoken");
const knex = require("../db");


const getUsers = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" });
  
    const token = authHeader.split(" ")[1];
  
    jwt.verify(token, process.env.ACCESS_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
  
      const users = await knex("users");
      res.json(users);
    });
};

module.exports = { getUsers };