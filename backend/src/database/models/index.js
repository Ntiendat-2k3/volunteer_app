const {Sequelize} = require('sequelize');
const UserModel = require('./user.model');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false
});

const User = UserModel(sequelize);

const db = {
    sequelize,
    Sequelize,
    User
};

module.exports = db;
