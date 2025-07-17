import TahunAjaranRepository from "../repositories/tahun-ajaran.repository";
import { APIError } from "../utils/api-error.util";

export default class TahunAjaranService {

	public static async getAll() {
		const jadwal = await TahunAjaranRepository.findAll();
		if (!jadwal || jadwal.length === 0) {
			throw new APIError("Tahun ajaran tidak ditemukan", 404);
		}
		return {
			response: true,
			message: "Data semua tahun ajaran berhasil diambil",
			data: jadwal,
		};
	}

}
