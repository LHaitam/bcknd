/*
  Warnings:

  - Added the required column `patientId` to the `Imagerie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientId` to the `Paiement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientId` to the `Seance` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Imagerie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "acteId" INTEGER NOT NULL,
    "patientId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "imagerie" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    CONSTRAINT "Imagerie_acteId_fkey" FOREIGN KEY ("acteId") REFERENCES "Acte" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Imagerie_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Imagerie" ("acteId", "date", "file", "id", "imagerie") SELECT "acteId", "date", "file", "id", "imagerie" FROM "Imagerie";
DROP TABLE "Imagerie";
ALTER TABLE "new_Imagerie" RENAME TO "Imagerie";
CREATE TABLE "new_Paiement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "acteId" INTEGER NOT NULL,
    "patientId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "montant" REAL NOT NULL,
    "type" TEXT NOT NULL,
    CONSTRAINT "Paiement_acteId_fkey" FOREIGN KEY ("acteId") REFERENCES "Acte" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Paiement_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Paiement" ("acteId", "date", "id", "montant", "type") SELECT "acteId", "date", "id", "montant", "type" FROM "Paiement";
DROP TABLE "Paiement";
ALTER TABLE "new_Paiement" RENAME TO "Paiement";
CREATE TABLE "new_Seance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "acteId" INTEGER NOT NULL,
    "patientId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    CONSTRAINT "Seance_acteId_fkey" FOREIGN KEY ("acteId") REFERENCES "Acte" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Seance_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Seance" ("acteId", "date", "description", "id") SELECT "acteId", "date", "description", "id" FROM "Seance";
DROP TABLE "Seance";
ALTER TABLE "new_Seance" RENAME TO "Seance";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
