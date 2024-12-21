import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  role: z.literal('user')
});

export const validateUserData = (data: unknown) => {
  return userSchema.safeParse(data);
};