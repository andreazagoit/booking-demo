import { z } from "zod"

export const signInSchema = z.object({
  email: z.string().email("Inserisci un'email valida"),
  password: z.string().min(8, "La password deve essere di almeno 8 caratteri"),
})

export const signUpSchema = z.object({
  email: z.string().email("Inserisci un'email valida"),
  password: z.string().min(8, "La password deve essere di almeno 8 caratteri"),
  name: z.string().min(1, "Inserisci il tuo nome"),
})

export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
