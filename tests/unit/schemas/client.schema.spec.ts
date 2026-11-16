import { describe, expect, it } from "vitest";
import { clientInputSchema } from "@/schemas/client.schema";

describe("clientInputSchema", () => {
    it("acepta un cliente válido", () => {
        const result = clientInputSchema.safeParse({
            company: "Taller Norte",
            email: "hola@tallernorte.pe",
            name: "María Vega",
            phone: "+51 999 123 456"
        });

        expect(result.success).toBe(true);
    });

    it("rechaza correos inválidos y nombres demasiado cortos", () => {
        const result = clientInputSchema.safeParse({ company: "", email: "correo-invalido", name: "M", phone: "123" });

        expect(result.success).toBe(false);
        const errors = result.success ? {} : result.error.flatten().fieldErrors;
        expect(errors.email?.[0]).toBe("Ingresa un correo válido.");
        expect(errors.name?.[0]).toContain("al menos 2");
    });
});
