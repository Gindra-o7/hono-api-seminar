import RuanganRepository from "../repositories/ruangan.repository";
import { APIError } from "../utils/api-error.util";
import { PostRuanganType } from "../types/ruangan.type";

export default class RuanganService {
  public static async getAll() {
    const ruangan = await RuanganRepository.findAll();
    return {
      response: true,
      message: "Data semua ruangan berhasil diambil",
      data: ruangan,
    };
  }

  public static async get(kode: string) {
    const ruangan = await RuanganRepository.findByKode(kode);
    if (!ruangan) {
      throw new APIError(`Ruangan dengan nama ${kode} tidak ditemukan`, 404);
    }
    return {
      response: true,
      message: "Data ruangan berhasil diambil",
      data: ruangan,
    };
  }

  public static async post(data: PostRuanganType) {
    const existingRuangan = await RuanganRepository.findByKode(data.kode);
    if (existingRuangan) {
      throw new APIError(`Ruangan dengan nama ${data.nama} sudah ada`, 409);
    }

    const ruangan = await RuanganRepository.create(data);
    return {
      response: true,
      message: "Ruangan berhasil ditambahkan",
      data: ruangan,
    };
  }

  public static async put(nama: string, data: PostRuanganType) {
    await this.get(nama);
    const ruangan = await RuanganRepository.update(nama, data);
    return {
      response: true,
      message: "Ruangan berhasil diperbarui",
      data: ruangan,
    };
  }

  public static async delete(kode: string) {
    await this.get(kode);
    await RuanganRepository.destroy(kode);
    return {
      response: true,
      message: "Ruangan berhasil dihapus",
    };
  }
}