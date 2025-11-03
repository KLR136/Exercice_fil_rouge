const express = require('express');
const router = express.Router();
const { Task, User, Tag } = require('..');

// ➕ Créer une tâche
router.post('/', async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📋 Lister toutes les tâches avec utilisateur + tags
router.get('/', async (req, res) => {
  const tasks = await Task.findAll({
    include: [User, Tag]
  });
  res.json(tasks);
});

// 🔗 Associer un tag à une tâche
router.post('/:taskId/tags/:tagId', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.taskId);
    const tag = await Tag.findByPk(req.params.tagId);

    if (!task || !tag) return res.status(404).json({ error: 'Tâche ou tag introuvable' });

    await task.addTag(tag);
    res.json({ message: 'Tag ajouté à la tâche avec succès' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
