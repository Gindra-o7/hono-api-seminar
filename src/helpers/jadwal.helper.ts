import { JenisJadwal } from "../generated/prisma";
import JadwalRepository from "../repositories/jadwal.repository";
import { APIError } from "../utils/api-error.util";
import TahunAjaranHelper from "./tahun-ajaran.helper";

export default class JadwalHelper {
  public static generateJadwalId(jenis: JenisJadwal) {
    const tahunAjaran = TahunAjaranHelper.findSekarang();
    const uniqueId = crypto.randomUUID();
    return `${jenis}-${tahunAjaran}-${uniqueId}`;
  }

  public static async cekKonflikRuangan(
    kode_ruangan: string,
    waktu_mulai: Date,
    waktu_selesai: Date
  ) {
    const konflik = await JadwalRepository.findKonflikRuangan(
      kode_ruangan,
      waktu_mulai,
      waktu_selesai
    );
    if (konflik) {
      throw new APIError(
        `Konflik jadwal: Ruangan ${kode_ruangan} sudah digunakan pada waktu tersebut`,
        409
      );
    }
  }

  public static async cekKonflikDosen(
    nips: string[],
    waktu_mulai: Date,
    waktu_selesai: Date
  ) {
    const konflik = await JadwalRepository.findKonflikDosen(
      nips,
      waktu_mulai,
      waktu_selesai
    );
    if (konflik) {
      throw new APIError(
        `Konflik jadwal: Salah satu dosen sudah memiliki jadwal pada waktu tersebut`,
        409
      );
    }
  }

  public static async cekDosen(
    nip_pembimbing_1: string,
    nip_pembimbing_2: string | undefined,
    nip_penguji_1: string,
    nip_penguji_2: string | undefined
  ) {
    const pembimbingNips = [nip_pembimbing_1, nip_pembimbing_2].filter(
      (nip) => nip !== undefined
    );
    const pengujiNips = [nip_penguji_1, nip_penguji_2].filter(
      (nip) => nip !== undefined
    );
    const isConflict = pembimbingNips.some((pembimbing) =>
      pengujiNips.includes(pembimbing)
    );
    if (isConflict) {
      throw new APIError(
        `Konflik jadwal: Salah satu dosen sudah menjadi pembimbing dan penguji`,
        409
      );
    }
  }
}