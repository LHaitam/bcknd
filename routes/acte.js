// routes/acte.js

const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// Ajouter un acte (sans création automatique de séance)
router.post("/", async (req, res) => {
  const { patientId, date, dents, acte, prix, status } = req.body;

  try {
    // Créer un acte
    const newActe = await prisma.acte.create({
      data: {
        patientId,
        date,
        dents,
        acte,
        prix,
        status,
      },
    });

    res.status(201).json(newActe);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'ajout de l'acte" });
  }
});

// Récupérer tous les actes
router.get("/", async (req, res) => {
  try {
    const actes = await prisma.acte.findMany();
    res.status(200).json(actes);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des actes" });
  }
});

// Récupérer un acte par ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const acte = await prisma.acte.findUnique({
      where: { id: parseInt(id) },
    });

    if (acte) {
      res.status(200).json(acte);
    } else {
      res.status(404).json({ error: "Acte non trouvé" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération de l'acte" });
  }
});

// Récupérer tous les actes d'un patient par son ID
router.get("/patient/:patientId", async (req, res) => {
  const { patientId } = req.params;

  try {
    const actes = await prisma.acte.findMany({
      where: { patientId: parseInt(patientId) },
    });

    if (actes.length > 0) {
      res.status(200).json(actes);
    } else {
      res.status(404).json({ error: "Aucun acte trouvé pour ce patient" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des actes du patient" });
  }
});

// Modifier un acte par ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { patientId, date, dents, acte, prix, status } = req.body;

  try {
    const updatedActe = await prisma.acte.update({
      where: { id: parseInt(id) },
      data: {
        patientId,
        date,
        dents,
        acte,
        prix,
        status,
      },
    });
    res.status(200).json(updatedActe);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour de l'acte" });
  }
});

// Supprimer un acte par ID avec vérification des relations
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const paiements = await prisma.paiement.findMany({
      where: { acteId: parseInt(id) },
    });
    const imageries = await prisma.imagerie.findMany({
      where: { acteId: parseInt(id) },
    });
    const seances = await prisma.seance.findMany({
      where: { acteId: parseInt(id) },
    });

    // Vérifier si l'acte est lié à d'autres entités avant suppression
    if (paiements.length > 0 || imageries.length > 0 || seances.length > 0) {
      return res.status(400).json({ error: "L'acte ne peut pas être supprimé car il est lié à d'autres entités." });
    }

    // Supprimer l'acte si aucune relation n'existe
    await prisma.acte.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Acte supprimé" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression de l'acte" });
  }
});

module.exports = router;
