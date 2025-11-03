const sequelize = require('../core/orm');
const User = require('./user');
const Task = require('./task');
const Tag = require('./tag');

Task.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Task, { foreignKey: 'userId' });

Task.belongsToMany(Tag, { through: 'Task_Tags' });
Tag.belongsToMany(Task, { through: 'Task_Tags' });

module.exports = {
  sequelize,
  User,
  Task,
  Tag
};
