// prisma.config.ts
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: "ts-node ./prisma/seed.ts",
  },
  datasource: {
    // Aquí va ahora la URL que antes estaba en el schema
    url: env('DATABASE_URL'),
  },
});
