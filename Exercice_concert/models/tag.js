const { DataTypes } = require('sequelize');
const sequelize = require('../core/orm.js');

const Tag = sequelize.define('Tag', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'tags',
    timestamps: false
});

module.exports = Tag;
