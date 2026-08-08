import dotenv from 'dotenv';
import path from 'path';
import { defineConfig, env } from 'prisma/config';

// Resolve .env from either backend/ or root zero-delala/
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL')
  }
});
