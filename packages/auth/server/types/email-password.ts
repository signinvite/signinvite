import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';

export const ZCurrentPasswordSchema = z
  .string()
  .min(6, { message: 'Must be at least 6 characters in length' })
  .max(72);

const getAllowedEmails = async () => {
  const filePath = path.resolve(process.cwd(), '../../whitelistedEmails.json');
  // console.log(filePath, '====file====');
  try {
    await fs.access(filePath);
  } catch (err) {
    await fs.writeFile(filePath, JSON.stringify([], null, 2), 'utf-8');
  }

  const data = await fs.readFile(filePath, 'utf-8');
  let json: { email: string; timestamp: number }[] | null | undefined = JSON.parse(data);

  if (!json) {
    json = [];
  }
  if (!Array.isArray(json)) {
    json = [json];
  }

  const allowed_emails = json.map((d) => d.email);
  // console.log(allowed_emails, '=== allowed_emails ===');
  return allowed_emails;
};

export const ZSignInSchema = z.object({
  email: z
    .string()
    .email()
    .min(1)
    .refine(
      async (val) => {
        const allowedDomains = getAllowedEmails();
        return (await allowedDomains).some((domain) => val.toLowerCase().includes(domain));
      },
      { message: 'Email Must be belong to this Organization!' },
    ),
  password: ZCurrentPasswordSchema,
  totpCode: z.string().trim().optional(),
  backupCode: z.string().trim().optional(),
  csrfToken: z.string().trim(),
});

export type TSignInSchema = z.infer<typeof ZSignInSchema>;

export const ZPasswordSchema = z
  .string()
  .min(8, { message: 'Must be at least 8 characters in length' })
  .max(72, { message: 'Cannot be more than 72 characters in length' })
  .refine((value) => value.length > 25 || /[A-Z]/.test(value), {
    message: 'One uppercase character',
  })
  .refine((value) => value.length > 25 || /[a-z]/.test(value), {
    message: 'One lowercase character',
  })
  .refine((value) => value.length > 25 || /\d/.test(value), {
    message: 'One number',
  })
  .refine((value) => value.length > 25 || /[`~<>?,./!@#$%^&*()\-_"'+=|{}[\];:\\]/.test(value), {
    message: 'One special character is required',
  });

export const ZSignUpSchema = z.object({
  name: z.string().min(1),
  email: z
    .string()
    .email()
    .refine(
      async (val) => {
        const allowedDomains = getAllowedEmails();
        return (await allowedDomains).some((domain) => val.toLowerCase().includes(domain));
      },
      { message: 'Email Must be belong to this Organization!' },
    ),
  password: ZPasswordSchema,
  signature: z.string().nullish(),
  url: z
    .string()
    .trim()
    .toLowerCase()
    .min(1)
    .regex(/^[a-z0-9-]+$/, {
      message: 'Username can only container alphanumeric characters and dashes.',
    })
    .optional(),
});

export type TSignUpSchema = z.infer<typeof ZSignUpSchema>;

export const ZForgotPasswordSchema = z.object({
  email: z.string().email().min(1),
});

export type TForgotPasswordSchema = z.infer<typeof ZForgotPasswordSchema>;

export const ZResetPasswordSchema = z.object({
  password: ZPasswordSchema,
  token: z.string().min(1),
});

export type TResetPasswordSchema = z.infer<typeof ZResetPasswordSchema>;

export const ZVerifyEmailSchema = z.object({
  token: z.string().min(1),
});

export type TVerifyEmailSchema = z.infer<typeof ZVerifyEmailSchema>;

export const ZResendVerifyEmailSchema = z.object({
  email: z.string().email().min(1),
});

export type TResendVerifyEmailSchema = z.infer<typeof ZResendVerifyEmailSchema>;

export const ZUpdatePasswordSchema = z.object({
  currentPassword: ZCurrentPasswordSchema,
  password: ZPasswordSchema,
});

export type TUpdatePasswordSchema = z.infer<typeof ZUpdatePasswordSchema>;
