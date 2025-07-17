import { JenisJadwal } from "../generated/prisma";

export interface PostJadwalType {
  tanggal: Date;
  waktu_mulai: Date;
  waktu_selesai: Date;
  jenis: JenisJadwal;
  nim: string;
  kode_ruangan: string;
  nip_pembimbing_1: string;
  nip_pembimbing_2?: string;
  nip_penguji_1: string;
  nip_penguji_2?: string;
  nip_ketua_sidang: string;
  kode_tahun_ajaran: string;
}