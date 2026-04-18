-- AlterTable
ALTER TABLE "Messages" ADD COLUMN     "deletedBy" INTEGER;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
