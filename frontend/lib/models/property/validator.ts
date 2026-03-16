import { z } from "zod"

export const createPropertySchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio"),
  description: z.string().optional(),
  location: z.string().optional(),
  imageUrl: z.string().url("URL non valido").optional().or(z.literal("")),
  pricePerNight: z.number().positive("Il prezzo deve essere positivo").optional(),
})

export type CreatePropertyInput = z.infer<typeof createPropertySchema>
