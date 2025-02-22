/*
  Warnings:

  - Made the column `assurance` on table `Patient` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "Acte" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "dents" TEXT NOT NULL,
    "acte" TEXT NOT NULL,
    "prix" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "patientId" INTEGER NOT NULL,
    CONSTRAINT "Acte_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rendezvous" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "heure" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "patientId" INTEGER NOT NULL,
    "acteId" INTEGER,
    CONSTRAINT "Rendezvous_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rendezvous_acteId_fkey" FOREIGN KEY ("acteId") REFERENCES "Acte" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Imagerie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "acteId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "imagerie" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    CONSTRAINT "Imagerie_acteId_fkey" FOREIGN KEY ("acteId") REFERENCES "Acte" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Imagerie_acteId_fkey" FOREIGN KEY ("acteId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Paiement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "acteId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "montant" REAL NOT NULL,
    "type" TEXT NOT NULL,
    CONSTRAINT "Paiement_acteId_fkey" FOREIGN KEY ("acteId") REFERENCES "Acte" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Paiement_acteId_fkey" FOREIGN KEY ("acteId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Seance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "acteId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    CONSTRAINT "Seance_acteId_fkey" FOREIGN KEY ("acteId") REFERENCES "Acte" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Seance_acteId_fkey" FOREIGN KEY ("acteId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Patient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cin" TEXT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "sexe" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "assurance" TEXT NOT NULL
);
INSERT INTO "new_Patient" ("adresse", "assurance", "cin", "id", "nom", "prenom", "sexe", "telephone") SELECT "adresse", "assurance", "cin", "id", "nom", "prenom", "sexe", "telephone" FROM "Patient";
DROP TABLE "Patient";
ALTER TABLE "new_Patient" RENAME TO "Patient";
CREATE UNIQUE INDEX "Patient_cin_key" ON "Patient"("cin");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
