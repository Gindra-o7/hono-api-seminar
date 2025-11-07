/*
  Warnings:

  - Added the required column `is_aktif` to the `komponen_penilaian` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LogActionType" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateEnum
CREATE TYPE "LogActorType" AS ENUM ('KOORDINATOR', 'DOSEN', 'MAHASISWA');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PenilaiKomponenPenilaian" ADD VALUE 'TA_PEMBIMBING_1';
ALTER TYPE "PenilaiKomponenPenilaian" ADD VALUE 'TA_PEMBIMBING_2';
ALTER TYPE "PenilaiKomponenPenilaian" ADD VALUE 'TA_PENGUJI_1';
ALTER TYPE "PenilaiKomponenPenilaian" ADD VALUE 'TA_PENGUJI_2';
ALTER TYPE "PenilaiKomponenPenilaian" ADD VALUE 'TA_KETUA_SIDANG';

-- AlterTable
ALTER TABLE "jadwal" ALTER COLUMN "waktu_mulai" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "waktu_selesai" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "komponen_penilaian" ADD COLUMN     "is_aktif" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "log_jadwal" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" "LogActionType" NOT NULL,
    "actor_type" "LogActorType" NOT NULL,
    "actor_id" TEXT NOT NULL,
    "jadwal_id" TEXT NOT NULL,
    "old_values" JSONB,
    "new_values" JSONB,

    CONSTRAINT "log_jadwal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "log_penilaian" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" "LogActionType" NOT NULL,
    "actor_type" "LogActorType" NOT NULL,
    "actor_id" TEXT NOT NULL,
    "id_jadwal" TEXT NOT NULL,
    "id_komponen_penilaian" TEXT NOT NULL,
    "old_nilai" INTEGER,
    "new_nilai" INTEGER,

    CONSTRAINT "log_penilaian_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "log_jadwal_jadwal_id_idx" ON "log_jadwal"("jadwal_id");

-- CreateIndex
CREATE INDEX "log_jadwal_actor_id_idx" ON "log_jadwal"("actor_id");

-- CreateIndex
CREATE INDEX "log_penilaian_id_jadwal_idx" ON "log_penilaian"("id_jadwal");

-- CreateIndex
CREATE INDEX "log_penilaian_actor_id_idx" ON "log_penilaian"("actor_id");
