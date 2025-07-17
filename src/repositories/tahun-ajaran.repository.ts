import TahunAjaranHelper from "../helpers/tahun-ajaran.helper";
import prisma from "../infrastructures/db.infrastructure";

export default class TahunAjaranRepository {
	public static async findAll() {
		const list_kode_tahun_ajaran = await prisma.jadwal.findMany({
			select: {
				kode_tahun_ajaran: true,
			},
            orderBy: {
                kode_tahun_ajaran: "desc",
            },
            distinct: ["kode_tahun_ajaran"],        
		});

		return list_kode_tahun_ajaran.map((item) => ({
			kode: item.kode_tahun_ajaran,
			nama: TahunAjaranHelper.parseStringNameByCode(item.kode_tahun_ajaran),
		}));
	}
}
