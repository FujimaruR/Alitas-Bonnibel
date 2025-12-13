-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_created_by_user_id_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "created_by_user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
