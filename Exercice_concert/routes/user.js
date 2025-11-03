const express = require('express');
const router = express.Router();
const { User } = require('..');

// ➕ Créer un utilisateur
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📋 Lister tous les utilisateurs
router.get('/', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

module.exports = router;
