import { createApp } from './app';
import { env } from './config/env';
import { prisma } from './config/prisma';
import { AuthService } from './services/auth.service';

const app = createApp();

async function bootstrap() {
  try {
    console.log(`[STARTUP] Connecting to database...`);
    await prisma.$connect();
    console.log(`[DATABASE] Successfully connected to database.`);

    // Ensure default admin account exists
    try {
      await AuthService.ensureDefaultAdmin();
    } catch (adminErr) {
      console.warn(`[AUTH] Notice: Admin seeding skipped or database empty. Run prisma db push/seed.`);
    }

    const server = app.listen(env.PORT, () => {
      console.log(`==================================================`);
      console.log(`🚀 NOVA Modern Essentials Server is running!`);
      console.log(`📡 URL: http://localhost:${env.PORT}`);
      console.log(`📖 Swagger API Docs: http://localhost:${env.PORT}/docs`);
      console.log(`🩺 Health check: http://localhost:${env.PORT}/api/health`);
      console.log(`==================================================`);
    });

    // Graceful shutdown handling
    const shutdown = async (signal: string) => {
      console.log(`[SHUTDOWN] Received ${signal}. Closing server gracefully...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log(`[DATABASE] Disconnected. Process exiting.`);
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error(`[FATAL] Failed to start server:`, error);
    process.exit(1);
  }
}

bootstrap();
