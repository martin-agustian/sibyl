/*
  Warnings:

  - You are about to drop the column `read` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `statusNote` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `accountVerif` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerif` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."OtpType" AS ENUM ('FORGOT_PASSWORD', 'EMAIL_VERIFICATION', 'ACCOUNT_VERIFICATION');

-- AlterTable
ALTER TABLE "public"."Notification" DROP COLUMN "read";

-- AlterTable
ALTER TABLE "public"."Quote" DROP COLUMN "statusNote";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "accountVerif",
DROP COLUMN "emailVerif";

-- CreateTable
CREATE TABLE "public"."Otp" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "public"."OtpType" NOT NULL DEFAULT 'FORGOT_PASSWORD',
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Otp" ADD CONSTRAINT "Otp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
