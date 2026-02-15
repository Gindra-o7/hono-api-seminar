/*
  Warnings:

  - Added the required column `kode_tahun_ajaran` to the `jadwal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "jadwal" ADD COLUMN     "kode_tahun_ajaran" VARCHAR(5) NOT NULL;
