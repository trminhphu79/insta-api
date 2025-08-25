import 'dotenv/config';

function readEnv<T extends unknown>(name: string): T {
    const v = process.env[name];
    if (!v || v.trim() === '') throw new Error(`Missing required env: ${name}`);
    return v as T;
}

const configs = {
    app: {
        port: Number(process.env.APP_PORT ?? 3000),
        nodeEnv: process.env.NODE_ENV ?? 'development',
    },
    db: {
        host: readEnv<string>('DB_HOST'),
        port: readEnv<number>('DB_PORT'),
        username: readEnv<string>('DB_USERNAME'),
        password: readEnv<string>('DB_PASSWORD'),
        database: readEnv<string>('DB_NAME'),
        ssl: (process.env.DB_SSL ?? 'false').toLowerCase() === 'true'
    },
    redis: {
        host: readEnv<string>('REDIS_HOST'),
        port: readEnv<number>('REDIS_PORT'),
        password: readEnv<string>('REDIS_PASSWORD'),
        db: Number(process.env.REDIS_DB ?? 0)
    }
};

export default configs