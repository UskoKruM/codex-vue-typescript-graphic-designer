export const PROJECT_STATUSES = ["not-started", "in-progress", "completed", "cancelled"] as const;

export const PROJECT_TYPES = [
    "advertising",
    "political-campaign",
    "invitation",
    "job-offer",
    "branding",
    "social-media",
    "editorial",
    "other"
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
export type ProjectType = (typeof PROJECT_TYPES)[number];

export interface Client {
    id: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    createdAt: string;
}

export interface Payment {
    id: string;
    label: string;
    amount: number;
    date: string;
    note: string;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    clientId: string;
    type: ProjectType;
    orderDate: string;
    deliveryDate: string;
    status: ProjectStatus;
    totalCost: number;
    payments: Payment[];
}

export interface Database {
    clients: Client[];
    projects: Project[];
}

export interface ProjectFilters {
    query: string;
    status: ProjectStatus | "all";
    type: ProjectType | "all";
    clientId: string;
}

export type ClientInput = Omit<Client, "id" | "createdAt">;
export type ProjectInput = Omit<Project, "id" | "payments">;
export type PaymentInput = Omit<Payment, "id">;
