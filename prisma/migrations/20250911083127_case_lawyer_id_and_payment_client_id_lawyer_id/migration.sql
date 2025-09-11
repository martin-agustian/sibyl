/*
  Warnings:

  - Added the required column `clientId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lawyerId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Case" ADD COLUMN     "lawyerId" TEXT;

-- AlterTable
ALTER TABLE "public"."Payment" ADD COLUMN     "clientId" TEXT NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'usd',
ADD COLUMN     "lawyerId" TEXT NOT NULL;
