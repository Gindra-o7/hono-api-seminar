import prisma from "../infrastructures/db.infrastructure";
import { PostJadwalType } from "../types/jadwal.type";
import { JenisJadwal } from "../generated/prisma";

export default class JadwalRepository {
  public static async findAll(jenis?: JenisJadwal) {
    return await prisma.jadwal.findMany({
      where: {
        ...(jenis && { jenis }),
      },
      include: {
        penilaian: true,
      },
    });
  }

  public static async findById(id: string) {
    return await prisma.jadwal.findUnique({
      where: { id },
      include: {
        penilaian: true,
      },
    });
  }

  public static async findMeByEmail(email: string) {
    return await prisma.jadwal.findMany({
      where: {
        OR: [{ mahasiswa: { email } }, { pembimbing_1: { email } }, { pembimbing_2: { email } }, { penguji_1: { email } }, { penguji_2: { email } }, { ketua_sidang: { email } }],
      },
      include: {
        penilaian: true,
      },
    });
  }

  public static async create(data: PostJadwalType) {
    const {
      nim,
      kode_ruangan,
      nip_pembimbing_1,
      nip_pembimbing_2,
      nip_penguji_1,
      nip_penguji_2,
      nip_ketua_sidang,
      ...restOfData
    } = data;

    return await prisma.jadwal.create({
      data: {
        ...restOfData,
        // 2. Hubungkan semua relasi secara eksplisit
        mahasiswa: {
          connect: { nim: nim },
        },
        ruangan: {
          connect: { kode: kode_ruangan },
        },
        pembimbing_1: {
          connect: { nip: nip_pembimbing_1 },
        },
        // Hubungkan relasi opsional hanya jika NIP-nya ada
        ...(nip_pembimbing_2 && {
          pembimbing_2: {
            connect: { nip: nip_pembimbing_2 },
          },
        }),
        penguji_1: {
          connect: { nip: nip_penguji_1 },
        },
        ...(nip_penguji_2 && {
          penguji_2: {
            connect: { nip: nip_penguji_2 },
          },
        }),
        ...(nip_ketua_sidang && {
          ketua_sidang: {
            connect: { nip: nip_ketua_sidang },
          },
        }),
      },
    });
  }

  public static async update(id: string, data: PostJadwalType) {
    return await prisma.jadwal.update({
      where: { id },
      data,
    });
  }

  public static async findLastId(jenis: JenisJadwal, tahunAjaran: string): Promise<string | null> {
    const lastJadwal = await prisma.jadwal.findFirst({
      where: {
        jenis: jenis,
        id: {
          startsWith: `${jenis}-${tahunAjaran}`,
        },
      },
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
      },
    });
    return lastJadwal ? lastJadwal.id : null;
  }
}
