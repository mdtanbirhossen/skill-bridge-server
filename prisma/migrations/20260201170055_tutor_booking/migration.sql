-- DropForeignKey
ALTER TABLE "booking" DROP CONSTRAINT "booking_tutorId_fkey";

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "tutor_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
