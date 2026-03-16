import { z } from "zod"

export const createBookingSchema = z
  .object({
    propertyId: z.string().min(1),
    checkIn:    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato data non valido (YYYY-MM-DD)"),
    checkOut:   z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato data non valido (YYYY-MM-DD)"),
  })
  .refine((d) => d.checkOut >= d.checkIn, {
    message: "La data di check-out non può essere prima del check-in",
    path: ["checkOut"],
  })

export type CreateBookingInput = z.infer<typeof createBookingSchema>
