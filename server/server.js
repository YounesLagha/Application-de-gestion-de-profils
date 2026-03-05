const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch((err) => console.error('Erreur MongoDB :', err));

// Routes
const profilsRoutes = require('./routes/profils');
app.use('/profils', profilsRoutes);
// Route pour générer un mot de passe aléatoire
app.get('/motdepasse/:longueur', (req, res) => {
  const longueur = parseInt(req.params.longueur);

  if (isNaN(longueur) || longueur <= 0) {
    return res.status(400).json({ message: "Longueur invalide" });
  }

  const caracteres = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let motDePasse = '';
  for (let i = 0; i < longueur; i++) {
    motDePasse += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }

  res.json({ motDePasse });
});
// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});