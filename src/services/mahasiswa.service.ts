import Fuse from "fuse.js";
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
  public static async getAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const totalMahasiswa = await MahasiswaRepository.countAll();
    const allMahasiswa = await MahasiswaRepository.findAll(skip, limit);
    if (!allMahasiswa) {
      throw new APIError(`Tidak ada data mahasiswa`, 404);
    }

    const tahunAjaranSekarang = TahunAjaranHelper.findSekarang();
    const tahunSekarang = parseInt(tahunAjaranSekarang.slice(0, 4));
    const semesterSekarang = parseInt(tahunAjaranSekarang.slice(4));

    const mahasiswaWithSemester = allMahasiswa.map((m) => {
      const angkatan = parseInt(`20${m.nim.slice(1, 3)}`);
      const semester = (tahunSekarang - angkatan) * 2 + semesterSekarang;
      return { ...m, semester };
    });

    const filteredMahasiswa = mahasiswaWithSemester.filter((m) => {
      return m.semester >= 6;
    });

    if (filteredMahasiswa.length === 0) {
      throw new APIError(`Tidak ada mahasiswa di semester 6 atau lebih.`, 404);
    }

    return {
      response: true,
      message: "Data semua mahasiswa berhasil diambil! 😁",
      data: {
				mahasiswa: filteredMahasiswa,
				pagination: {
					total: totalMahasiswa,
					page,
					limit,
					totalPages: Math.ceil(totalMahasiswa / limit),
				}
			},
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
  public static async search(query: string) {
    const allMahasiswa = await MahasiswaRepository.findMany();

    if (!allMahasiswa || allMahasiswa.length === 0) {
      throw new APIError(`Tidak ada data mahasiswa`, 404);
    }

    const tahunAjaranSekarang = TahunAjaranHelper.findSekarang();
    const tahunSekarang = parseInt(tahunAjaranSekarang.slice(0, 4));
    const semesterSekarang = parseInt(tahunAjaranSekarang.slice(4));

    const mahasiswaWithSemester = allMahasiswa.map((m) => {
      const angkatan = parseInt(`20${m.nim.slice(1, 3)}`);
      const semester = (tahunSekarang - angkatan) * 2 + semesterSekarang;
      return { ...m, semester };
    });

    const fuseOptions = {
      keys: [
        { name: "nama", weight: 0.7 },
        { name: "nim", weight: 0.3 },
      ],
      threshold: 0.4,
      distance: 100,
      minMatchCharLength: 2,
      includeScore: true,
      includeMatches: true,
      ignoreLocation: true,
      findAllMatches: true,
    };

    const fuse = new Fuse(mahasiswaWithSemester, fuseOptions);
    const results = fuse.search(query);

    if (results.length === 0) {
      throw new APIError(`Mahasiswa tidak ditemukan`, 404);
    }

    const formattedResults = results.map((result) => {
      const mahasiswa = result.item;
      const matches = result.matches || [];

      const highlights: any = {};

      matches.forEach((match) => {
        if (match.key && match.indices) {
          const fieldValue = match.value || "";
          const highlightedText = this.highlightMatches(fieldValue, match.indices);
          highlights[match.key] = highlightedText;
        }
      });

      return {
        ...mahasiswa,
        _highlights: highlights,
        _score: result.score,
      };
    });

    return {
      response: true,
      message: `Ditemukan ${formattedResults.length} mahasiswa! 🔍`,
      data: formattedResults,
      query: query,
    };
  }

  private static highlightMatches(text: string, indices: readonly [number, number][]): string {
    let result = "";
    let lastIndex = 0;

    const sortedIndices = [...indices].sort((a, b) => a[0] - b[0]);

    sortedIndices.forEach(([start, end]) => {
      result += text.substring(lastIndex, start);
      result += `<mark>${text.substring(start, end + 1)}</mark>`;
      lastIndex = end + 1;
    });

    result += text.substring(lastIndex);

    return result;
  }
}
