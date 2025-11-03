const sequelize = new Sequelize('festival', 'root', 'AdriNatami08', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false 
});

module.exports = sequelize;