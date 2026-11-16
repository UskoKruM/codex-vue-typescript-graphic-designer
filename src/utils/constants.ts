import type { ProjectStatus, ProjectType } from "@/types/domain";

export const STATUS_LABELS: Record<ProjectStatus, string> = {
    "not-started": "Por iniciar",
    "in-progress": "En progreso",
    completed: "Finalizado",
    cancelled: "Cancelado"
};

export const TYPE_LABELS: Record<ProjectType, string> = {
    advertising: "Anuncio publicitario",
    "political-campaign": "Campaña política",
    invitation: "Tarjeta de invitación",
    "job-offer": "Oferta laboral",
    branding: "Identidad de marca",
    "social-media": "Contenido para redes",
    editorial: "Diseño editorial",
    other: "Otro"
};

export const STATUS_STYLES: Record<ProjectStatus, string> = {
    "not-started": "status-waiting",
    "in-progress": "status-progress",
    completed: "status-completed",
    cancelled: "status-cancelled"
};

export const TYPE_COLORS: Record<ProjectType, string> = {
    advertising: "#7c5cff",
    "political-campaign": "#f36d52",
    invitation: "#ec6da5",
    "job-offer": "#44a7a0",
    branding: "#ff9e4f",
    "social-media": "#5b8def",
    editorial: "#8c69bd",
    other: "#7d8a98"
};
