-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_bookingId_fkey";

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
