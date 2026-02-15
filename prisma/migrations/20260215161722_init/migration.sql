-- CreateEnum
CREATE TYPE "JenisJadwal" AS ENUM ('SEMKP', 'SEMPRO', 'SEMHAS_LAPORAN', 'SEMHAS_PAPERBASED', 'SIDANG_TA_LAPORAN', 'SIDANG_TA_PAPERBASED');

-- CreateEnum
CREATE TYPE "PenilaiRole" AS ENUM ('KP_INSTANSI', 'KP_PEMBIMBING', 'KP_PENGUJI', 'TA_PEMBIMBING_1', 'TA_PEMBIMBING_2', 'TA_PENGUJI_1', 'TA_PENGUJI_2', 'TA_KETUA_SIDANG');

-- CreateEnum
CREATE TYPE "LogActionType" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateEnum
CREATE TYPE "LogActorType" AS ENUM ('KOORDINATOR', 'DOSEN', 'MAHASISWA');

-- CreateTable
CREATE TABLE "dosen" (
    "nip" VARCHAR(18) NOT NULL,
    "nama" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "no_hp" VARCHAR(14),

    CONSTRAINT "dosen_pkey" PRIMARY KEY ("nip")
);

-- CreateTable
CREATE TABLE "mahasiswa" (
    "nim" VARCHAR(11) NOT NULL,
    "nama" VARCHAR(255) NOT NULL,
    "email" VARCHAR(36) NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "mahasiswa_pkey" PRIMARY KEY ("nim")
);

-- CreateTable
CREATE TABLE "ruangan" (
    "kode" VARCHAR(10) NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ruangan_pkey" PRIMARY KEY ("kode")
);

-- CreateTable
CREATE TABLE "jadwal" (
    "id" VARCHAR(14) NOT NULL,
    "tanggal" TIMESTAMPTZ NOT NULL,
    "waktu_mulai" TIMESTAMPTZ NOT NULL,
    "waktu_selesai" TIMESTAMPTZ NOT NULL,
    "jenis" "JenisJadwal" NOT NULL,
    "nim" TEXT NOT NULL,
    "kode_ruangan" TEXT NOT NULL,

    CONSTRAINT "jadwal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "komponen_penilaian" (
    "id" VARCHAR(7) NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "persentase" INTEGER NOT NULL,
    "is_aktif" BOOLEAN NOT NULL DEFAULT true,
    "role" "PenilaiRole" NOT NULL,

    CONSTRAINT "komponen_penilaian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penilaian" (
    "id" TEXT NOT NULL,
    "id_jadwal" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "role" "PenilaiRole" NOT NULL,

    CONSTRAINT "penilaian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detail_penilaian" (
    "id" TEXT NOT NULL,
    "id_penilaian" TEXT NOT NULL,
    "id_komponen" TEXT NOT NULL,
    "nilai" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "detail_penilaian_pkey" PRIMARY KEY ("id")
);

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

-- CreateIndex
CREATE UNIQUE INDEX "dosen_email_key" ON "dosen"("email");

-- CreateIndex
CREATE UNIQUE INDEX "dosen_no_hp_key" ON "dosen"("no_hp");

-- CreateIndex
CREATE UNIQUE INDEX "mahasiswa_email_key" ON "mahasiswa"("email");

-- CreateIndex
CREATE INDEX "jadwal_tanggal_idx" ON "jadwal"("tanggal");

-- CreateIndex
CREATE INDEX "penilaian_id_jadwal_idx" ON "penilaian"("id_jadwal");

-- CreateIndex
CREATE INDEX "penilaian_nip_idx" ON "penilaian"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "penilaian_id_jadwal_nip_key" ON "penilaian"("id_jadwal", "nip");

-- CreateIndex
CREATE INDEX "detail_penilaian_id_komponen_idx" ON "detail_penilaian"("id_komponen");

-- CreateIndex
CREATE UNIQUE INDEX "detail_penilaian_id_penilaian_id_komponen_key" ON "detail_penilaian"("id_penilaian", "id_komponen");

-- CreateIndex
CREATE INDEX "log_jadwal_jadwal_id_idx" ON "log_jadwal"("jadwal_id");

-- CreateIndex
CREATE INDEX "log_jadwal_actor_id_idx" ON "log_jadwal"("actor_id");

-- CreateIndex
CREATE INDEX "log_penilaian_id_jadwal_idx" ON "log_penilaian"("id_jadwal");

-- CreateIndex
CREATE INDEX "log_penilaian_actor_id_idx" ON "log_penilaian"("actor_id");

-- AddForeignKey
ALTER TABLE "jadwal" ADD CONSTRAINT "jadwal_nim_fkey" FOREIGN KEY ("nim") REFERENCES "mahasiswa"("nim") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jadwal" ADD CONSTRAINT "jadwal_kode_ruangan_fkey" FOREIGN KEY ("kode_ruangan") REFERENCES "ruangan"("kode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penilaian" ADD CONSTRAINT "penilaian_id_jadwal_fkey" FOREIGN KEY ("id_jadwal") REFERENCES "jadwal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penilaian" ADD CONSTRAINT "penilaian_nip_fkey" FOREIGN KEY ("nip") REFERENCES "dosen"("nip") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_penilaian" ADD CONSTRAINT "detail_penilaian_id_penilaian_fkey" FOREIGN KEY ("id_penilaian") REFERENCES "penilaian"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_penilaian" ADD CONSTRAINT "detail_penilaian_id_komponen_fkey" FOREIGN KEY ("id_komponen") REFERENCES "komponen_penilaian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
