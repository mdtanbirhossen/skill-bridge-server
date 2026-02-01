-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_tutorId_fkey";

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "tutor_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
