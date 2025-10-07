import { Context } from "hono";
import { APIError } from "../utils/api-error.util";
import MahasiswaService from "../services/mahasiswa.service";

export default class MahasiswaHandler {
	public static async getMe(c: Context) {
		const { email } = c.get("user");
		if (!email) throw new APIError("Waduh, email kamu kosong cuy! 😭", 404);
		return c.json(await MahasiswaService.getMe(email));
	}

    public static async getAll(c: Context) {
		return c.json(await MahasiswaService.getAll());
	}

    public static async get(c: Context) {
        const { nim } = c.req.param();
		return c.json(await MahasiswaService.get(nim));
	}
}
