import { z } from 'zod';

export const subscribeNewsletterSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please provide a valid email address')
    .max(100, 'Email must not exceed 100 characters')
    .toLowerCase()
    .trim(),
});

export type SubscribeNewsletterInput = z.infer<typeof subscribeNewsletterSchema>;
