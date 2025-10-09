import { mahasiswa } from "../generated/prisma";

export interface MahasiswaWithSemester extends mahasiswa {
  semester: number;
}