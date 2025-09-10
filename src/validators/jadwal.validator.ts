import { z } from "zod";
import { JenisJadwal } from "../generated/prisma";

export const postPutJadwalSchema = z
  .object({
    tanggal: z.coerce.date({
      errorMap: () => ({ message: "Format tanggal tidak valid" }),
    }),
    waktu_mulai: z.coerce.date({
      errorMap: () => ({ message: "Format waktu mulai tidak valid" }),
    }),
    waktu_selesai: z.coerce.date({
      errorMap: () => ({ message: "Format waktu selesai tidak valid" }),
    }),
    jenis: z.nativeEnum(JenisJadwal),
    nim: z.string(),
    kode_ruangan: z.string(),
    nip_pembimbing_1: z.string(),
    nip_pembimbing_2: z.string().optional(),
    nip_penguji_1: z.string(),
    nip_penguji_2: z.string().optional(),
    nip_ketua_sidang: z.string().optional(),
  })
  .refine((data) => data.waktu_selesai > data.waktu_mulai, {
    message: "Waktu selesai tidak boleh lebih awal dari waktu mulai",
    path: ["waktu_selesai"],
  });
