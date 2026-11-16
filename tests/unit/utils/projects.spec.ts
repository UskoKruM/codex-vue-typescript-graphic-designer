import { describe, expect, it } from "vitest";
import type { Project } from "@/types/domain";
import { getPaidAmount, getPaymentProgress, getProjectBalance, isOverdue } from "@/utils/projects";

const project: Project = {
    clientId: "ee618260-1c65-4e20-bc08-985d965ced9d",
    deliveryDate: "2026-10-01",
    description: "Descripción suficiente para el proyecto.",
    id: "5e170f89-70c0-44bb-955c-88dc447d0969",
    orderDate: "2026-09-01",
    payments: [
        { amount: 300, date: "2026-09-01", id: "98cd4473-9909-4581-8039-dfb50f4285c0", label: "Inicial", note: "" },
        { amount: 200, date: "2026-09-15", id: "49006230-2bb7-4ef8-bcc5-2b0bb19e2977", label: "Avance", note: "" }
    ],
    status: "in-progress",
    title: "Proyecto de prueba",
    totalCost: 1000,
    type: "branding"
};

describe("project financial helpers", () => {
    it("calcula pagos, saldo y avance", () => {
        expect(getPaidAmount(project.payments)).toBe(500);
        expect(getProjectBalance(project)).toBe(500);
        expect(getPaymentProgress(project)).toBe(50);
    });

    it("limita el avance a 100% cuando hay sobrepago", () => {
        const overpaid = { ...project, payments: [{ ...project.payments[0]!, amount: 1200 }] };
        expect(getPaymentProgress(overpaid)).toBe(100);
        expect(getProjectBalance(overpaid)).toBe(0);
    });

    it("marca vencidos solo los proyectos activos", () => {
        expect(isOverdue(project, new Date("2026-11-02T12:00:00"))).toBe(true);
        expect(isOverdue({ ...project, status: "cancelled" }, new Date("2026-11-02T12:00:00"))).toBe(false);
    });
});
