import configs from "@configs/env.config";
import Redis, { RedisOptions } from "ioredis";

export type RedisCfg = {
  host: string;
  port: number;
  password?: string;
  db?: number;
};

export function createRedisService(cfg: RedisCfg) {
  let client: Redis | null = null;
  let connected = false;

  async function connect(): Promise<void> {
    if (connected && client) return;
    const options: RedisOptions = {
      host: cfg.host,
      port: cfg.port,
      password: cfg.password,
      db: cfg.db ?? 0,
      lazyConnect: true,
    };
    client = new Redis(options);
    await client.connect();
    connected = true;
  }

  async function health(): Promise<boolean> {
    try {
      if (!client) return false;
      const pong = await client.ping();
      return pong === "PONG";
    } catch {
      return false;
    }
  }

  async function close(): Promise<void> {
    if (!client) return;
    try {
      await client.quit();
    } catch {
      await client.disconnect();
    } finally {
      client = null;
      connected = false;
    }
  }

  async function get(key: string) {
    if (!client) throw new Error("Redis not connected");
    return client.get(key);
  }
  async function set(key: string, value: string, ttlSeconds?: number) {
    if (!client) throw new Error("Redis not connected");
    if (ttlSeconds && ttlSeconds > 0) {
      await client.set(key, value, "EX", ttlSeconds);
    } else {
      await client.set(key, value);
    }
  }
  async function del(key: string) {
    if (!client) throw new Error("Redis not connected");
    return client.del(key);
  }

  return {
    connect,
    health,
    close,
    get,
    set,
    del,
    isConnected: () => connected,
    getClient: () => client,
  };
}

const redis = createRedisService(configs.redis);

export { redis };
