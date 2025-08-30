/*
  Warnings:

  - The `sex` column on the `Dog` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."DogSex" AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');

-- AlterTable
ALTER TABLE "public"."Dog" DROP COLUMN "sex",
ADD COLUMN     "sex" "public"."DogSex";
