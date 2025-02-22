// routes/paiement.js

const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// Ajouter un paiement
router.post("/", async (req, res) => {
  const { acteId, date, montant, type } = req.body;

  try {
    // Vérifier si la date est dans le passé
    const currentDate = new Date();
    if (new Date(date) < currentDate) {
      return res.status(400).json({ error: "La date du paiement ne peut pas être dans le passé" });
    }

    // Vérifier si l'acte existe
    const acte = await prisma.acte.findUnique({
      where: { id: parseInt(acteId) },
    });

    if (!acte) {
      return res.status(404).json({ error: "L'acte spécifié n'existe pas" });
    }

    // Créer le paiement
    const newPaiement = await prisma.paiement.create({
      data: {
        acteId,
        date,
        montant,
        type,
      },
    });

    res.status(201).json(newPaiement);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'ajout du paiement" });
  }
});


// Récupérer tous les paiements
router.get("/", async (req, res) => {
  try {
    const paiements = await prisma.paiement.findMany({
      where: {
        acteId: { not: null }, // Ne récupérer que les paiements avec un acteId défini
      },
      include: { acte: true },
    });
    res.status(200).json(paiements);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des paiements" });
  }
});

// Récupérer un paiement par ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const paiement = await prisma.paiement.findUnique({
      where: { id: parseInt(id) },
      include: { acte: true },
    });

    if (paiement) {
      res.status(200).json(paiement);
    } else {
      res.status(404).json({ error: "Paiement non trouvé" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération du paiement" });
  }
});

// Récupérer tous les paiements d'un patient par son ID
router.get("/patient/:patientId", async (req, res) => {
  const { patientId } = req.params;

  try {
    const paiements = await prisma.paiement.findMany({
      where: {
        acte: {
          patientId: parseInt(patientId),
        },
      },
      include: { acte: true },
    });

    if (paiements.length > 0) {
      res.status(200).json(paiements);
    } else {
      res.status(404).json({ error: "Aucun paiement trouvé pour ce patient" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des paiements du patient" });
  }
});

// Récupérer tous les paiements d'un acte spécifique
router.get("/acte/:acteId", async (req, res) => {
  const { acteId } = req.params;

  try {
    const paiements = await prisma.paiement.findMany({
      where: { acteId: parseInt(acteId) },
      include: { acte: true },
    });

    if (paiements.length > 0) {
      res.status(200).json(paiements);
    } else {
      res.status(404).json({ error: "Aucun paiement trouvé pour cet acte" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des paiements de l'acte" });
  }
});

// Modifier un paiement par ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { acteId, date, montant, type } = req.body;

  try {
    // Vérifier si l'acte existe
    const acte = await prisma.acte.findUnique({
      where: { id: parseInt(acteId) },
    });

    if (!acte) {
      return res.status(404).json({ error: "L'acte spécifié n'existe pas" });
    }

    // Modifier le paiement
    const updatedPaiement = await prisma.paiement.update({
      where: { id: parseInt(id) },
      data: {
        acteId,
        date,
        montant,
        type,
      },
    });

    res.status(200).json(updatedPaiement);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour du paiement" });
  }
});

// Supprimer un paiement par ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.paiement.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Paiement supprimé" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression du paiement" });
  }
});

module.exports = router;
