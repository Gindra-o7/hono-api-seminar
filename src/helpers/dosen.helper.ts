import DosenRepository from "../repositories/dosen.repository";
import { APIError } from "../utils/api-error.util";

export default class DosenHelper {
  public static async cekKonflik(
    nip: string[], 
    waktu_mulai: Date, 
    waktu_selesai: Date
  ) {
    const konflik = await DosenRepository.findKonflik(nip, waktu_mulai, waktu_selesai);
    if (konflik) {
      throw new APIError(`Salah satu dosen sudah memiliki jadwal pada waktu tersebut`, 409);
    }
  }

  public static async cekRole(
    nip_pembimbing_1: string, 
    nip_pembimbing_2: string | undefined, 
    nip_penguji_1: string, 
    nip_penguji_2: string | undefined
  ) {
    const pembimbingNips = [nip_pembimbing_1, nip_pembimbing_2].filter((nip) => nip !== undefined);
    const pengujiNips = [nip_penguji_1, nip_penguji_2].filter((nip) => nip !== undefined);
    const isConflict = pembimbingNips.some((pembimbing) => pengujiNips.includes(pembimbing));
    if (isConflict) {
      throw new APIError(`Dosen sudah menjadi pembimbing atau penguji`, 409);
    }
  }
}
