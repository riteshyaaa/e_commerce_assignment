import { prisma } from '../config/prisma';

export class NewsletterService {
  static async subscribe(email: string) {
    const normalizedEmail = email.toLowerCase().trim();

    // Check if subscriber already exists
    const existing = await (prisma as any).newsletter.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return {
        alreadySubscribed: true,
        message: 'You are already subscribed to the NOVA Journal.',
      };
    }

    const subscriber = await (prisma as any).newsletter.create({
      data: {
        email: normalizedEmail,
      },
    });

    return {
      alreadySubscribed: false,
      subscriber,
      message: 'Successfully subscribed to the NOVA Journal.',
    };
  }

  static async getSubscribers() {
    return (prisma as any).newsletter.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
