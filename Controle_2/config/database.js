const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('video_platform', 'root', 'AdriNatami08', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

module.exports = sequelize;