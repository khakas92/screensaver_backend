import jwt from "jsonwebtoken";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";


export const getUsers = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" });
  
    const token = authHeader.split(" ")[1];
  
    jwt.verify(token, process.env.ACCESS_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
  
      const result = await db.select().from(users);
      res.json(result);
    });
};