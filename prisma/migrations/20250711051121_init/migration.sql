-- CreateEnum
CREATE TYPE "JenisJadwal" AS ENUM ('SEMKP', 'SEMPRO', 'SEMHAS_LAPORAN', 'SEMHAS_PAPERBASED', 'SIDANG_TA_LAPORAN', 'SIDANG_TA_PAPERBASED');

-- CreateEnum
CREATE TYPE "PenilaiKomponenPenilaian" AS ENUM ('KP_INSTANSI', 'KP_PEMBIMBING', 'KP_PENGUJI');

-- CreateTable
CREATE TABLE "dosen" (
    "nip" VARCHAR(18) NOT NULL,
    "nama" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "no_hp" VARCHAR(14),
    "username_telegram" VARCHAR(255),
    "id_telegram" VARCHAR(255),

    CONSTRAINT "pk_nip_dosen" PRIMARY KEY ("nip")
);

-- CreateTable
CREATE TABLE "mahasiswa" (
    "nim" VARCHAR(11) NOT NULL,
    "nama" VARCHAR(255) NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "email" VARCHAR(36) NOT NULL,
    "nip" VARCHAR(18) NOT NULL,

    CONSTRAINT "pk_nim_mahasiswa" PRIMARY KEY ("nim")
);

-- CreateTable
CREATE TABLE "ruangan" (
    "kode" VARCHAR(10) NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "pk_kode_ruangan" PRIMARY KEY ("kode")
);

-- CreateTable
CREATE TABLE "jadwal" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tanggal" DATE NOT NULL,
    "waktu_mulai" TIMESTAMP NOT NULL,
    "waktu_selesai" TIMESTAMP NOT NULL,
    "jenis" "JenisJadwal" NOT NULL,
    "nim" VARCHAR(11) NOT NULL,
    "kode_ruangan" VARCHAR(10) NOT NULL,
    "nip_pembimbing_1" VARCHAR(18) NOT NULL,
    "nip_pembimbing_2" VARCHAR(18),
    "nip_penguji_1" VARCHAR(18) NOT NULL,
    "nip_penguji_2" VARCHAR(18),
    "nip_ketua_sidang" VARCHAR(18) NOT NULL,
    "kode_tahun_ajaran" VARCHAR(5) NOT NULL,

    CONSTRAINT "pk_id_jadwal" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "komponen_penilaian" (
    "id" VARCHAR(4) NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "persentase" INTEGER NOT NULL,
    "penilai" "PenilaiKomponenPenilaian" NOT NULL,

    CONSTRAINT "pk_id_komponen_penilaian" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penilaian" (
    "id_jadwal" UUID NOT NULL,
    "id_komponen_penilaian" VARCHAR(4) NOT NULL,
    "nilai" INTEGER NOT NULL,

    CONSTRAINT "pk_penilaian" PRIMARY KEY ("id_jadwal","id_komponen_penilaian")
);

-- CreateIndex
CREATE UNIQUE INDEX "dosen_email_key" ON "dosen"("email");

-- CreateIndex
CREATE UNIQUE INDEX "dosen_no_hp_key" ON "dosen"("no_hp");

-- CreateIndex
CREATE UNIQUE INDEX "dosen_username_telegram_key" ON "dosen"("username_telegram");

-- CreateIndex
CREATE UNIQUE INDEX "dosen_id_telegram_key" ON "dosen"("id_telegram");

-- CreateIndex
CREATE UNIQUE INDEX "mahasiswa_email_key" ON "mahasiswa"("email");

-- AddForeignKey
ALTER TABLE "mahasiswa" ADD CONSTRAINT "fk_nip_mahasiswa" FOREIGN KEY ("nip") REFERENCES "dosen"("nip") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jadwal" ADD CONSTRAINT "fk_nim_mahasiswa" FOREIGN KEY ("nim") REFERENCES "mahasiswa"("nim") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jadwal" ADD CONSTRAINT "fk_kode_ruangan" FOREIGN KEY ("kode_ruangan") REFERENCES "ruangan"("kode") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jadwal" ADD CONSTRAINT "fk_nip_pembimbing_1" FOREIGN KEY ("nip_pembimbing_1") REFERENCES "dosen"("nip") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jadwal" ADD CONSTRAINT "fk_nip_pembimbing_2" FOREIGN KEY ("nip_pembimbing_2") REFERENCES "dosen"("nip") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jadwal" ADD CONSTRAINT "fk_nip_penguji_1" FOREIGN KEY ("nip_penguji_1") REFERENCES "dosen"("nip") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jadwal" ADD CONSTRAINT "fk_nip_penguji_2" FOREIGN KEY ("nip_penguji_2") REFERENCES "dosen"("nip") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jadwal" ADD CONSTRAINT "fk_nip_ketua_sidang" FOREIGN KEY ("nip_ketua_sidang") REFERENCES "dosen"("nip") ON DELETE NO ACTION ON UPDATE CASCADE;
