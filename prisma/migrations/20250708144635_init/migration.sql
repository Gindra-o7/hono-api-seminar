-- CreateEnum
CREATE TYPE "JenisJadwal" AS ENUM ('SEMKP', 'SEMPRO', 'SEMHAS_LAPORAN', 'SEMHAS_PAPERBASED', 'SIDANG_TA_LAPORAN', 'SIDANG_TA_PAPERBASED');

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
CREATE TABLE "tahun_ajaran" (
    "kode" VARCHAR(9) NOT NULL,
    "nama" VARCHAR(20) NOT NULL,
    "tgl_mulai" DATE NOT NULL,
    "tgl_selesai" DATE NOT NULL,

    CONSTRAINT "pk_kode_tahun_ajaran" PRIMARY KEY ("kode")
);

-- CreateTable
CREATE TABLE "ruangan" (
    "nama" VARCHAR(10) NOT NULL,

    CONSTRAINT "pk_nama_ruangan" PRIMARY KEY ("nama")
);

-- CreateTable
CREATE TABLE "jadwal" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tanggal" DATE NOT NULL,
    "waktu_mulai" TIMESTAMP NOT NULL,
    "waktu_selesai" TIMESTAMP NOT NULL,
    "jenis" "JenisJadwal" NOT NULL,
    "nim" VARCHAR(11) NOT NULL,
    "nama_ruangan" VARCHAR(10) NOT NULL,
    "nip_pembimbing_1" VARCHAR(18) NOT NULL,
    "nip_pembimbing_2" VARCHAR(18),
    "nip_penguji_1" VARCHAR(18) NOT NULL,
    "nip_penguji_2" VARCHAR(18),
    "nip_ketua_sidang" VARCHAR(18) NOT NULL,
    "kode_tahun_ajaran" VARCHAR(9) NOT NULL,

    CONSTRAINT "pk_id_jadwal" PRIMARY KEY ("id")
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
ALTER TABLE "jadwal" ADD CONSTRAINT "fk_nama_ruangan" FOREIGN KEY ("nama_ruangan") REFERENCES "ruangan"("nama") ON DELETE NO ACTION ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "jadwal" ADD CONSTRAINT "fk_kode_tahun_ajaran" FOREIGN KEY ("kode_tahun_ajaran") REFERENCES "tahun_ajaran"("kode") ON DELETE NO ACTION ON UPDATE CASCADE;
