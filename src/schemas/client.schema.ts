import { z } from "zod";

export const clientInputSchema = z.object({
    company: z.string().trim().max(100, "La empresa no puede superar 100 caracteres."),
    email: z.email("Ingresa un correo válido."),
    name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres.").max(80),
    phone: z.string().trim().min(6, "Ingresa un teléfono válido.").max(24)
});

export const clientSchema = clientInputSchema.extend({
    createdAt: z.iso.datetime(),
    id: z.uuid()
});
