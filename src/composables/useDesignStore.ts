import { computed, reactive, readonly, watch } from "vue";
import { databaseSchema } from "@/schemas/database.schema";
import { clientInputSchema } from "@/schemas/client.schema";
import { paymentInputSchema, projectInputSchema } from "@/schemas/project.schema";
import type { ClientInput, Database, PaymentInput, ProjectFilters, ProjectInput, ProjectStatus } from "@/types/domain";
import { createId } from "@/utils/id";
import { getPaidAmount } from "@/utils/projects";

export const STORAGE_KEY = "atelier-design-manager-v1";

function createSeedData(): Database {
    return {
        clients: [
            {
                company: "Luma Café",
                createdAt: "2026-08-12T14:30:00.000Z",
                email: "hola@lumacafe.pe",
                id: "ee618260-1c65-4e20-bc08-985d965ced9d",
                name: "Valeria Rojas",
                phone: "+51 987 456 120"
            },
            {
                company: "Cívica Norte",
                createdAt: "2026-09-03T10:10:00.000Z",
                email: "equipo@civicanorte.pe",
                id: "515e5a1a-6c23-4999-a2cb-449a2a3bd865",
                name: "Mateo Salazar",
                phone: "+51 921 334 890"
            },
            {
                company: "Nativa Studio",
                createdAt: "2026-09-17T18:20:00.000Z",
                email: "ana@nativastudio.pe",
                id: "770bb2cc-31df-484b-876a-8abb69498202",
                name: "Ana Torres",
                phone: "+51 955 070 842"
            },
            {
                company: "Casa Olivo",
                createdAt: "2026-10-02T09:15:00.000Z",
                email: "eventos@casaolivo.pe",
                id: "6159e11b-c28d-4b57-ae7d-a23cccebf179",
                name: "Lucía Paredes",
                phone: "+51 906 118 337"
            }
        ],
        projects: [
            {
                clientId: "ee618260-1c65-4e20-bc08-985d965ced9d",
                deliveryDate: "2026-11-14",
                description: "Sistema visual y piezas de lanzamiento para la nueva carta de temporada.",
                id: "5e170f89-70c0-44bb-955c-88dc447d0969",
                orderDate: "2026-10-18",
                payments: [
                    {
                        amount: 1200,
                        date: "2026-10-18",
                        id: "98cd4473-9909-4581-8039-dfb50f4285c0",
                        label: "Adelanto 40%",
                        note: "Reserva de agenda"
                    }
                ],
                status: "in-progress",
                title: "Campaña Luma Invierno",
                totalCost: 3000,
                type: "advertising"
            },
            {
                clientId: "515e5a1a-6c23-4999-a2cb-449a2a3bd865",
                deliveryDate: "2026-11-22",
                description: "Kit de campaña con afiches, línea gráfica y adaptaciones para redes sociales.",
                id: "24010370-22b2-4511-8cc6-1045253599e9",
                orderDate: "2026-10-25",
                payments: [
                    {
                        amount: 1800,
                        date: "2026-10-25",
                        id: "9b2e7438-1b89-410f-86e7-15db9bb6dbbf",
                        label: "Pago inicial",
                        note: "Inicio de investigación"
                    },
                    {
                        amount: 1200,
                        date: "2026-11-01",
                        id: "49006230-2bb7-4ef8-bcc5-2b0bb19e2977",
                        label: "Segundo avance",
                        note: "Concepto aprobado"
                    }
                ],
                status: "in-progress",
                title: "Identidad Cívica 2027",
                totalCost: 6000,
                type: "political-campaign"
            },
            {
                clientId: "770bb2cc-31df-484b-876a-8abb69498202",
                deliveryDate: "2026-10-30",
                description: "Rediseño de identidad, manual breve y plantillas para presentaciones.",
                id: "1f358523-c073-4a89-bbb3-7a4220e3bc65",
                orderDate: "2026-09-26",
                payments: [
                    {
                        amount: 1600,
                        date: "2026-09-26",
                        id: "0f3b9ddf-b518-479a-a0b9-4bb3e61e4679",
                        label: "Pago inicial",
                        note: ""
                    },
                    {
                        amount: 1600,
                        date: "2026-10-15",
                        id: "cf7eaecf-f0b9-4808-b046-1eedad631426",
                        label: "Pago intermedio",
                        note: "Ruta visual aprobada"
                    },
                    {
                        amount: 800,
                        date: "2026-10-30",
                        id: "a702beaf-efb1-447b-a122-b44bc752b0c0",
                        label: "Pago final",
                        note: "Entrega de archivos"
                    }
                ],
                status: "completed",
                title: "Rebranding Nativa",
                totalCost: 4000,
                type: "branding"
            },
            {
                clientId: "6159e11b-c28d-4b57-ae7d-a23cccebf179",
                deliveryDate: "2026-11-08",
                description: "Invitación digital animada y versión lista para impresión.",
                id: "6de9f9a6-1832-4e7c-85bc-dd2950bc855d",
                orderDate: "2026-10-29",
                payments: [],
                status: "not-started",
                title: "Boda Jardín de Olivos",
                totalCost: 850,
                type: "invitation"
            },
            {
                clientId: "ee618260-1c65-4e20-bc08-985d965ced9d",
                deliveryDate: "2026-10-12",
                description: "Paquete mensual de piezas para historias y publicaciones.",
                id: "226c01fe-a7db-4479-9a80-2b20a2956fca",
                orderDate: "2026-10-01",
                payments: [
                    {
                        amount: 450,
                        date: "2026-10-01",
                        id: "a4ed519f-1c2d-4a12-8b6c-4d49c56f104b",
                        label: "Adelanto",
                        note: "No reembolsable"
                    }
                ],
                status: "cancelled",
                title: "Contenido social octubre",
                totalCost: 1200,
                type: "social-media"
            }
        ]
    };
}

function loadDatabase(): Database {
    if (typeof window === "undefined") {
        return createSeedData();
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        return createSeedData();
    }

    try {
        return databaseSchema.parse(JSON.parse(stored));
    } catch (_error) {
        return createSeedData();
    }
}

const state = reactive<Database>(loadDatabase());

if (typeof window !== "undefined") {
    watch(
        state,
        (database) => {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
        },
        { deep: true, immediate: true }
    );
}

export function useDesignStore() {
    const clients = computed(() => [...state.clients].sort((a, b) => a.name.localeCompare(b.name)));
    const projects = computed(() => [...state.projects].sort((a, b) => b.orderDate.localeCompare(a.orderDate)));
    const totalCollected = computed(() => state.projects.reduce((total, project) => total + getPaidAmount(project.payments), 0));
    const totalPending = computed(() =>
        state.projects.reduce((total, project) => {
            if (project.status === "cancelled") {
                return total;
            }
            return total + Math.max(project.totalCost - getPaidAmount(project.payments), 0);
        }, 0)
    );

    function addClient(input: ClientInput): string {
        const parsed = clientInputSchema.parse(input);
        const id = createId();
        state.clients.push({ ...parsed, createdAt: new Date().toISOString(), id });
        return id;
    }

    function updateClient(id: string, input: ClientInput): void {
        const index = state.clients.findIndex((client) => client.id === id);
        if (index < 0) {
            return;
        }
        const current = state.clients[index];
        if (!current) {
            return;
        }
        state.clients[index] = { ...current, ...clientInputSchema.parse(input) };
    }

    function deleteClient(id: string): boolean {
        if (state.projects.some((project) => project.clientId === id)) {
            return false;
        }
        state.clients = state.clients.filter((client) => client.id !== id);
        return true;
    }

    function addProject(input: ProjectInput): string {
        const parsed = projectInputSchema.parse(input);
        const id = createId();
        state.projects.push({ ...parsed, id, payments: [] });
        return id;
    }

    function updateProject(id: string, input: ProjectInput): void {
        const index = state.projects.findIndex((project) => project.id === id);
        if (index < 0) {
            return;
        }
        const current = state.projects[index];
        if (!current) {
            return;
        }
        state.projects[index] = { ...current, ...projectInputSchema.parse(input) };
    }

    function deleteProject(id: string): void {
        state.projects = state.projects.filter((project) => project.id !== id);
    }

    function changeProjectStatus(id: string, status: ProjectStatus): void {
        const project = state.projects.find((candidate) => candidate.id === id);
        if (project) {
            project.status = status;
        }
    }

    function addPayment(projectId: string, input: PaymentInput): void {
        const project = state.projects.find((candidate) => candidate.id === projectId);
        if (!project) {
            return;
        }
        const parsed = paymentInputSchema.parse(input);
        project.payments.push({ ...parsed, id: createId() });
    }

    function removePayment(projectId: string, paymentId: string): void {
        const project = state.projects.find((candidate) => candidate.id === projectId);
        if (project) {
            project.payments = project.payments.filter((payment) => payment.id !== paymentId);
        }
    }

    function getClientName(clientId: string): string {
        return state.clients.find((client) => client.id === clientId)?.name ?? "Cliente eliminado";
    }

    function filterProjects(filters: ProjectFilters) {
        const normalizedQuery = filters.query.trim().toLocaleLowerCase("es");
        return projects.value.filter((project) => {
            const matchesQuery =
                !normalizedQuery ||
                project.title.toLocaleLowerCase("es").includes(normalizedQuery) ||
                project.description.toLocaleLowerCase("es").includes(normalizedQuery) ||
                getClientName(project.clientId).toLocaleLowerCase("es").includes(normalizedQuery);
            return (
                matchesQuery &&
                (filters.status === "all" || project.status === filters.status) &&
                (filters.type === "all" || project.type === filters.type) &&
                (filters.clientId === "all" || project.clientId === filters.clientId)
            );
        });
    }

    return {
        addClient,
        addPayment,
        addProject,
        changeProjectStatus,
        clients,
        deleteClient,
        deleteProject,
        filterProjects,
        getClientName,
        projects,
        removePayment,
        state: readonly(state),
        totalCollected,
        totalPending,
        updateClient,
        updateProject
    };
}
