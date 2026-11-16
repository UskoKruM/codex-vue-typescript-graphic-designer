import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ClientInput, ProjectInput } from "@/types/domain";

const clientInput: ClientInput = {
    company: "Estudio Prisma",
    email: "hola@prisma.pe",
    name: "Daniela Ruiz",
    phone: "+51 999 111 222"
};

async function createFreshStore() {
    vi.resetModules();
    localStorage.clear();
    const { useDesignStore } = await import("@/composables/useDesignStore");
    return useDesignStore();
}

describe("useDesignStore", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("carga datos demostrativos y los persiste", async () => {
        const store = await createFreshStore();

        expect(store.clients.value).toHaveLength(4);
        expect(store.projects.value).toHaveLength(5);
        expect(localStorage.getItem("atelier-design-manager-v1")).not.toBeNull();
    });

    it("crea, actualiza y elimina un cliente sin proyectos", async () => {
        const store = await createFreshStore();
        const id = store.addClient(clientInput);

        expect(store.clients.value.find((client) => client.id === id)?.name).toBe("Daniela Ruiz");

        store.updateClient(id, { ...clientInput, name: "Daniela Ruiz Vega" });
        expect(store.clients.value.find((client) => client.id === id)?.name).toBe("Daniela Ruiz Vega");

        expect(store.deleteClient(id)).toBe(true);
        expect(store.clients.value.some((client) => client.id === id)).toBe(false);
    });

    it("protege clientes que tienen proyectos vinculados", async () => {
        const store = await createFreshStore();
        const client = store.clients.value[0]!;

        expect(store.projects.value.some((project) => project.clientId === client.id)).toBe(true);
        expect(store.deleteClient(client.id)).toBe(false);
        expect(store.clients.value.some((candidate) => candidate.id === client.id)).toBe(true);
    });

    it("administra proyecto, estado, pagos y saldos", async () => {
        const store = await createFreshStore();
        const projectInput: ProjectInput = {
            clientId: store.clients.value[0]!.id,
            deliveryDate: "2026-12-20",
            description: "Piezas gráficas para una campaña de temporada.",
            orderDate: "2026-11-02",
            status: "not-started",
            title: "Campaña Prisma",
            totalCost: 2000,
            type: "advertising"
        };
        const initialCollected = store.totalCollected.value;
        const id = store.addProject(projectInput);

        store.changeProjectStatus(id, "in-progress");
        store.addPayment(id, { amount: 600, date: "2026-11-03", label: "Adelanto", note: "Reserva" });

        const project = store.projects.value.find((candidate) => candidate.id === id)!;
        expect(project.status).toBe("in-progress");
        expect(project.payments).toHaveLength(1);
        expect(store.totalCollected.value).toBe(initialCollected + 600);

        store.removePayment(id, project.payments[0]!.id);
        expect(project.payments).toHaveLength(0);

        store.deleteProject(id);
        expect(store.projects.value.some((candidate) => candidate.id === id)).toBe(false);
    });

    it("filtra por búsqueda, estado, tipo y cliente", async () => {
        const store = await createFreshStore();
        const brandingProject = store.projects.value.find((project) => project.type === "branding")!;

        const result = store.filterProjects({
            clientId: brandingProject.clientId,
            query: "Nativa",
            status: "completed",
            type: "branding"
        });

        expect(result).toHaveLength(1);
        expect(result[0]?.title).toBe("Rebranding Nativa");
    });
});
