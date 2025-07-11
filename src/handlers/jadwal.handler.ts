import { Context } from "hono";
import JadwalService from "../services/jadwal.service";
import { APIError } from "../utils/api-error.util";

export default class JadwalHandler {
  public static async getMe(c: Context) {
    const { email } = c.get("user");
    if (!email) throw new APIError("Waduh, email kamu kosong cuy! 😭", 404);
    return c.json(await JadwalService.getMe(email));
  }

  public static async getAll(c: Context) {
    return c.json(await JadwalService.getAll());
  }

  public static async get(c: Context) {
    const { id } = c.req.param();
    return c.json(await JadwalService.get(id));
  }

  public static async post(c: Context) {
    const body = await c.req.json();
    return c.json(await JadwalService.post(body), 201);
  }

  public static async put(c: Context) {
    const { id } = c.req.param();
    const body = await c.req.json();
    return c.json(await JadwalService.put(id, body));
  }
}