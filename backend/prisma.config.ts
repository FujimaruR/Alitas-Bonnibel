// prisma.config.ts
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: "node prisma/seed.js",
  },
  datasource: {
    // Aquí va ahora la URL que antes estaba en el schema
    url: process.env.DATABASE_URL!,
  },
});
