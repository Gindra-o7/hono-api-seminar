import { Context } from "hono";
import RuanganService from "../services/ruangan.service";
import { PostRuanganType } from "../types/ruangan.type";

export default class RuanganHandler {
  public static async getAll(c: Context) {
    return c.json(await RuanganService.getAll());
  }

  public static async get(c: Context) {
    const { nama } = c.req.param();
    return c.json(await RuanganService.get(nama));
  }

  public static async post(c: Context) {
    const body: PostRuanganType = await c.req.json();
    return c.json(await RuanganService.post(body), 201);
  }

  public static async put(c: Context) {
    const { nama } = c.req.param();
    const body: PostRuanganType = await c.req.json();
    return c.json(await RuanganService.put(nama, body));
  }

  public static async delete(c: Context) {
    const { nama } = c.req.param();
    return c.json(await RuanganService.delete(nama));
  }
}