// routes/patient.js

const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// Ajouter un patient
router.post("/", async (req, res) => {
  const { cin, nom, prenom, sexe, adresse, telephone, assurance } = req.body;

  try {
    const patient = await prisma.patient.create({
      data: {
        cin,
        nom,
        prenom,
        sexe,
        adresse,
        telephone,
        assurance,
      },
    });
    res.status(201).json(patient); // Retourner le patient créé
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'ajout du patient" });
  }
});

// Récupérer tous les patients
router.get("/", async (req, res) => {
  try {
    const patients = await prisma.patient.findMany();
    res.status(200).json(patients); // Retourner la liste des patients
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des patients" });
  }
});

// Récupérer un patient par ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(id) }, // Recherche un patient par son ID
    });

    if (patient) {
      res.status(200).json(patient); // Retourner le patient trouvé
    } else {
      res.status(404).json({ error: "Patient non trouvé" }); // Si pas de patient, erreur 404
    }
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération du patient" });
  }
});

// Modifier un patient par ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { cin, nom, prenom, sexe, adresse, telephone, assurance } = req.body;

  try {
    const updatedPatient = await prisma.patient.update({
      where: { id: parseInt(id) }, // Trouver le patient par ID
      data: {
        cin,
        nom,
        prenom,
        sexe,
        adresse,
        telephone,
        assurance,
      },
    });
    res.status(200).json(updatedPatient); // Retourner le patient mis à jour
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour du patient" });
  }
});

// Supprimer un patient par ID avec vérification des relations
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Vérifier si ce patient existe dans d'autres tables (Acte, Rendezvous, Imagerie, Paiement, etc.)
    const hasActes = await prisma.acte.findMany({ where: { patientId: parseInt(id) } });
    const hasRendezvous = await prisma.rendezvous.findMany({ where: { patientId: parseInt(id) } });
    const hasPaiements = await prisma.paiement.findMany({ where: { acteId: { in: hasActes.map(acte => acte.id) } } });
    const hasImageries = await prisma.imagerie.findMany({ where: { acteId: { in: hasActes.map(acte => acte.id) } } });

    // Si des relations existent, empêcher la suppression
    if (hasActes.length > 0 || hasRendezvous.length > 0 || hasPaiements.length > 0 || hasImageries.length > 0) {
      return res.status(400).json({ error: "Le patient ne peut pas être supprimé car il existe des relations avec d'autres entités." });
    }

    // Supprimer le patient si aucune relation n'existe
    await prisma.patient.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "Patient supprimé" }); // Message de confirmation
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression du patient" });
  }
});

module.exports = router;
