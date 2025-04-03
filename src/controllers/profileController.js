import jwt from "jsonwebtoken";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";


export const getProfile = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" });
  
    const token = authHeader.split(" ")[1];
  
    jwt.verify(token, process.env.ACCESS_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, decoded.id))
        .limit(1);
      res.json({ id: user[0].id, username: user[0].username });
    });
};


export const patchProfile = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" });
  
    const token = authHeader.split(" ")[1];
  
    jwt.verify(token, process.env.ACCESS_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
      try {
        await db
          .update(users)
          .set(req.body)
          .where(eq(users.id, decoded.id));
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
      const updatedUser = await db
        .select()
        .from(users)
        .where(eq(users.id, decoded.id))
        .limit(1);
      res.status(200).json(updatedUser[0]);
    });
};