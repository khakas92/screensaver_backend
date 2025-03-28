const jwt = require("jsonwebtoken");
const knex = require("../db");


const getProfile = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" });
  
    const token = authHeader.split(" ")[1];
  
    jwt.verify(token, process.env.ACCESS_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
  
      const user = await knex("users").where({ id: decoded.id }).first();
      res.json({ id: user.id, username: user.username });
    });
};


const patchProfile = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" });
  
    const token = authHeader.split(" ")[1];
  
    jwt.verify(token, process.env.ACCESS_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
      try {
        await knex("users").where({ id: decoded.id }).update(req.body);
      } catch (error) {
        console.log(error);
        if (error.code === "23505") {
          if (error.constraint === "users_username_unique") {
            return res.status(400).json({ message: "Username already exists" });
          }
          if (error.constraint === "users_email_unique") {
            return res.status(400).json({ message: "Email already exists" });
          }
        }
      }

      const updatedUser = await knex("users").where({ id: decoded.id }).first();
      res.status(200).json(updatedUser);
    });
};

module.exports = { getProfile, patchProfile };