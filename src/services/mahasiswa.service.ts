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
  public static async getAll(page: number, limit: number, sortBy?: "asc" | "desc") {
    const skip = (page - 1) * limit;
    const totalMahasiswa = await MahasiswaRepository.countAll();
    const allMahasiswa = await MahasiswaRepository.findAll(skip, limit, sortBy);
    if (!allMahasiswa) {
      throw new APIError(`Tidak ada data mahasiswa`, 404);
    }

    const tahunAjaranSekarang = TahunAjaranHelper.findSekarang();
    const tahunSekarang = parseInt(tahunAjaranSekarang.slice(0, 4));
    const semesterSekarang = parseInt(tahunAjaranSekarang.slice(4));

    const mahasiswaWithSemester = allMahasiswa.map((m) => {
      const angkatan = parseInt(`20${m.nim.slice(1, 3)}`);
      const semester = (tahunSekarang - angkatan) * 2 + semesterSekarang;
      return { ...m, semester, angkatan };
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
        },
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
  public static async search(query?: string, filterAngkatan?: number, sortBy?: "asc" | "desc", page: number = 1, limit: number = 10) {
    // Lakukan pencarian di SQL terlebih dahulu (hanya filter angkatan)
    const sqlResults = await MahasiswaRepository.search(query, filterAngkatan, sortBy);

    if (!sqlResults || sqlResults.length === 0) {
      throw new APIError(`Mahasiswa tidak ditemukan`, 404);
    }

    const tahunAjaranSekarang = TahunAjaranHelper.findSekarang();
    const tahunSekarang = parseInt(tahunAjaranSekarang.slice(0, 4));
    const semesterSekarang = parseInt(tahunAjaranSekarang.slice(4));

    // Tambahkan informasi semester dan angkatan
    const mahasiswaWithDetails = sqlResults.map((m: any) => {
      const angkatan = parseInt(`20${m.nim.slice(1, 3)}`);
      const semester = (tahunSekarang - angkatan) * 2 + semesterSekarang;
      return { ...m, semester, angkatan };
    });

    // Filter hanya mahasiswa semester 6 ke atas
    const filteredMahasiswa = mahasiswaWithDetails.filter((m) => m.semester >= 6);

    if (filteredMahasiswa.length === 0) {
      throw new APIError(`Tidak ada mahasiswa di semester 6 atau lebih.`, 404);
    }

    // Jika tidak ada query, langsung return dengan pagination
    if (!query || query.trim() === "") {
      const total = filteredMahasiswa.length;
      const skip = (page - 1) * limit;
      const paginatedData = filteredMahasiswa.slice(skip, skip + limit);

      return {
        response: true,
        message: `Ditemukan ${total} mahasiswa! 🔍`,
        data: paginatedData,
        query: query || "",
        filters: {
          angkatan: filterAngkatan || "semua",
          sortBy: sortBy || "default",
        },
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }

    // Fuzzy search untuk ranking dan highlighting yang lebih baik
    const fuseOptions = {
      keys: [
        { name: "nama", weight: 0.7 },
        { name: "nim", weight: 0.3 },
      ],
      threshold: 0.6, // Lebih toleran (0.0 = perfect match, 1.0 = match anything)
      distance: 200, // Jarak maksimal untuk match (lebih besar = lebih toleran)
      minMatchCharLength: 1, // Minimal 1 karakter saja
      includeScore: true,
      includeMatches: true,
      ignoreLocation: true, // Tidak peduli posisi match
      findAllMatches: true,
      useExtendedSearch: false,
    };

    const fuse = new Fuse(filteredMahasiswa, fuseOptions);
    const results = fuse.search(query);

    // Jika fuzzy search tidak menemukan hasil, return empty dengan message yang lebih jelas
    if (results.length === 0) {
      throw new APIError(`Tidak ditemukan mahasiswa dengan nama atau NIM yang mirip dengan "${query}"`, 404);
    }

    const total = results.length;
    const skip = (page - 1) * limit;
    const paginatedResults = results.slice(skip, skip + limit);

    const formattedResults = paginatedResults.map((result) => {
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

    // Jika tidak ada sortBy, hasil sudah diurutkan by relevance dari Fuse.js
    // Jika ada sortBy, sorting sudah dilakukan di SQL level

    return {
      response: true,
      message: `Ditemukan ${formattedResults.length} mahasiswa (dari ${total} hasil)! 🔍`,
      data: formattedResults,
      query: query,
      filters: {
        angkatan: filterAngkatan || "semua",
        sortBy: sortBy || "relevance",
      },
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
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

  public static async getAngkatanList() {
    const angkatanList = await MahasiswaRepository.findAngkatan();
    return {
      response: true,
      message: "Data angkatan berhasil diambil!",
      data: angkatanList,
    };
  }
}
