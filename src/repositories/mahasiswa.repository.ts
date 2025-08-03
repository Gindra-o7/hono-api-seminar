import prisma from "../infrastructures/db.infrastructure";

export default class MahasiswaRepository {
  public static async findAll() {
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
}
