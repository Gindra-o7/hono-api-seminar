import prisma from "../infrastructures/db.infrastructure";
import { PostRuanganType } from "../types/ruangan.type";

export default class RuanganRepository {
  public static async findAll() {
    return prisma.ruangan.findMany();
  }

  public static async findByName(nama: string) {
    return prisma.ruangan.findFirst({
      where: { nama: nama },
    });
  }

  public static async create(data: PostRuanganType) {
    return prisma.ruangan.create({ data });
  }

  public static async update(kode: string, data: PostRuanganType) {
    return prisma.ruangan.update({
      where: { kode },
      data,
    });
  }

  public static async destroy(kode: string) {
    return prisma.ruangan.delete({
      where: { kode },
    });
  }
}