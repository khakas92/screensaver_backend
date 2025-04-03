import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { db } from "../db/index.js";
import { users } from '../db/schema.js';
import { eq } from "drizzle-orm";


const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.ACCESS_SECRET,
        { expiresIn: process.env.ACCESS_EXPIRES }
    );

    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.REFRESH_SECRET,
        { expiresIn: process.env.REFRESH_EXPIRES }
    );

    return { accessToken, refreshToken, user };
};


export const login = async (identifier, password) => {
    const isEmail = identifier.includes("@");

    const user = await db
        .select()
        .from(users)
        .where(isEmail ? eq(users.email, identifier) : eq(users.username, identifier))
        .limit(1); // Ограничиваем 1 результат

    if (!user[0] || !bcrypt.compareSync(password, user[0].password)) {
        throw { status: 401, message: "Invalid username or password." };
    }
    delete user.password;
    return generateTokens(user[0]);
};


const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) throw { status: 403, message: "Token missing" };

    try {
        const user = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        return jwt.sign(
            { id: user.id, email: user.email },
            process.env.ACCESS_SECRET,
            { expiresIn: process.env.ACCESS_EXPIRES }
        );
    } catch {
        throw { status: 403, message: "Invalid refresh token" };
    }
};


const register = async (username, email, password, birth_date) => {
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      const [user] = await db
        .insert(users)
        .values({ username, email, password: hashedPassword, birth_date })
        .returning({ id: users.id, username: users.username, email: users.email, birth_date: users.birth_date });
  
      return user;
    } catch (error) {
      console.error(error);
  
      if (error.code === "23505") {
        if (error.message.includes("users_email_unique")) {
          throw new Error("Email already exists");
        }
        if (error.message.includes("users_username_unique")) {
          throw new Error("Username already exists");
        }
      }
  
      throw error;
    }
};

export default { register, login, refreshAccessToken };