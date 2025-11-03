const express = require('express');
const { sequelize } = require('./models'); 
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const tagRoutes = require('./routes/tags');

const app = express();
app.use(express.json()); 


app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.use('/tags', tagRoutes);

sequelize.sync({ alter: true }).then(() => {
  console.log('✅ Base synchronisée avec Sequelize.');
  app.listen(3000, () => {
    console.log('🚀 Serveur lancé sur http://localhost:3000');
  });
}).catch(err => {
  console.error('❌ Impossible de synchroniser la base :', err);
});
