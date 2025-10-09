import { JenisJadwal } from "../generated/prisma";
import JadwalRepository from "../repositories/jadwal.repository";
import TahunAjaranHelper from "./tahun-ajaran.helper";

export default class JadwalHelper {
  public static async generateId(jenis: JenisJadwal): Promise<string> {
    const singkatan = this.singkatanJenis(jenis);
    const tahunAjaran = TahunAjaranHelper.findSekarang();
    const prefix = `J${singkatan}${tahunAjaran}`;

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

  public static singkatanJenis(jenis: JenisJadwal): string {
    const pemetaan = {
      [JenisJadwal.SEMKP]: "KP",
      [JenisJadwal.SEMPRO]: "TAPRO",
      [JenisJadwal.SEMHAS_LAPORAN]: "TAHLP",
      [JenisJadwal.SEMHAS_PAPERBASED]: "TAHPB",
      [JenisJadwal.SIDANG_TA_LAPORAN]: "TASLP",
      [JenisJadwal.SIDANG_TA_PAPERBASED]: "TASPB",
    };
    return pemetaan[jenis] || "JNS";
  }

  // public static convertJadwalTime(jadwal: any[]) {
  //   const timezone = "Asia/Jakarta";
  //   const options: Intl.DateTimeFormatOptions = {
  //     timezone,
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     second: "2-digit",
  //   };
  //   return jadwal.map((j) => ({
  //     ...j,
  //     waktu_mulai: new Date(j.waktu_mulai).toLocaleTimeString("id-ID", options),
  //     waktu_selesai: new Date(j.waktu_selesai).toLocaleTimeString("id-ID", options),
  //   }));
  // }
}
