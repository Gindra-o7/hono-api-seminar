import { Hono } from "hono";
import { RegExpRouter } from "hono/router/reg-exp-router";
import { zValidator } from "@hono/zod-validator";
import { zodError } from "../utils/zod-error.util";
import { postRuanganSchema } from "../validators/ruangan.validator";
import RuanganHandler from "../handlers/ruangan.handler";
import AuthMiddleware from "../middlewares/auth.middleware";

const ruanganRoute = new Hono({ router: new RegExpRouter() });

ruanganRoute.use("/ruangan/*", AuthMiddleware.JWTBearerTokenExtraction);

ruanganRoute.get("/ruangan", RuanganHandler.getAll);
ruanganRoute.get("/ruangan/:nama", RuanganHandler.get);
ruanganRoute.post("/ruangan", zValidator("json", postRuanganSchema, zodError), RuanganHandler.post);
ruanganRoute.put("/ruangan/:nama", zValidator("json", postRuanganSchema, zodError), RuanganHandler.put);
ruanganRoute.delete("/ruangan/:nama", RuanganHandler.delete);

export default ruanganRoute;