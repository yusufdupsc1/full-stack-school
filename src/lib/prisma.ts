import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL ?? "file:./prisma/dev.db";

const prismaClientSingleton = () => {
  try {
    const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
    return new PrismaClient({ adapter });
  } catch (err) {
    const original = err instanceof Error ? err.message : String(err);
    const hint =
      "SQLite native binding failed to load. Use Node 18/20/22 LTS and reinstall dependencies so better-sqlite3 can build for your runtime.";
    throw new Error(`${hint} Original error: ${original}`);
  }
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
