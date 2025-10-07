import TahunAjaranHelper from "../helpers/tahun-ajaran.helper";
import MahasiswaRepository from "../repositories/mahasiswa.repository";
import { APIError } from "../utils/api-error.util";

export default class MahasiswaService {
    public static async getMe(email: string) {
		const mahasiswa = await MahasiswaRepository.findByEmail(email);
		if (!mahasiswa) {
			throw new APIError(`Waduh, kamu siapa sih? 😭`, 404);
		}
		return {
			response: true,
			message: "Data kamu berhasil diambil! 😁",
			data: mahasiswa,
		};
	}
	public static async getAll() {
		const allMahasiswa = await MahasiswaRepository.findAll();
		if (!allMahasiswa) {
			throw new APIError(`Tidak ada data mahasiswa`, 404);
		}

		const tahunAjaranSekarang = TahunAjaranHelper.findSekarang()
		const tahunSekarang = parseInt(tahunAjaranSekarang.slice(0, 4));
		const semesterSekarang = parseInt(tahunAjaranSekarang.slice(4))

		const filteredMahasiswa = allMahasiswa.filter(m => {
			const angkatan = parseInt(`20${m.nim.slice(1, 3)}`);
			const semester = (tahunSekarang - angkatan) * 2 + semesterSekarang;
			return semester >= 6;
		});

		if (filteredMahasiswa.length === 0) {
			throw new APIError(`Tidak ada mahasiswa di semester 6 atau lebih.`, 404);
		}

		return {
			response: true,
			message: "Data semua mahasiswa berhasil diambil! 😁",
			data: filteredMahasiswa,
		};
	}
    public static async get(nim: string) {
		const mahasiswa = await MahasiswaRepository.findByNIM(nim);
		if (!mahasiswa) {
			throw new APIError(`Waduh, kamu siapa sih? 😭`, 404);
		}
		return {
			response: true,
			message: "Data mahasiswa berhasil diambil! 😁",
			data: mahasiswa,
		};
	}
}
