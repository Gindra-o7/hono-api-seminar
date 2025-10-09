import prisma from "../infrastructures/db.infrastructure";
import { PostJadwalType } from "../types/jadwal.type";
import { JenisJadwal } from "../generated/prisma";
import JadwalHelper from "../helpers/jadwal.helper";

export default class JadwalRepository {
  public static async findAll(kode_tahun_ajaran: string, jenis?: JenisJadwal) {
    return await prisma.jadwal.findMany({
      where: {
        kode_tahun_ajaran,
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
    return await prisma.jadwal.create({
      data,
    });
  }

  public static async update(id: string, data: PostJadwalType) {
    return await prisma.jadwal.update({
      where: { id },
      data,
    });
  }

  public static async findLastId(jenis: JenisJadwal, tahunAjaran: string): Promise<string | null> {
    const singkatan = JadwalHelper.singkatanJenis(jenis);
    const lastJadwal = await prisma.jadwal.findFirst({
      where: {
        jenis: jenis,
        id: {
          startsWith: `J${singkatan}${tahunAjaran}`,
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
