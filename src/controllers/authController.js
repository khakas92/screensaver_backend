import authService from "../services/authService.js";
import { sendEmail } from "../services/emailService.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";


export const register = async (req, res) => {
    try {
        const { username, email, password, birth_date } = req.body;
        await authService.register(username, email, password, birth_date);
        return res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}


export const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        const { accessToken, refreshToken, user } = await authService.login(identifier, password);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false, // In production server turn true (https)
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        return res.json({ accessToken, user });
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
};


export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const newAccessToken = await authService.refreshAccessToken(refreshToken);
        return res.json({ accessToken: newAccessToken });
    } catch (error) {
        return res.status(error.status || 403).json({ message: error.message });
    }
};


export const logout = (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false, // In production server turn true (https)
        sameSite: "Strict",
    });
    return res.status(200).json({ message: "You have been logged out." });
};


export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

    if (!user[0]) {
      return res.status(404).json({ error: "User not found" });
    }
  
    const token = jwt.sign({ email: user[0].email }, process.env.ACCESS_SECRET, { expiresIn: "1h" });
  
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;
  
    sendEmail(email, 'Reset password', `Click on the link to reset your password: ${resetLink}`);
    res.json({ message: "Password reset link sent" });
};


export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
  
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      const email = decoded.email;
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await db
        .update(users)
        .set({ password: hashedPassword })
        .where(eq(users.email, email));
  
      res.json({ message: "Password successfully updated!" });
    } catch (error) {
        console.error(error);
      return res.status(400).json({ error: "Invalid or expired token" });
    }
};
