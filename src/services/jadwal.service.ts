import JadwalRepository from "../repositories/jadwal.repository";
import { APIError } from "../utils/api-error.util";
import { PostJadwalType } from "../types/jadwal.type";
import JadwalHelper from "../helpers/jadwal.helper";
import TahunAjaranHelper from "../helpers/tahun-ajaran.helper";
import { JenisJadwal } from "@prisma/client/index-browser";
import RuanganHelper from "../helpers/ruangan.helper";
import DosenHelper from "../helpers/dosen.helper";
import MahasiswaRepository from "../repositories/mahasiswa.repository";
import DosenRepository from "../repositories/dosen.repository";
import RuanganRepository from "../repositories/ruangan.repository";

export default class JadwalService {
  public static async getMe(email: string) {
    const jadwal = await JadwalRepository.findMeByEmail(email);
    if (!jadwal) {
      throw new APIError("Jadwal tidak ditemukan", 404);
    }

    // Konversi waktu ke timezone Asia/Jakarta
    const jadwalWithTimezone = {
      ...jadwal,
      waktu_mulai: (jadwal as any).waktu_mulai ? JadwalHelper.convertToJakartaTimezone((jadwal as any).waktu_mulai) : null,
      waktu_selesai: (jadwal as any).waktu_selesai ? JadwalHelper.convertToJakartaTimezone((jadwal as any).waktu_selesai) : null,
    };

    return {
      response: true,
      message: "Data jadwal berhasil diambil",
      data: jadwalWithTimezone,
    };
  }

  public static async getAll(jenis?: JenisJadwal) {
    const kode_tahun_ajaran = TahunAjaranHelper.findSekarang();
    const jadwal = await JadwalRepository.findAll(kode_tahun_ajaran, jenis);
    if (!jadwal || jadwal.length === 0) {
      return {
        response: true,
        message: "Data jadwal masih kosong",
        data: [],
      }
    }

    const tahunSekarang = parseInt(kode_tahun_ajaran.slice(0, 4));
    const semesterSekarang = parseInt(kode_tahun_ajaran.slice(4));
    const dataWithSemester = jadwal.map((j) => {
      const nim = j.mahasiswa?.nim || "";
      const angkatan = nim ? parseInt(`20${nim.slice(1, 3)}`) : tahunSekarang; // fallback agar tidak NaN
      const semester = (tahunSekarang - angkatan) * 2 + semesterSekarang;

      // Konversi waktu_mulai dan waktu_selesai ke timezone Asia/Jakarta menggunakan helper
      const waktuMulaiJakarta = j.waktu_mulai ? JadwalHelper.convertToJakartaTimezone(j.waktu_mulai) : null;
      const waktuSelesaiJakarta = j.waktu_selesai ? JadwalHelper.convertToJakartaTimezone(j.waktu_selesai) : null;

      return {
        ...j,
        semester,
        waktu_mulai: waktuMulaiJakarta,
        waktu_selesai: waktuSelesaiJakarta
      };
    });

    return {
      response: true,
      message: "Data semua jadwal berhasil diambil",
      data: dataWithSemester,
    };
  }

  public static async get(id: string) {
    const jadwal = await JadwalRepository.findById(id);
    if (!jadwal) {
      throw new APIError("Jadwal tidak ditemukan", 404);
    }

    // Konversi waktu ke timezone Asia/Jakarta
    const jadwalWithTimezone = {
      ...jadwal,
      waktu_mulai: (jadwal as any).waktu_mulai ? JadwalHelper.convertToJakartaTimezone((jadwal as any).waktu_mulai) : null,
      waktu_selesai: (jadwal as any).waktu_selesai ? JadwalHelper.convertToJakartaTimezone((jadwal as any).waktu_selesai) : null,
    };

    return {
      response: true,
      message: "Data jadwal berhasil diambil",
      data: jadwalWithTimezone,
    };
  }

  public static async post(data: PostJadwalType) {
    await this.validateMahasiswa(data.nim);

    await this.validateDosen(data.nip_pembimbing_1, "Pembimbing 1");
    if (data.nip_pembimbing_2) {
      await this.validateDosen(data.nip_pembimbing_2, "Pembimbing 2");
    }
    await this.validateDosen(data.nip_penguji_1, "Penguji 1");
    if (data.nip_penguji_2) {
      await this.validateDosen(data.nip_penguji_2, "Penguji 2");
    }
    if (data.nip_ketua_sidang) {
      await this.validateDosen(data.nip_ketua_sidang, "Ketua Sidang");
    }

    await this.validateRuangan(data.kode_ruangan);

    // Konversi waktu input ke timezone server sebelum validasi
    const waktuMulaiServer = JadwalHelper.convertFromJakartaTimezone(new Date(data.waktu_mulai));
    const waktuSelesaiServer = JadwalHelper.convertFromJakartaTimezone(new Date(data.waktu_selesai));

    await RuanganHelper.cekKonflik(data.kode_ruangan, waktuMulaiServer, waktuSelesaiServer);

    const nips = [data.nip_pembimbing_1, data.nip_pembimbing_2, data.nip_penguji_1, data.nip_penguji_2, data.nip_ketua_sidang].filter((nip) => nip !== undefined) as string[];
    await DosenHelper.cekKonflik(nips, waktuMulaiServer, waktuSelesaiServer);

    await DosenHelper.cekRole(data.nip_pembimbing_1, data.nip_pembimbing_2, data.nip_penguji_1, data.nip_penguji_2);

    await this.validateBusinessLogic(data);

    const id = await JadwalHelper.generateId(data.jenis);
    const kode_tahun_ajaran = TahunAjaranHelper.findSekarang();

    const { id: _, ...dataWithoutId } = data;
    // Validasi: satu mahasiswa hanya boleh memiliki satu jadwal per jenis pada tahun ajaran berjalan
    const existing = await JadwalRepository.existsByMahasiswaJenisTahun(data.nim, data.jenis as JenisJadwal, kode_tahun_ajaran);
    if (existing) {
      throw new APIError(`Mahasiswa ${data.nim} sudah memiliki jadwal untuk jenis ${data.jenis} pada tahun ajaran ${kode_tahun_ajaran}`, 400);
    }

    const jadwal = await JadwalRepository.create({
      id,
      ...dataWithoutId,
      waktu_mulai: waktuMulaiServer,
      waktu_selesai: waktuSelesaiServer,
      kode_tahun_ajaran,
    });

    // Konversi waktu response ke timezone Asia/Jakarta
    const jadwalWithTimezone = {
      ...jadwal,
      waktu_mulai: (jadwal as any).waktu_mulai ? JadwalHelper.convertToJakartaTimezone((jadwal as any).waktu_mulai) : null,
      waktu_selesai: (jadwal as any).waktu_selesai ? JadwalHelper.convertToJakartaTimezone((jadwal as any).waktu_selesai) : null,
    };

    return {
      response: true,
      message: "Jadwal berhasil ditambahkan",
      data: jadwalWithTimezone,
    };
  }

  public static async put(id: string, data: PostJadwalType) {
    await this.get(id);

    await this.validateMahasiswa(data.nim);

    await this.validateDosen(data.nip_pembimbing_1, "Pembimbing 1");
    if (data.nip_pembimbing_2) {
      await this.validateDosen(data.nip_pembimbing_2, "Pembimbing 2");
    }
    await this.validateDosen(data.nip_penguji_1, "Penguji 1");
    if (data.nip_penguji_2) {
      await this.validateDosen(data.nip_penguji_2, "Penguji 2");
    }
    if (data.nip_ketua_sidang) {
      await this.validateDosen(data.nip_ketua_sidang, "Ketua Sidang");
    }

    await this.validateRuangan(data.kode_ruangan);

    // Konversi waktu input ke timezone server sebelum validasi
    const waktuMulaiServer = JadwalHelper.convertFromJakartaTimezone(new Date(data.waktu_mulai));
    const waktuSelesaiServer = JadwalHelper.convertFromJakartaTimezone(new Date(data.waktu_selesai));

    await RuanganHelper.cekKonflik(data.kode_ruangan, waktuMulaiServer, waktuSelesaiServer, id);

    const nips = [data.nip_pembimbing_1, data.nip_pembimbing_2, data.nip_penguji_1, data.nip_penguji_2, data.nip_ketua_sidang].filter((nip) => nip !== undefined) as string[];
    await DosenHelper.cekKonflik(nips, waktuMulaiServer, waktuSelesaiServer, id);

    await DosenHelper.cekRole(data.nip_pembimbing_1, data.nip_pembimbing_2, data.nip_penguji_1, data.nip_penguji_2);

    await this.validateBusinessLogic(data);

    // Validasi: satu mahasiswa hanya boleh memiliki satu jadwal per jenis pada tahun ajaran berjalan (kecuali record ini sendiri)
    const kode_tahun_ajaran = TahunAjaranHelper.findSekarang();
    const existing = await JadwalRepository.existsByMahasiswaJenisTahun(data.nim, data.jenis as JenisJadwal, kode_tahun_ajaran, id);
    if (existing) {
      throw new APIError(`Mahasiswa ${data.nim} sudah memiliki jadwal untuk jenis ${data.jenis} pada tahun ajaran ${kode_tahun_ajaran}`, 400);
    }

    const jadwal = await JadwalRepository.update(id, {
      ...data,
      waktu_mulai: waktuMulaiServer,
      waktu_selesai: waktuSelesaiServer,
    });
    // Konversi waktu response ke timezone Asia/Jakarta
    const jadwalWithTimezone = {
      ...jadwal,
      waktu_mulai: (jadwal as any).waktu_mulai ? JadwalHelper.convertToJakartaTimezone((jadwal as any).waktu_mulai) : null,
      waktu_selesai: (jadwal as any).waktu_selesai ? JadwalHelper.convertToJakartaTimezone((jadwal as any).waktu_selesai) : null,
    };

    return {
      response: true,
      message: "Jadwal berhasil diperbarui",
      data: jadwalWithTimezone,
    };
  }

  public static async validateMahasiswa(nim: string) {
    const mahasiswa = await MahasiswaRepository.findByNIM(nim);
    if (!mahasiswa) {
      throw new APIError(`Mahasiswa dengan NIM ${nim} tidak ditemukan`, 404);
    }
    if (!mahasiswa.aktif) {
      throw new APIError(`Mahasiswa dengan NIM ${nim} tidak aktif`, 400);
    }
    return mahasiswa;
  }

  public static async validateDosen(nip: string, role: string) {
    const dosen = await DosenRepository.findByNip(nip);
    if (!dosen) {
      throw new APIError(`${role} dengan NIP ${nip} tidak ditemukan`, 404);
    }

    if (!dosen.email) {
      throw new APIError(`${role} ${dosen.nama} belum memiliki email`, 400);
    }

    return dosen;
  }

  public static async validateRuangan(kode_ruangan: string) {
    const ruangan = await RuanganRepository.findByKode(kode_ruangan);
    if (!ruangan) {
      throw new APIError(`Ruangan dengan kode ${kode_ruangan} tidak ditemukan`, 404);
    }
    if (!ruangan.status) {
      throw new APIError(`Ruangan ${ruangan.nama} sedang tidak tersedia`, 400);
    }
    return ruangan;
  }

  public static async validateBusinessLogic(data: PostJadwalType) {
    if (data.nip_pembimbing_2 && data.nip_pembimbing_1 === data.nip_pembimbing_2) {
      throw new APIError("Pembimbing 1 dan Pembimbing 2 tidak boleh sama", 400);
    }

    if (data.nip_penguji_2 && data.nip_penguji_1 === data.nip_penguji_2) {
      throw new APIError("Penguji 1 dan Penguji 2 tidak boleh sama", 400);
    }

    if (data.nip_ketua_sidang) {
      const ketuaSidang = data.nip_ketua_sidang;
      const pembimbingPenguji = [
        data.nip_pembimbing_1,
        data.nip_pembimbing_2,
        data.nip_penguji_1,
        data.nip_penguji_2
      ].filter(Boolean);

      if (pembimbingPenguji.includes(ketuaSidang)) {
        throw new APIError("Ketua sidang tidak boleh menjadi pembimbing atau penguji", 400);
      }
    }

    if (data.jenis === 'SEMKP') {
      if (data.nip_pembimbing_2 || data.nip_penguji_2 || data.nip_ketua_sidang) {
        throw new APIError("Seminar KP hanya memerlukan 1 pembimbing dan 1 penguji saja", 400);
      }
    } else {
      if (!data.nip_pembimbing_2 || !data.nip_penguji_2 || !data.nip_ketua_sidang) {
        throw new APIError("Seminar selain KP memerlukan 2 pembimbing, 2 penguji, dan 1 ketua sidang", 400);
      }
    }
  }

  public static async delete(id: string) {
    await this.get(id);

    await JadwalRepository.destroy(id);

    return {
      response: true,
      message: "Jadwal berhasil dihapus",
    };
  }
}
