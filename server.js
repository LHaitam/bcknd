const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

// Middleware pour gérer les CORS
app.use(cors());

// Middleware pour parser les données JSON dans les requêtes
app.use(bodyParser.json());

// Routes importées
const patientRoutes = require("./routes/patient");
const paiementRoutes = require("./routes/paiement");
const rendezvousRoutes = require("./routes/rendezvous");
const seanceRoutes = require("./routes/seance");
const imagerieRoutes = require("./routes/imagerie");
const acteRoutes = require("./routes/acte");

// Utilisation des routes
app.use("/patients", patientRoutes);
app.use("/paiements", paiementRoutes);
app.use("/rendezvous", rendezvousRoutes);
app.use("/seances", seanceRoutes);
app.use("/imageries", imagerieRoutes);
app.use("/actes", acteRoutes);

// Route de base
app.get("/", (req, res) => {
  res.send("API de gestion des actes médicaux en ligne");
});

// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
