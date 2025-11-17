import prisma from "../infrastructures/db.infrastructure";

export default class DosenRepository {
  public static async findAll() {
    return prisma.dosen.findMany();
  }
  public static async findKonflik(nip: string[], waktu_mulai: Date, waktu_selesai: Date, excludeJadwalId?: string) {
    return await prisma.jadwal.findFirst({
      where: {
        ...(excludeJadwalId && { id: { not: excludeJadwalId } }),
        OR: [{ nip_pembimbing_1: { in: nip } }, { nip_pembimbing_2: { in: nip } }, { nip_penguji_1: { in: nip } }, { nip_penguji_2: { in: nip } }, { nip_ketua_sidang: { in: nip } }],
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
  public static async findByNip(nip: string) {
    return await prisma.dosen.findUnique({
      where: { nip },
    });
  }
}
