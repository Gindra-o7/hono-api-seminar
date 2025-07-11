import JadwalRepository from "../repositories/jadwal.repository";
import { APIError } from "../utils/api-error.util";

export default class JadwalHelper {
  public static async cekKonflikRuangan(
    nama_ruangan: string,
    waktu_mulai: Date,
    waktu_selesai: Date
  ) {
    const konflik = await JadwalRepository.findKonflikRuangan(
      nama_ruangan,
      waktu_mulai,
      waktu_selesai
    );
    if (konflik) {
      throw new APIError(
        `Konflik jadwal: Ruangan ${nama_ruangan} sudah digunakan pada waktu tersebut`,
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
}