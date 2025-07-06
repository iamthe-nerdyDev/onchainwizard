/*
  Warnings:

  - You are about to drop the column `address` on the `jobs` table. All the data in the column will be lost.
  - You are about to drop the column `marketPrice` on the `jobs` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `jobs` table. All the data in the column will be lost.
  - You are about to drop the column `triggerType` on the `jobs` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `jobs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "jobs" DROP COLUMN "address",
DROP COLUMN "marketPrice",
DROP COLUMN "price",
DROP COLUMN "triggerType",
DROP COLUMN "type",
ADD COLUMN     "data" JSONB;

-- DropEnum
DROP TYPE "JobType";

-- DropEnum
DROP TYPE "TriggerType";
