import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { ApiError } from '../utils/apiError';
import { signAdminToken } from '../utils/jwt';
import { LoginInput } from '../validators/auth.validator';

export class AuthService {
  static async login(input: LoginInput) {
    const admin = await prisma.admin.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (!admin) {
      throw ApiError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const isPasswordValid = await bcrypt.compare(input.password, admin.passwordHash);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const payload = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };

    const token = signAdminToken(payload);

    return {
      admin: payload,
      token,
    };
  }

  static async getMe(adminId: string) {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!admin) {
      throw ApiError.notFound('Admin profile not found', 'ADMIN_NOT_FOUND');
    }

    return admin;
  }

  static async ensureDefaultAdmin() {
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: env.ADMIN_EMAIL.toLowerCase() },
    });

    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 10);
      await prisma.admin.create({
        data: {
          name: env.ADMIN_NAME,
          email: env.ADMIN_EMAIL.toLowerCase(),
          passwordHash,
          role: 'ADMIN',
        },
      });
      console.log(`[AUTH] Seeded default administrator: ${env.ADMIN_EMAIL}`);
    }
  }
}
