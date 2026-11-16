import { describe, expect, it } from "vitest";
import { paymentInputSchema, projectInputSchema } from "@/schemas/project.schema";

const validProject = {
    clientId: "ee618260-1c65-4e20-bc08-985d965ced9d",
    deliveryDate: "2026-12-20",
    description: "Diseño integral para lanzamiento de campaña.",
    orderDate: "2026-11-02",
    status: "not-started" as const,
    title: "Campaña verano",
    totalCost: 2500,
    type: "advertising" as const
};

describe("projectInputSchema", () => {
    it("valida las fechas y el presupuesto", () => {
        expect(projectInputSchema.safeParse(validProject).success).toBe(true);
    });

    it("no permite una entrega anterior al pedido", () => {
        const result = projectInputSchema.safeParse({ ...validProject, deliveryDate: "2026-10-20" });

        expect(result.success).toBe(false);
        const errors = result.success ? {} : result.error.flatten().fieldErrors;
        expect(errors.deliveryDate?.[0]).toContain("anterior");
    });
});

describe("paymentInputSchema", () => {
    it("exige un pago positivo", () => {
        const result = paymentInputSchema.safeParse({ amount: 0, date: "2026-11-02", label: "Inicial", note: "" });

        expect(result.success).toBe(false);
    });
});
