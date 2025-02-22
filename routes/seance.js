// routes/seance.js

const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// Ajouter une séance
router.post("/", async (req, res) => {
  const { acteId, date, description } = req.body;

  try {
    // Vérifier si la date est dans le passé
    const currentDate = new Date();
    if (new Date(date) < currentDate) {
      return res.status(400).json({ error: "La date de la séance ne peut pas être dans le passé" });
    }

    // Vérifier si l'acte existe
    const acte = await prisma.acte.findUnique({
      where: { id: parseInt(acteId) },
    });

    if (!acte) {
      return res.status(404).json({ error: "L'acte spécifié n'existe pas" });
    }

    // Créer la séance
    const newSeance = await prisma.seance.create({
      data: {
        acteId,
        date,
        description,
      },
    });

    res.status(201).json(newSeance);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'ajout de la séance" });
  }
});


// Récupérer toutes les séances
router.get("/", async (req, res) => {
  try {
    const seances = await prisma.seance.findMany();
    res.status(200).json(seances);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des séances" });
  }
});

// Récupérer une séance par ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const seance = await prisma.seance.findUnique({
      where: { id: parseInt(id) },
    });

    if (seance) {
      res.status(200).json(seance);
    } else {
      res.status(404).json({ error: "Séance non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération de la séance" });
  }
});

// Récupérer toutes les séances d'un acte par ID
router.get("/acte/:acteId", async (req, res) => {
  const { acteId } = req.params;

  try {
    const seances = await prisma.seance.findMany({
      where: { acteId: parseInt(acteId) },
    });

    if (seances.length > 0) {
      res.status(200).json(seances);
    } else {
      res.status(404).json({ error: "Aucune séance trouvée pour cet acte" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des séances de l'acte" });
  }
});

// Récupérer toutes les séances d'un patient par ID
router.get("/patient/:patientId", async (req, res) => {
  const { patientId } = req.params;

  try {
    const seances = await prisma.seance.findMany({
      where: {
        acte: {
          patientId: parseInt(patientId),
        },
      },
    });

    if (seances.length > 0) {
      res.status(200).json(seances);
    } else {
      res.status(404).json({ error: "Aucune séance trouvée pour ce patient" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des séances du patient" });
  }
});

// Modifier une séance par ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { acteId, date, description } = req.body;

  try {
    // Vérifier si l'acte existe avant de modifier la séance
    const acte = await prisma.acte.findUnique({
      where: { id: parseInt(acteId) },
    });

    if (!acte) {
      return res.status(404).json({ error: "L'acte spécifié n'existe pas" });
    }

    // Modifier la séance
    const updatedSeance = await prisma.seance.update({
      where: { id: parseInt(id) },
      data: {
        acteId,
        date,
        description,
      },
    });

    res.status(200).json(updatedSeance);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour de la séance" });
  }
});

// Supprimer une séance par ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.seance.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Séance supprimée" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression de la séance" });
  }
});

module.exports = router;
