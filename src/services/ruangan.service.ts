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

  public static async get(nama: string) {
    const ruangan = await RuanganRepository.findByName(nama);
    if (!ruangan) {
      throw new APIError(`Ruangan dengan nama ${nama} tidak ditemukan`, 404);
    }
    return {
      response: true,
      message: "Data ruangan berhasil diambil",
      data: ruangan,
    };
  }

  public static async post(data: PostRuanganType) {
    const existingRuangan = await RuanganRepository.findByName(data.nama);
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

  public static async delete(nama: string) {
    await this.get(nama);
    await RuanganRepository.destroy(nama);
    return {
      response: true,
      message: "Ruangan berhasil dihapus",
    };
  }
}