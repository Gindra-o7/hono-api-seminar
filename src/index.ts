import { Hono } from "hono";
import { cors } from "hono/cors";
import { RegExpRouter } from "hono/router/reg-exp-router";
import { BlankEnv, BlankSchema } from "hono/types";
import { config } from "./config";
import { bootstrap, shutdown } from "./bootstrap";
import { createLogger } from "./utils/logger.util";
import GlobalHandler from "./handlers/global.handler";
import globalRoute from "./routes/global.route";
import LogMiddleware from "./middlewares/log.middleware";
import jadwalRoute from "./routes/jadwal.route";
import ruanganRoute from "./routes/ruangan.route";
import dosenRoute from "./routes/dosen.route";
import mahasiswaRoute from "./routes/mahasiswa.route";

const logger = createLogger("Server");

// Initialize DI Container
await bootstrap();

const app: Hono<BlankEnv, BlankSchema, "/"> = new Hono({
  router: new RegExpRouter(),
});

// CORS Configuration from config
app.use(
  "*",
  cors({
    origin: config.cors.origins.includes("*") ? "*" : config.cors.origins,
    credentials: config.cors.allowCredentials,
    allowMethods: config.cors.allowMethods as any,
    allowHeaders: config.cors.allowHeaders,
  }),
);

app.use("*", LogMiddleware.hanzLogger);

app.notFound(GlobalHandler.notFound);
app.onError(GlobalHandler.error);

app.route("/", globalRoute);
app.route("/", jadwalRoute);
app.route("/", ruanganRoute);
app.route("/", dosenRoute);
app.route("/", mahasiswaRoute);

// Graceful shutdown handlers
process.on("SIGINT", async () => {
  logger.info("Received SIGINT, shutting down gracefully...");
  await shutdown();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  logger.info("Received SIGTERM, shutting down gracefully...");
  await shutdown();
  process.exit(0);
});

const serverPort = config.server.port;

logger.info(`Server is running`, {
  port: serverPort,
  env: config.app.env,
  version: config.app.version,
  host: config.server.host,
});

export default {
  port: serverPort,
  fetch: app.fetch,
};
