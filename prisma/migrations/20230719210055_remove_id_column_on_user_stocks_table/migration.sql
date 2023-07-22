/*
  Warnings:

  - You are about to drop the column `id` on the `UserStocks` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserStocks" (
    "userId" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "value" REAL NOT NULL,

    PRIMARY KEY ("userId", "stockId"),
    CONSTRAINT "UserStocks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserStocks_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserStocks" ("quantity", "stockId", "userId", "value") SELECT "quantity", "stockId", "userId", "value" FROM "UserStocks";
DROP TABLE "UserStocks";
ALTER TABLE "new_UserStocks" RENAME TO "UserStocks";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
