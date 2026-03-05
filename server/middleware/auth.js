const jwt = require('jsonwebtoken');

// Vérifie que le token JWT est valide
const authentifier = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Authentification requise" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide" });
  }
};

// Vérifie que l'utilisateur est admin
const estAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Accès réservé aux administrateurs" });
  }
  next();
};

module.exports = { authentifier, estAdmin };