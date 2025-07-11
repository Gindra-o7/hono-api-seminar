import prisma from "../infrastructures/db.infrastructure";
import { PostJadwalType } from "../types/jadwal.type";

export default class JadwalRepository {
  public static async findAll() {
    return prisma.jadwal.findMany();
  }

  public static async findById(id: string) {
    return prisma.jadwal.findUnique({
      where: { id },
    });
  }

  public static async findMe(email: string) {
    return prisma.jadwal.findMany({
      where: {
        OR: [
          { mahasiswa: { email } },
          { pembimbing_1: { email } },
          { pembimbing_2: { email } },
          { penguji_1: { email } },
          { penguji_2: { email } },
          { ketua_sidang: { email } },
        ],
      },
    });
  }

  public static async findKonflikRuangan(
    nama_ruangan: string,
    waktu_mulai: Date,
    waktu_selesai: Date
  ) {
    return prisma.jadwal.findFirst({
      where: {
        nama_ruangan,
        OR: [
          {
            waktu_mulai: {
              lt: waktu_selesai,
            },
            waktu_selesai: {
              gt: waktu_mulai,
            },
          },
        ],
      },
    });
  }

  public static async findKonflikDosen(
    nips: string[],
    waktu_mulai: Date,
    waktu_selesai: Date
  ) {
    return prisma.jadwal.findFirst({
      where: {
        OR: [
          { nip_pembimbing_1: { in: nips } },
          { nip_pembimbing_2: { in: nips } },
          { nip_penguji_1: { in: nips } },
          { nip_penguji_2: { in: nips } },
          { nip_ketua_sidang: { in: nips } },
        ],
        AND: [
          {
            waktu_mulai: {
              lt: waktu_selesai,
            },
            waktu_selesai: {
              gt: waktu_mulai,
            },
          },
        ],
      },
    });
  }

  public static async create(data: PostJadwalType) {
    return prisma.jadwal.create({
      data,
    });
  }

  public static async update(id: string, data: PostJadwalType) {
    return prisma.jadwal.update({
      where: { id },
      data,
    });
  }
}