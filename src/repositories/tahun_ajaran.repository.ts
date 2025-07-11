import prisma from "../infrastructures/db.infrastructure";
import { PostTahunAjaranType } from "../types/tahun_ajaran.type";

export default class TahunAjaranRepository {
	public static async findSekarang() {
		return prisma.tahun_ajaran.findFirst({
			where: {
				tgl_mulai: {
					lte: new Date(),
				},
				tgl_selesai: {
					gte: new Date(),
				},
			},
		});
	}

	public static async findAll() {
		return prisma.tahun_ajaran.findMany()
	}

	public static async create(data: PostTahunAjaranType) {
		return prisma.tahun_ajaran.create({ 
			data 
		});
	}
}
