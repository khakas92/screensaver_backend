const knex = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


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


const login = async (identifier, password) => {

    const isEmail = identifier.includes("@");
    const user = await knex('users')
        .where(isEmail ? { email: identifier } : { username: identifier })
        .first();

    if (!user || !bcrypt.compareSync(password, user.password)) {
        throw { status: 401, message: "Invalid username or password." };
    }
    delete user.password;
    return generateTokens(user);
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
        throw { status: 403, message: "Invalid refresh-токен" };
    }
};


const register = async (username, email, password, birth_date) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const [user] = await knex('users')
            .insert({ username, email, password: hashedPassword, birth_date })
            .returning(['id', 'username', 'email', 'birth_date']);
        return user;
    } catch (error) {
        console.log(error);
        if (error.code === "23505") {
            if (error.constraint === "users_email_unique") {
                throw new Error('Email already exists');
            }
            if (error.constraint === "users_username_unique") {
                throw new Error('Username already exists');
            }
        }
        throw error;
    }
};

module.exports = { register, login, refreshAccessToken };
