require('dotenv').config();

const clean = (value) => (typeof value === 'string' ? value.trim() : value);

module.exports = {
  development: {
    username: clean(process.env.DB_USER) || 'postgres',
    password: clean(process.env.DB_PASS) || null,
    database: clean(process.env.DB_NAME) || 'roushan',
    host: clean(process.env.DB_HOST) || '127.0.0.1',
    port: clean(process.env.DB_PORT) || 5432,
    dialect: 'postgres'
  },
  production: {
    username: clean(process.env.DB_USER),
    password: clean(process.env.DB_PASS),
    database: clean(process.env.DB_NAME),
    host: clean(process.env.DB_HOST),
    port: clean(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 30000
    }
  }
};