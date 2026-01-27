/*
  Warnings:

  - You are about to drop the `_TutorCategories` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `tutor_profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_TutorCategories" DROP CONSTRAINT "_TutorCategories_A_fkey";

-- DropForeignKey
ALTER TABLE "_TutorCategories" DROP CONSTRAINT "_TutorCategories_B_fkey";

-- AlterTable
ALTER TABLE "tutor_profile" ADD COLUMN     "categoryId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_TutorCategories";

-- AddForeignKey
ALTER TABLE "tutor_profile" ADD CONSTRAINT "tutor_profile_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
