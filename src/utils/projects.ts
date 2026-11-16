import type { Payment, Project } from "@/types/domain";

export function getPaidAmount(payments: Payment[]): number {
    return payments.reduce((total, payment) => total + payment.amount, 0);
}

export function getProjectBalance(project: Project): number {
    return Math.max(project.totalCost - getPaidAmount(project.payments), 0);
}

export function getPaymentProgress(project: Project): number {
    if (project.totalCost <= 0) {
        return 0;
    }

    return Math.min(Math.round((getPaidAmount(project.payments) / project.totalCost) * 100), 100);
}

export function isOverdue(project: Project, today = new Date()): boolean {
    if (project.status === "completed" || project.status === "cancelled") {
        return false;
    }

    const delivery = new Date(`${project.deliveryDate}T23:59:59`);
    return delivery.getTime() < today.getTime();
}
