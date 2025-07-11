import { z } from "zod";
import { JenisJadwal } from "../generated/prisma";

export const postJadwalSchema = z.object({
  tanggal: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Format tanggal tidak valid",
  }),
  waktu_mulai: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Format waktu mulai tidak valid",
  }),
  waktu_selesai: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Format waktu selesai tidak valid",
  }),
  jenis: z.nativeEnum(JenisJadwal),
  nim: z.string(),
  nama_ruangan: z.string(),
  nip_pembimbing_1: z.string(),
  nip_pembimbing_2: z.string().optional(),
  nip_penguji_1: z.string(),
  nip_penguji_2: z.string().optional(),
  nip_ketua_sidang: z.string(),
});
