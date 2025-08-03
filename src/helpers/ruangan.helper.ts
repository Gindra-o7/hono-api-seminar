import RuanganRepository from "../repositories/ruangan.repository";
import { APIError } from "../utils/api-error.util";

export default class RuanganHelper {
  public static async cekKonflik(
    kode_ruangan: string, 
    waktu_mulai: Date, 
    waktu_selesai: Date
  ) {
    const konflik = await RuanganRepository.findKonflik(kode_ruangan, waktu_mulai, waktu_selesai);
    if (konflik) {
      throw new APIError(`Ruangan ${kode_ruangan} sudah digunakan pada waktu tersebut`, 409);
    }
  }
}
