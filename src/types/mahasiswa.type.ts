export interface MahasiswaType {
  nim: string;
  nama: string;
  email: string;
  aktif: boolean;
}

export interface CreateMahasiswaType {
  nim: string;
  nama: string;
  email: string;
  aktif?: boolean;
}

export interface UpdateMahasiswaType {
  nama?: string;
  email?: string;
  aktif?: boolean;
}

export interface MahasiswaWithJadwal extends MahasiswaType {
  jadwal?: Array<{
    id: string;
    tanggal: Date;
    waktu_mulai: Date;
    waktu_selesai: Date;
    jenis: string;
    kode_ruangan: string;
  }>;
}
