const { DataTypes } = require('sequelize');
const sequelize = require('../core/orm.js'); // ton ORM centralisé

// Définition du modèle Task
const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'in progress', 'completed'),
        allowNull: false,
        defaultValue: 'pending'
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    tableName: 'tasks',
    timestamps: true // ajoute automatiquement createdAt / updatedAt
});

module.exports = Task;
