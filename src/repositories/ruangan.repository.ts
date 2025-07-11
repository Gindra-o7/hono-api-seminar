import prisma from "../infrastructures/db.infrastructure";
import { PostRuanganType } from "../types/ruangan.type";

export default class RuanganRepository {
  public static async findAll() {
    return prisma.ruangan.findMany();
  }

  public static async findByName(nama: string) {
    return prisma.ruangan.findUnique({
      where: { nama },
    });
  }

  public static async create(data: PostRuanganType) {
    return prisma.ruangan.create({ data });
  }

  public static async update(nama: string, data: PostRuanganType) {
    return prisma.ruangan.update({
      where: { nama },
      data,
    });
  }

  public static async destroy(nama: string) {
    return prisma.ruangan.delete({
      where: { nama },
    });
  }
}