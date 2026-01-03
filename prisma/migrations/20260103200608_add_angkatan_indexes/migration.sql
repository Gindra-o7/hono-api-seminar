-- AlterTable
ALTER TABLE "mahasiswa" ADD COLUMN     "angkatan" INTEGER DEFAULT CAST('20' || SUBSTRING(nim, 2, 2) AS INTEGER);

-- CreateIndex
CREATE INDEX "mahasiswa_angkatan_idx" ON "mahasiswa"("angkatan");
