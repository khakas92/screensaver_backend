module.exports = {
    schema: "./src/db/schema.js",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DB_URL,
        ssl: false,
    }
};