import { JenisJadwal } from "../generated/prisma";
import JadwalRepository from "../repositories/jadwal.repository";
import TahunAjaranHelper from "./tahun-ajaran.helper";

export default class JadwalHelper {
  // Konfigurasi timezone - ubah ke false untuk production (server Swedia)
  private static readonly IS_DEVELOPMENT_LOCALHOST = true;

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

  public static convertToJakartaTimezone(date: Date): Date {
    if (this.IS_DEVELOPMENT_LOCALHOST) {
      return new Date(date);
    }

    const timeZone = "Asia/Jakarta";
    const dateFormatter = new Intl.DateTimeFormat("sv-SE", {
      timeZone: timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    return new Date(dateFormatter.format(date));
  }

  public static convertFromJakartaTimezone(date: Date): Date {
    if (this.IS_DEVELOPMENT_LOCALHOST) {
      return new Date(date);
    }

    const timeZone = "Asia/Jakarta";
    const dateFormatter = new Intl.DateTimeFormat("sv-SE", {
      timeZone: timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const jakartaFormatted = dateFormatter.format(date);
    return new Date(jakartaFormatted);
  }

  public static getCurrentJakartaTime(): Date {
    if (this.IS_DEVELOPMENT_LOCALHOST) {
      return new Date();
    }

    const timeZone = "Asia/Jakarta";
    const today = new Date();
    const dateFormatter = new Intl.DateTimeFormat("sv-SE", {
      timeZone: timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    return new Date(dateFormatter.format(today));
  }
}
