// routes/rendezvous.js

const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// Ajouter un rendez-vous avec règles métiers
router.post("/", async (req, res) => {
  const { patientId, date, heure, type } = req.body;

  try {
    // Vérifier si la date est dans le passé
    const currentDate = new Date();
    if (new Date(date) < currentDate) {
      return res.status(400).json({ error: "La date du rendez-vous ne peut pas être dans le passé" });
    }

    // Vérifier si le patient existe
    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(patientId) },
    });

    if (!patient) {
      return res.status(404).json({ error: "Le patient spécifié n'existe pas" });
    }

    // Vérifier si le patient a déjà un rendez-vous à la même date et heure
    const existingRdv = await prisma.rendezvous.findFirst({
      where: {
        patientId: parseInt(patientId),
        date: date,
        heure: heure,
      },
    });

    if (existingRdv) {
      return res.status(400).json({ error: "Ce patient a déjà un rendez-vous à cette date et heure" });
    }

    // Créer le rendez-vous
    const newRdv = await prisma.rendezvous.create({
      data: {
        patientId,
        date,
        heure,
        type,
      },
    });

    res.status(201).json(newRdv);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'ajout du rendez-vous" });
  }
});


// Récupérer tous les rendez-vous
router.get("/", async (req, res) => {
  try {
    const rdvs = await prisma.rendezvous.findMany();
    res.status(200).json(rdvs);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des rendez-vous" });
  }
});

// Récupérer un rendez-vous par ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const rdv = await prisma.rendezvous.findUnique({
      where: { id: parseInt(id) },
    });

    if (rdv) {
      res.status(200).json(rdv);
    } else {
      res.status(404).json({ error: "Rendez-vous non trouvé" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération du rendez-vous" });
  }
});

// Récupérer tous les rendez-vous d'un patient
router.get("/patient/:patientId", async (req, res) => {
  const { patientId } = req.params;

  try {
    const rdvs = await prisma.rendezvous.findMany({
      where: { patientId: parseInt(patientId) },
    });

    if (rdvs.length > 0) {
      res.status(200).json(rdvs);
    } else {
      res.status(404).json({ error: "Aucun rendez-vous trouvé pour ce patient" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des rendez-vous du patient" });
  }
});

// Modifier un rendez-vous par ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { patientId, date, heure, type } = req.body;

  try {
    // Vérifier si le patient existe
    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(patientId) },
    });

    if (!patient) {
      return res.status(404).json({ error: "Le patient spécifié n'existe pas" });
    }

    // Vérifier si un autre rendez-vous existe à la même date et heure
    const existingRdv = await prisma.rendezvous.findFirst({
      where: {
        patientId: parseInt(patientId),
        date: date,
        heure: heure,
        NOT: { id: parseInt(id) },
      },
    });

    if (existingRdv) {
      return res.status(400).json({ error: "Un autre rendez-vous existe déjà à cette date et heure" });
    }

    // Modifier le rendez-vous
    const updatedRdv = await prisma.rendezvous.update({
      where: { id: parseInt(id) },
      data: {
        patientId,
        date,
        heure,
        type,
      },
    });

    res.status(200).json(updatedRdv);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour du rendez-vous" });
  }
});

// Supprimer un rendez-vous par ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.rendezvous.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Rendez-vous supprimé" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression du rendez-vous" });
  }
});

module.exports = router;
