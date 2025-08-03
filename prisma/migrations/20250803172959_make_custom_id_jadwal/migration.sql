/*
  Warnings:

  - The primary key for the `jadwal` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `penilaian` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `jadwal` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id_jadwal` on the `penilaian` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "penilaian" DROP CONSTRAINT "penilaian_id_jadwal_fkey";

-- AlterTable
ALTER TABLE "jadwal" DROP CONSTRAINT "pk_id_jadwal",
DROP COLUMN "id",
ADD COLUMN     "id" VARCHAR(14) NOT NULL,
ADD CONSTRAINT "pk_id_jadwal" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "penilaian" DROP CONSTRAINT "pk_penilaian",
DROP COLUMN "id_jadwal",
ADD COLUMN     "id_jadwal" VARCHAR(14) NOT NULL,
ADD CONSTRAINT "pk_penilaian" PRIMARY KEY ("id_jadwal", "id_komponen_penilaian");

-- AddForeignKey
ALTER TABLE "penilaian" ADD CONSTRAINT "penilaian_id_jadwal_fkey" FOREIGN KEY ("id_jadwal") REFERENCES "jadwal"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
