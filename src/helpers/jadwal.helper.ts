import { JenisJadwal } from "../generated/prisma";
import DosenRepository from "../repositories/dosen.repository";
import JadwalRepository from "../repositories/jadwal.repository";
import RuanganRepository from "../repositories/ruangan.repository";
import { APIError } from "../utils/api-error.util";
import TahunAjaranHelper from "./tahun-ajaran.helper";

export default class JadwalHelper {
  // public static generateId(jenis: JenisJadwal) {
  //   const tahunAjaran = TahunAjaranHelper.findSekarang();
  //   const uniqueId = crypto.randomUUID();
  //   return `${jenis}-${tahunAjaran}-${uniqueId}`;
  // }

  public static async generateId(jenis: JenisJadwal): Promise<string> {
    const tahunAjaran = TahunAjaranHelper.findSekarang();
    const prefix = `${jenis}-${tahunAjaran}-`;

    const lastId = await JadwalRepository.findLastId(jenis, tahunAjaran);

    let nextNumber = 1;
    if (lastId) {
      const lastNumberStr = lastId.replace(prefix, "");
      const lastNumber = parseInt(lastNumberStr, 10);
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }
    const uniqueId = nextNumber.toString().padStart(3, "0");
    return `${prefix}${uniqueId}`;
  }
}
