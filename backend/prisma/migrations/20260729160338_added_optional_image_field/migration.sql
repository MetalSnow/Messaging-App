/*
  Warnings:

  - You are about to drop the column `message` on the `Messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "message",
ADD COLUMN     "messageImg" TEXT,
ADD COLUMN     "messageText" TEXT;
