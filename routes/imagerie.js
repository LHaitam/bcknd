const express = require("express");
const multer = require("multer");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// Configuration de Multer pour stocker les fichiers en mémoire
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ajouter une imagerie avec fichier BLOB
router.post("/", upload.single("file"), async (req, res) => {
  const { acteId, patientId, date, imagerie } = req.body;
  const fileBuffer = req.file?.buffer; // Récupération du fichier sous forme de buffer

  try {
    // Vérifier si l'acte existe
    const acte = await prisma.acte.findUnique({
      where: { id: parseInt(acteId) },
    });

    if (!acte) {
      return res.status(404).json({ error: "L'acte spécifié n'existe pas" });
    }

    // Créer l'imagerie avec le fichier en BLOB
    const newImagerie = await prisma.imagerie.create({
      data: {
        acteId: parseInt(acteId),
        patientId: parseInt(patientId),
        date: new Date(date),
        imagerie,
        file: fileBuffer,
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
      include: { acte: true },
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

// Récupérer le fichier image d'une imagerie
router.get("/:id/image", async (req, res) => {
  const { id } = req.params;

  try {
    const imagerie = await prisma.imagerie.findUnique({
      where: { id: parseInt(id) },
    });

    if (!imagerie || !imagerie.file) {
      return res.status(404).json({ error: "Image non trouvée" });
    }

    res.setHeader("Content-Type", "image/jpeg");
    res.send(imagerie.file);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération de l'image" });
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
