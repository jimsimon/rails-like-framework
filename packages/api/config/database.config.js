module.exports = {
  "development": {
    "username": "postgres",
    "password": null,
    "host": "localhost",
    "database": "budgetapp",
  },
  "production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "database": "budgetapp",
  }
}
