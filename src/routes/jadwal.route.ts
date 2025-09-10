import { Hono } from "hono";
import { RegExpRouter } from "hono/router/reg-exp-router";
import { zodError } from "../utils/zod-error.util";
import { zValidator } from "@hono/zod-validator";
import JadwalHandler from "../handlers/jadwal.handler";
import AuthMiddleware from "../middlewares/auth.middleware";
import { postPutJadwalSchema } from "../validators/jadwal.validator";

const jadwalRoute = new Hono({ router: new RegExpRouter() });

jadwalRoute.use("/jadwal*", AuthMiddleware.JWTBearerTokenExtraction);

jadwalRoute.get("/jadwal-saya", JadwalHandler.getMe);
jadwalRoute.get("/jadwal", JadwalHandler.getAll);
jadwalRoute.get("/jadwal/:id", JadwalHandler.get);
jadwalRoute.post("/jadwal", zValidator("json", postPutJadwalSchema, zodError), JadwalHandler.post);
jadwalRoute.put("/jadwal/:id", zValidator("json", postPutJadwalSchema, zodError), JadwalHandler.put);

export default jadwalRoute;
