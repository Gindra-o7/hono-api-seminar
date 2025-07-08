import prisma from "../infrastructures/db.infrastructure";

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
}
