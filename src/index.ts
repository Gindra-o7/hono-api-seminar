import { Hono } from "hono";
import { cors } from "hono/cors";
import { RegExpRouter } from "hono/router/reg-exp-router";
import { BlankEnv, BlankSchema } from "hono/types";
import GlobalHandler from "./handlers/global.handler";
import globalRoute from "./routes/global.route";
import LogMiddleware from "./middlewares/log.middleware";
import jadwalRoute from "./routes/jadwal.route";
import tahunAjaranRoute from "./routes/tahun-ajaran.route";
import ruanganRoute from "./routes/ruangan.route";
import dosenRoute from "./routes/dosen.route";
import mahasiswaRoute from "./routes/mahasiswa.route";

const app: Hono<BlankEnv, BlankSchema, "/"> = new Hono({
  router: new RegExpRouter(),
});
const { APP_PORT }: NodeJS.ProcessEnv = process.env;

app.use("*",cors({origin: "*",}));

app.use("*", LogMiddleware.hanzLogger);

app.notFound(GlobalHandler.notFound);
app.onError(GlobalHandler.error);

app.route("/", globalRoute);
app.route("/", jadwalRoute);
app.route("/", tahunAjaranRoute);
app.route("/", ruanganRoute);
app.route("/", dosenRoute);
app.route("/", mahasiswaRoute);

export default {
  port: APP_PORT || 5000,
  fetch: app.fetch,
};

console.log(`[INFO] Server is on fire at port ${APP_PORT}! 🔥`);
