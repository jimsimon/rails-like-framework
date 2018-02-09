module.exports = {
  "development": {
    "username": "postgres",
    "password": null,
    "host": "localhost",
    "port": 5433,
    "database": "orm",
  },
  "production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "database": "orm",
  }
}
