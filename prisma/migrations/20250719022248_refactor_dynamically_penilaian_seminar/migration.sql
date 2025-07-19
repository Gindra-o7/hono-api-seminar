/*
  Warnings:

  - The primary key for the `komponen_penilaian` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `penilaian` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `nip` to the `penilaian` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "komponen_penilaian" DROP CONSTRAINT "pk_id_komponen_penilaian",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(7),
ADD CONSTRAINT "pk_id_komponen_penilaian" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "penilaian" DROP CONSTRAINT "pk_penilaian",
ADD COLUMN     "nip" VARCHAR(18) NOT NULL,
ALTER COLUMN "id_komponen_penilaian" SET DATA TYPE VARCHAR(7),
ADD CONSTRAINT "pk_penilaian" PRIMARY KEY ("id_jadwal", "id_komponen_penilaian");

-- AddForeignKey
ALTER TABLE "penilaian" ADD CONSTRAINT "penilaian_nip_fkey" FOREIGN KEY ("nip") REFERENCES "dosen"("nip") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penilaian" ADD CONSTRAINT "penilaian_id_jadwal_fkey" FOREIGN KEY ("id_jadwal") REFERENCES "jadwal"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penilaian" ADD CONSTRAINT "penilaian_id_komponen_penilaian_fkey" FOREIGN KEY ("id_komponen_penilaian") REFERENCES "komponen_penilaian"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
