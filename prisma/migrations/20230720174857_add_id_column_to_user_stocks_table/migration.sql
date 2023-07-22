/*
  Warnings:

  - The primary key for the `UserStocks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `UserStocks` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserStocks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "stockId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "value" REAL NOT NULL,
    CONSTRAINT "UserStocks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserStocks_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserStocks" ("quantity", "stockId", "userId", "value") SELECT "quantity", "stockId", "userId", "value" FROM "UserStocks";
DROP TABLE "UserStocks";
ALTER TABLE "new_UserStocks" RENAME TO "UserStocks";
CREATE UNIQUE INDEX "UserStocks_userId_key" ON "UserStocks"("userId");
CREATE UNIQUE INDEX "UserStocks_stockId_key" ON "UserStocks"("stockId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
