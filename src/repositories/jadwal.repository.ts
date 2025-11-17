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
        mahasiswa: true,
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

  public static async existsByMahasiswaJenisTahun(nim: string, jenis: JenisJadwal, kode_tahun_ajaran: string, excludeId?: string) {
    return await prisma.jadwal.findFirst({
      where: {
        nim,
        jenis,
        kode_tahun_ajaran,
        ...(excludeId && { id: { not: excludeId } }),
      },
      select: { id: true },
    });
  }

  public static async create(data: PostJadwalType) {
    const createData: any = {
      id: data.id,
      tanggal: data.tanggal,
      waktu_mulai: data.waktu_mulai,
      waktu_selesai: data.waktu_selesai,
      jenis: data.jenis,
      kode_tahun_ajaran: data.kode_tahun_ajaran,
      nim: data.nim,
      kode_ruangan: data.kode_ruangan,
      nip_pembimbing_1: data.nip_pembimbing_1,
      nip_penguji_1: data.nip_penguji_1,
    };

    if (data.nip_pembimbing_2) {
      createData.nip_pembimbing_2 = data.nip_pembimbing_2;
    }
    if (data.nip_penguji_2) {
      createData.nip_penguji_2 = data.nip_penguji_2;
    }
    if (data.nip_ketua_sidang) {
      createData.nip_ketua_sidang = data.nip_ketua_sidang;
    }

    return await prisma.jadwal.create({
      data: createData,
    });
  }

  public static async update(id: string, data: PostJadwalType) {
    const updateData: any = {
      tanggal: data.tanggal,
      waktu_mulai: data.waktu_mulai,
      waktu_selesai: data.waktu_selesai,
      jenis: data.jenis,
      kode_tahun_ajaran: data.kode_tahun_ajaran,
      nim: data.nim,
      kode_ruangan: data.kode_ruangan,
      nip_pembimbing_1: data.nip_pembimbing_1,
      nip_penguji_1: data.nip_penguji_1,
    };

    if (data.nip_pembimbing_2) {
      updateData.nip_pembimbing_2 = data.nip_pembimbing_2;
    }
    if (data.nip_penguji_2) {
      updateData.nip_penguji_2 = data.nip_penguji_2;
    }
    if (data.nip_ketua_sidang) {
      updateData.nip_ketua_sidang = data.nip_ketua_sidang;
    }

    return await prisma.jadwal.update({
      where: { id },
      data: updateData,
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

  public static async destroy(id: string) {
    return await prisma.jadwal.delete({
      where: { id },
    });
  }
}
