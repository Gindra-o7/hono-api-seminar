import prisma from "../infrastructures/db.infrastructure";

export default class MahasiswaRepository {
  public static async findAll(skip: number, take: number) {
    return prisma.mahasiswa.findMany({
      skip,
      take,
    });
  }

  public static async countAll() {
    return prisma.mahasiswa.count()
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
}
