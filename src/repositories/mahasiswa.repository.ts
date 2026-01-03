import prisma from "../infrastructures/db.infrastructure";
import TahunAjaranHelper from "../helpers/tahun-ajaran.helper";

export default class MahasiswaRepository {
  public static async findAll(skip: number, take: number, sortBy?: "asc" | "desc") {
    return prisma.mahasiswa.findMany({
      skip,
      take,
      orderBy: sortBy ? { nama: sortBy } : undefined,
    });
  }

  public static async countAll() {
    return prisma.mahasiswa.count();
  }

  public static async findMany() {
    return prisma.mahasiswa.findMany();
  }

  public static async findByNIM(nim: string) {
    return prisma.mahasiswa.findUnique({
      where: { nim },
    });
  }

  public static async findByEmail(email: string) {
    return prisma.mahasiswa.findUnique({
      where: { email },
    });
  }

  public static async search(query?: string, angkatan?: number, sortBy?: "asc" | "desc") {
    // Jika ada filter angkatan, gunakan raw query untuk substring
    if (angkatan) {
      const angkatanDigits = angkatan.toString().slice(-2); // 2022 -> "22"

      const orderClause = sortBy ? `ORDER BY nama ${sortBy.toUpperCase()}` : "";

      const sqlQuery = `
        SELECT * FROM mahasiswa 
        WHERE SUBSTRING(nim, 2, 2) = $1 
        ${orderClause}
      `;

      return prisma.$queryRawUnsafe(sqlQuery, angkatanDigits);
    }

    // Jika tidak ada filter angkatan, return semua untuk fuzzy search
    return prisma.mahasiswa.findMany({
      orderBy: sortBy ? { nama: sortBy } : undefined,
    });
  }

  public static async findAngkatan() {
    const tahunAjaranSekarang = TahunAjaranHelper.findSekarang();
    const tahunSekarang = parseInt(tahunAjaranSekarang.slice(0, 4));
    const semesterSekarang = parseInt(tahunAjaranSekarang.slice(4));

    // Hitung angkatan minimal untuk semester >= 6
    // semester = (tahunSekarang - angkatan) * 2 + semesterSekarang >= 6
    // (tahunSekarang - angkatan) * 2 >= 6 - semesterSekarang
    // angkatan <= tahunSekarang - (6 - semesterSekarang) / 2
    const minSemesterOffset = Math.ceil((6 - semesterSekarang) / 2);
    const maxAngkatan = tahunSekarang - minSemesterOffset;

    const angkatanList = await prisma.$queryRaw<{ angkatan: number }[]>`
      SELECT DISTINCT 
        CAST('20' || SUBSTRING(nim, 2, 2) AS INTEGER) AS angkatan
      FROM mahasiswa
      WHERE LENGTH(nim) >= 3
        AND CAST('20' || SUBSTRING(nim, 2, 2) AS INTEGER) <= ${maxAngkatan}
      ORDER BY angkatan
    `;
    return angkatanList.map((item) => item.angkatan);
  }
}
