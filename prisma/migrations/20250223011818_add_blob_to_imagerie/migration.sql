/*
  Warnings:

  - You are about to alter the column `file` on the `Imagerie` table. The data in that column could be lost. The data in that column will be cast from `String` to `Binary`.

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
    "file" BLOB NOT NULL,
    CONSTRAINT "Imagerie_acteId_fkey" FOREIGN KEY ("acteId") REFERENCES "Acte" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Imagerie_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Imagerie" ("acteId", "date", "file", "id", "imagerie", "patientId") SELECT "acteId", "date", "file", "id", "imagerie", "patientId" FROM "Imagerie";
DROP TABLE "Imagerie";
ALTER TABLE "new_Imagerie" RENAME TO "Imagerie";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
