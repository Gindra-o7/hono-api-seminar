import { Hono } from "hono";
import { RegExpRouter } from "hono/router/reg-exp-router";
import { zodError } from "../utils/zod-error.util";
import { zValidator } from "@hono/zod-validator";
import JadwalHandler from "../handlers/jadwal.handler";
import AuthMiddleware from "../middlewares/auth.middleware";
import { postJadwalSchema } from "../validators/jadwal.validator";

const jadwalRoute = new Hono({ router: new RegExpRouter() });

jadwalRoute.use("/jadwal/*", AuthMiddleware.JWTBearerTokenExtraction);

jadwalRoute.get("/me/jadwal", JadwalHandler.getMe);
jadwalRoute.get("/jadwal", JadwalHandler.getAll);
jadwalRoute.get("/jadwal/:id", JadwalHandler.get);
jadwalRoute.post("/jadwal", zValidator("json", postJadwalSchema, zodError), JadwalHandler.post);
jadwalRoute.put("/jadwal/:id", zValidator("json", postJadwalSchema, zodError), JadwalHandler.put);

export default jadwalRoute;
