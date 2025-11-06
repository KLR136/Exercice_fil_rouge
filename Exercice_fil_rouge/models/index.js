const sequelize = require('../core/orm.js');

const Tasks = require('./tasks');
const Users = require('./users');
const Tags = require('./tags');
Tasks.belongsTo(Users);
Users.hasMany(Tasks);

Tags.belongsToMany(Tasks, { through: 'TaskTags' });
Tasks.belongsToMany(Tags, { through: 'TaskTags' });

//sequelize.sync({ alter: true });

module.exports = {
    'sequelize': sequelize,
    'tasks': Tasks,
    'users': Users,
    'tags': Tags
};