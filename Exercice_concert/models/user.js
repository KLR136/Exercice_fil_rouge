const {Datatypes} = require('sequelize');
const sequelize = require('../core/orm.js'); // ton ORM centralisé

const User = sequelize.define('User', {
    id: {
        type: Datatypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Datatypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Datatypes.STRING,
        allowNull: false
    }
});
module.exports = User;