import prisma from "../infrastructures/db.infrastructure";

export default class NilaiRepository {
  public static async getAll() {
    return await prisma.jadwal.findMany();
  }

  public static async getByNIM(nim: string) {
    return await prisma.jadwal.findMany({
      where: { nim },
    });
  }
}
