import configs from "@configs/env.config";
import { Sequelize } from "sequelize-typescript";

export type SequelizeCfg = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl?: boolean;
};

export function createSequelizeService(cfg: SequelizeCfg) {
  let sequelize: Sequelize | null = null;
  let connected = false;

  async function connect(models: any[] = []): Promise<void> {
    if (connected && sequelize) return;

    sequelize = new Sequelize({
      dialect: "postgres",
      host: cfg.host,
      port: cfg.port,
      username: cfg.username,
      password: cfg.password,
      database: cfg.database,
      logging: false,
      dialectOptions: cfg.ssl
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : undefined,
      models, // array of model classes
      pool: { max: 10, min: 0, idle: 30_000 },
    });

    await sequelize.authenticate();
    connected = true;
  }

  async function health(): Promise<boolean> {
    try {
      if (!sequelize) return false;
      await sequelize.query("SELECT 1");
      return true;
    } catch {
      return false;
    }
  }

  async function close(): Promise<void> {
    if (sequelize) {
      await sequelize.close();
      sequelize = null;
      connected = false;
    }
  }

  async function sync(opts: { force?: boolean; alter?: boolean } = {}) {
    if (!sequelize) throw new Error("Sequelize not connected");
    return sequelize.sync(opts);
  }

  const get = () => {
    if (!sequelize) throw new Error("Sequelize not connected");
    return sequelize;
  };

  return { connect, health, close, sync, get, isConnected: () => connected };
}

const db = createSequelizeService(configs.db);

export { db };
