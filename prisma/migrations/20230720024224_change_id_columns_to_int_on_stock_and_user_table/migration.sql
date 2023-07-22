/*
  Warnings:

  - The primary key for the `UserStocks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `stockId` on the `UserStocks` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `userId` on the `UserStocks` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Stock` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Stock` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `User` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserStocks" (
    "userId" INTEGER NOT NULL,
    "stockId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "value" REAL NOT NULL,

    PRIMARY KEY ("userId", "stockId"),
    CONSTRAINT "UserStocks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserStocks_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserStocks" ("quantity", "stockId", "userId", "value") SELECT "quantity", "stockId", "userId", "value" FROM "UserStocks";
DROP TABLE "UserStocks";
ALTER TABLE "new_UserStocks" RENAME TO "UserStocks";
CREATE TABLE "new_Stock" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "initial_value" REAL NOT NULL,
    "company_logo" TEXT NOT NULL
);
INSERT INTO "new_Stock" ("company_logo", "id", "initial_value", "name") SELECT "company_logo", "id", "initial_value", "name" FROM "Stock";
DROP TABLE "Stock";
ALTER TABLE "new_Stock" RENAME TO "Stock";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_User" ("email", "id", "name", "password") SELECT "email", "id", "name", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
