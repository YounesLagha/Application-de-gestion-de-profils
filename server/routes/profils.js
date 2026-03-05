const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/User');
const { authentifier, estAdmin } = require('../middleware/auth');

// Vérifier si un courriel existe via Maileroo
async function verifierCourriel(courriel) {
  try {
    const response = await axios.get(
      `https://api.zeruh.com/v1/verify?api_key=${process.env.MAILEROO_API_KEY}&email_address=${courriel}`
    );
    console.log('Réponse Zeruh :', JSON.stringify(response.data));
    
    if (!response.data || !response.data.result) {
      return false;
    }
    
    const status = response.data.result.status;
    return status === 'deliverable' || status === 'risky';
  } catch (error) {
    console.error('Erreur vérification courriel :', error.message);
    return false;
  }
}

// Route de login 
router.post('/login', async (req, res) => {
  try {
    const { courriel, motDePasse } = req.body;

    const user = await User.findOne({ courriel });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const motDePasseValide = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!motDePasseValide) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: user._id, pseudo: user.pseudo, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user._id, pseudo: user.pseudo, courriel: user.courriel, isAdmin: user.isAdmin } });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// -1- POST /profils — Ajout d'utilisateur (sans authentification)
router.post('/', async (req, res) => {
  try {
    const { pseudo, courriel, motDePasse, isAdmin } = req.body;

    // Vérifier si le courriel est déjà utilisé
    const utilisateurExistant = await User.findOne({ courriel });
    if (utilisateurExistant) {
      return res.status(400).json({ message: "Ce courriel est déjà utilisé" });
    }

    // Vérifier si le courriel existe vraiment via Maileroo
    const courrielValide = await verifierCourriel(courriel);
    if (!courrielValide) {
      return res.status(400).json({ message: "Ce courriel n'existe pas" });
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const motDePasseHash = await bcrypt.hash(motDePasse, salt);

    // Créer l'utilisateur
    const nouvelUtilisateur = new User({
      pseudo,
      courriel,
      motDePasse: motDePasseHash,
      isAdmin: isAdmin || false
    });

    const utilisateur = await nouvelUtilisateur.save();
    res.status(201).json({
      id: utilisateur._id,
      pseudo: utilisateur.pseudo,
      courriel: utilisateur.courriel,
      isAdmin: utilisateur.isAdmin
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// -3- GET /profils — Lecture de tous (admin seulement)
router.get('/', authentifier, estAdmin, async (req, res) => {
  try {
    const utilisateurs = await User.find().select('-motDePasse');
    res.json(utilisateurs);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// -4- GET /profils/:id — Lecture d'un seul (authentifié)
router.get('/:id', authentifier, async (req, res) => {
  try {
    // Un utilisateur normal ne peut voir que son propre profil
    if (!req.user.isAdmin && req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const utilisateur = await User.findById(req.params.id).select('-motDePasse');
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(utilisateur);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// -5- PUT /profils/:id — Modification (authentifié)
router.put('/:id', authentifier, async (req, res) => {
  try {
    // Un utilisateur normal ne peut modifier que son propre profil
    if (!req.user.isAdmin && req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const { pseudo, courriel, motDePasse, isAdmin } = req.body;
    const miseAJour = {};

    if (pseudo) miseAJour.pseudo = pseudo;

    if (courriel) {
      // Vérifier si le courriel est déjà utilisé par un autre
      const utilisateurExistant = await User.findOne({ courriel, _id: { $ne: req.params.id } });
      if (utilisateurExistant) {
        return res.status(400).json({ message: "Ce courriel est déjà utilisé" });
      }

      // Vérifier si le courriel existe vraiment
      const courrielValide = await verifierCourriel(courriel);
      if (!courrielValide) {
        return res.status(400).json({ message: "Ce courriel n'existe pas" });
      }
      miseAJour.courriel = courriel;
    }

    if (motDePasse) {
      const salt = await bcrypt.genSalt(10);
      miseAJour.motDePasse = await bcrypt.hash(motDePasse, salt);
    }

    if (isAdmin !== undefined) miseAJour.isAdmin = isAdmin;

    const utilisateur = await User.findByIdAndUpdate(
      req.params.id,
      miseAJour,
      { new: true }
    ).select('-motDePasse');

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(utilisateur);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// -2- DELETE /profils/:id — Suppression (admin seulement)
router.delete('/:id', authentifier, estAdmin, async (req, res) => {
  try {
    const utilisateur = await User.findByIdAndDelete(req.params.id);
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({
      message: "Utilisateur supprimé",
      utilisateur: {
        id: utilisateur._id,
        pseudo: utilisateur.pseudo,
        courriel: utilisateur.courriel,
        isAdmin: utilisateur.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;