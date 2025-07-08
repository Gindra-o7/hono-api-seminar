import prisma from "../src/infrastructures/db.infrastructure";

console.log("[INFO] Seeding database...");

async function main() {
	console.log("[DEBUG] Running createMany...");

	const resultDosen = await prisma.dosen.createMany({
		data: [
			{
				nip: "198804262019032009",
				nama: "Iis Afrianty, S.T., M.Sc.,",
				email: "iis.afrianty@uin-suska.ac.id",
			},
		],
		skipDuplicates: true,
	});

	console.log(
		"[DEBUG] Result of inserted dosen createMany:",
		resultDosen.count > 0
			? resultDosen
			: "Data was inserted previously, no new data inserted."
	);

	const resultMahasiswa = await prisma.mahasiswa.createMany({
		data: [
			{
				nim: "12250113521",
				nama: "M. Farhan Aulia Pratama",
				email: "12250113521@students.uin-suska.ac.id",
				nip: "198804262019032009"
			},
		],
		skipDuplicates: true,
	});

	console.log(
		"[DEBUG] Result of inserted mahasiswa createMany:",
		resultMahasiswa.count > 0
			? resultMahasiswa
			: "Data was inserted previously, no new data inserted."
	);

	const resultRuangan = await prisma.ruangan.createMany({
		data: [
			{ nama: "FST-301" },
			{ nama: "FST-302" },
			{ nama: "FST-303" },
			{ nama: "FST-304" },
			{ nama: "FST-305" },
			{ nama: "FST-306" },
		],
		skipDuplicates: true,
	});

	console.log(
		"[DEBUG] Result of inserted ruangan createMany:",
		resultRuangan.count > 0
			? resultRuangan
			: "Data was inserted previously, no new data inserted."
	);

	const resultTahunAjaran = await prisma.tahun_ajaran.createMany({
		data: [
			{ 
				kode: "202520262",
				nama: "2025/2026 Genap",
				tgl_mulai: new Date("2025-01-30"),
				tgl_selesai: new Date("2025-07-30")
			}
		],
		skipDuplicates: true,
	});

	console.log(
		"[DEBUG] Result of inserted tahun_ajaran createMany:",
		resultTahunAjaran.count > 0
			? resultTahunAjaran
			: "Data was inserted previously, no new data inserted."
	);
}

main()
	.catch((e) => {
		console.error(`[ERROR] ${e.message}`);
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		console.log("[INFO] Seeding finished, disconnecting...");
		await prisma.$disconnect();
		process.exit(0);
	});
