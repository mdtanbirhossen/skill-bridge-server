/*
  Warnings:

  - You are about to drop the column `tags` on the `tutor_profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tutor_profile" DROP COLUMN "tags",
ADD COLUMN     "subjects" TEXT[];
