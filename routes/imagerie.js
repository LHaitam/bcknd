// routes/imagerie.js

const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// Ajouter une imagerie
router.post("/", async (req, res) => {
  const { acteId, date, imagerie, file } = req.body;

  try {
    // Vérifier si la date est dans le passé
    const currentDate = new Date();
    if (new Date(date) < currentDate) {
      return res.status(400).json({ error: "La date de l'imagerie ne peut pas être dans le passé" });
    }

    // Vérifier si l'acte existe
    const acte = await prisma.acte.findUnique({
      where: { id: parseInt(acteId) },
    });

    if (!acte) {
      return res.status(404).json({ error: "L'acte spécifié n'existe pas" });
    }

    // Créer l'imagerie
    const newImagerie = await prisma.imagerie.create({
      data: {
        acteId,
        date,
        imagerie,
        file,
      },
    });

    res.status(201).json(newImagerie);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'ajout de l'imagerie" });
  }
});


// Récupérer toutes les imageries
router.get("/", async (req, res) => {
  try {
    const imageries = await prisma.imagerie.findMany({
      include: { acte: true }, // Inclure les détails de l'acte associé
    });
    res.status(200).json(imageries);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des imageries" });
  }
});

// Récupérer une imagerie par ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const imagerie = await prisma.imagerie.findUnique({
      where: { id: parseInt(id) },
      include: { acte: true },
    });

    if (imagerie) {
      res.status(200).json(imagerie);
    } else {
      res.status(404).json({ error: "Imagerie non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération de l'imagerie" });
  }
});

// Récupérer toutes les imageries d'un patient par son ID
router.get("/patient/:patientId", async (req, res) => {
  const { patientId } = req.params;

  try {
    const imageries = await prisma.imagerie.findMany({
      where: {
        acte: {
          patientId: parseInt(patientId),
        },
      },
      include: { acte: true },
    });

    if (imageries.length > 0) {
      res.status(200).json(imageries);
    } else {
      res.status(404).json({ error: "Aucune imagerie trouvée pour ce patient" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des imageries du patient" });
  }
});

// Récupérer toutes les imageries d'un acte spécifique
router.get("/acte/:acteId", async (req, res) => {
  const { acteId } = req.params;

  try {
    const imageries = await prisma.imagerie.findMany({
      where: { acteId: parseInt(acteId) },
      include: { acte: true },
    });

    if (imageries.length > 0) {
      res.status(200).json(imageries);
    } else {
      res.status(404).json({ error: "Aucune imagerie trouvée pour cet acte" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des imageries de l'acte" });
  }
});

// Modifier une imagerie par ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { acteId, date, imagerie, file } = req.body;

  try {
    // Vérifier si l'acte existe
    const acte = await prisma.acte.findUnique({
      where: { id: parseInt(acteId) },
    });

    if (!acte) {
      return res.status(404).json({ error: "L'acte spécifié n'existe pas" });
    }

    // Modifier l'imagerie
    const updatedImagerie = await prisma.imagerie.update({
      where: { id: parseInt(id) },
      data: {
        acteId,
        date,
        imagerie,
        file,
      },
    });

    res.status(200).json(updatedImagerie);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour de l'imagerie" });
  }
});

// Supprimer une imagerie par ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.imagerie.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Imagerie supprimée" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression de l'imagerie" });
  }
});

module.exports = router;
