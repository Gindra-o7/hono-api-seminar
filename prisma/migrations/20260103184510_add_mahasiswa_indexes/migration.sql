/*
  Warnings:

  - The primary key for the `jadwal` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `komponen_penilaian` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `penilaian` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_komponen_penilaian` on the `penilaian` table. All the data in the column will be lost.
  - Changed the type of `id` on the `jadwal` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `is_aktif` to the `komponen_penilaian` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nip` to the `penilaian` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id_jadwal` on the `penilaian` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `nilai` on the `penilaian` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "LogActionType" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateEnum
CREATE TYPE "LogActorType" AS ENUM ('KOORDINATOR', 'DOSEN', 'MAHASISWA');

-- CreateEnum
CREATE TYPE "StatusAbsensi" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

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
ALTER TABLE "jadwal" DROP CONSTRAINT "pk_id_jadwal",
DROP COLUMN "id",
ADD COLUMN     "id" VARCHAR(14) NOT NULL,
ALTER COLUMN "waktu_mulai" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "waktu_selesai" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "nip_ketua_sidang" DROP NOT NULL,
ADD CONSTRAINT "pk_id_jadwal" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "komponen_penilaian" DROP CONSTRAINT "pk_id_komponen_penilaian",
ADD COLUMN     "is_aktif" BOOLEAN NOT NULL,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(7),
ADD CONSTRAINT "pk_id_komponen_penilaian" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "penilaian" DROP CONSTRAINT "pk_penilaian",
DROP COLUMN "id_komponen_penilaian",
ADD COLUMN     "nip" VARCHAR(18) NOT NULL,
DROP COLUMN "id_jadwal",
ADD COLUMN     "id_jadwal" VARCHAR(14) NOT NULL,
DROP COLUMN "nilai",
ADD COLUMN     "nilai" JSONB NOT NULL,
ADD CONSTRAINT "pk_penilaian" PRIMARY KEY ("id_jadwal");

-- CreateTable
CREATE TABLE "log_jadwal" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" "LogActionType" NOT NULL,
    "actor_type" "LogActorType" NOT NULL,
    "actor_id" TEXT NOT NULL,
    "id_jadwal" TEXT NOT NULL,
    "id_komponen_penilaian" TEXT NOT NULL,
    "old_nilai" INTEGER,
    "new_nilai" INTEGER,

    CONSTRAINT "log_penilaian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "absensi" (
    "id" TEXT NOT NULL,
    "status" "StatusAbsensi" NOT NULL DEFAULT 'PENDING',
    "tanda_tangan" TEXT,
    "waktu_submit" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "waktu_approved" TIMESTAMPTZ,
    "waktu_rejected" TIMESTAMPTZ,
    "waktu_cancelled" TIMESTAMPTZ,
    "id_jadwal" VARCHAR(14) NOT NULL,
    "nim" VARCHAR(11) NOT NULL,
    "nip_approver" VARCHAR(18),

    CONSTRAINT "pk_id_absensi" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "log_absensi" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" "LogActionType" NOT NULL,
    "actor_type" "LogActorType" NOT NULL,
    "actor_id" TEXT NOT NULL,
    "id_absensi" TEXT NOT NULL,
    "old_values" JSONB,
    "new_values" JSONB,

    CONSTRAINT "log_absensi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "log_jadwal_jadwal_id_idx" ON "log_jadwal"("jadwal_id");

-- CreateIndex
CREATE INDEX "log_jadwal_actor_id_idx" ON "log_jadwal"("actor_id");

-- CreateIndex
CREATE INDEX "log_penilaian_id_jadwal_idx" ON "log_penilaian"("id_jadwal");

-- CreateIndex
CREATE INDEX "log_penilaian_actor_id_idx" ON "log_penilaian"("actor_id");

-- CreateIndex
CREATE INDEX "idx_absensi_jadwal" ON "absensi"("id_jadwal");

-- CreateIndex
CREATE INDEX "idx_absensi_mahasiswa" ON "absensi"("nim");

-- CreateIndex
CREATE INDEX "idx_absensi_status" ON "absensi"("status");

-- CreateIndex
CREATE INDEX "idx_absensi_approver" ON "absensi"("nip_approver");

-- CreateIndex
CREATE UNIQUE INDEX "unique_absensi_jadwal_mahasiswa" ON "absensi"("id_jadwal", "nim");

-- CreateIndex
CREATE INDEX "idx_log_absensi_id" ON "log_absensi"("id_absensi");

-- CreateIndex
CREATE INDEX "idx_log_absensi_actor" ON "log_absensi"("actor_id");

-- CreateIndex
CREATE INDEX "idx_log_absensi_timestamp" ON "log_absensi"("timestamp");

-- CreateIndex
CREATE INDEX "mahasiswa_nama_idx" ON "mahasiswa"("nama");

-- CreateIndex
CREATE INDEX "mahasiswa_nim_idx" ON "mahasiswa"("nim");

-- AddForeignKey
ALTER TABLE "penilaian" ADD CONSTRAINT "penilaian_nip_fkey" FOREIGN KEY ("nip") REFERENCES "dosen"("nip") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penilaian" ADD CONSTRAINT "penilaian_id_jadwal_fkey" FOREIGN KEY ("id_jadwal") REFERENCES "jadwal"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "absensi" ADD CONSTRAINT "fk_id_jadwal_absensi" FOREIGN KEY ("id_jadwal") REFERENCES "jadwal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "absensi" ADD CONSTRAINT "fk_nim_mahasiswa_absensi" FOREIGN KEY ("nim") REFERENCES "mahasiswa"("nim") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "absensi" ADD CONSTRAINT "fk_nip_dosen_approver" FOREIGN KEY ("nip_approver") REFERENCES "dosen"("nip") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log_absensi" ADD CONSTRAINT "fk_id_absensi_log" FOREIGN KEY ("id_absensi") REFERENCES "absensi"("id") ON DELETE CASCADE ON UPDATE CASCADE;
