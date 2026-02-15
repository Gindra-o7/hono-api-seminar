// =============================================================================
// Centralized Exports
// =============================================================================

// Config
export { config, default as Config } from "./config";
export type { EnvConfig } from "./config";

// Container & DI
export { container, ServiceTokens, default as Container } from "./container";
export type { ServiceToken } from "./container";

// Infrastructure
export { prisma, database, getPrisma } from "./infrastructures/db.infrastructure";
export { transporter, mailService, getTransporter } from "./infrastructures/mail.infrastructure";

// Utils
export { logger, createLogger, LogLevel, default as Logger } from "./utils/logger.util";
export { APIError } from "./utils/api-error.util";

// Bootstrap
export { bootstrap, shutdown, getConfig, getLogger, getDatabase, getMailer } from "./bootstrap";

// Base Classes
export { BaseRepository } from "./repositories/base.repository";
export { BaseService } from "./services/base.service";

// Helpers
export { cryptoHelper, default as CryptoHelper } from "./helpers/crypto.helper";
