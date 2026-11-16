import { z } from "zod";
import { PROJECT_STATUSES, PROJECT_TYPES } from "@/types/domain";

export const paymentInputSchema = z.object({
    amount: z.number().positive("El monto debe ser mayor a cero."),
    date: z.iso.date("Ingresa una fecha válida."),
    label: z.string().trim().min(2, "Describe la etapa del pago.").max(50),
    note: z.string().trim().max(180)
});

export const paymentSchema = paymentInputSchema.extend({
    id: z.uuid()
});

export const projectInputSchema = z
    .object({
        clientId: z.uuid("Selecciona un cliente."),
        deliveryDate: z.iso.date("Ingresa una fecha válida."),
        description: z.string().trim().min(8, "Añade una descripción de al menos 8 caracteres.").max(240),
        orderDate: z.iso.date("Ingresa una fecha válida."),
        status: z.enum(PROJECT_STATUSES),
        title: z.string().trim().min(3, "El título debe tener al menos 3 caracteres.").max(100),
        totalCost: z.number().positive("El costo debe ser mayor a cero."),
        type: z.enum(PROJECT_TYPES)
    })
    .refine((project) => project.deliveryDate >= project.orderDate, {
        message: "La entrega no puede ser anterior al pedido.",
        path: ["deliveryDate"]
    });

export const projectSchema = projectInputSchema.extend({
    id: z.uuid(),
    payments: z.array(paymentSchema)
});
