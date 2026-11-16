<script setup lang="ts">
import type { Project, ProjectStatus } from "@/types/domain";
import { STATUS_LABELS, STATUS_STYLES, TYPE_LABELS } from "@/utils/constants";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { getPaidAmount, getPaymentProgress, isOverdue } from "@/utils/projects";

const props = defineProps<{
    clientName: string;
    project: Project;
}>();

const emit = defineEmits<{
    edit: [project: Project];
    open: [project: Project];
    status: [id: string, status: ProjectStatus];
}>();

function changeStatus(event: Event): void {
    emit("status", props.project.id, (event.target as HTMLSelectElement).value as ProjectStatus);
}
</script>

<template>
    <article class="project-card animate__animated animate__fadeInUp" @click="emit('open', project)">
        <div class="project-card__top">
            <div :class="['project-type-icon', `project-type-icon--${project.type}`]">
                <span aria-hidden="true">{{ project.type === "branding" ? "Aa" : "✦" }}</span>
            </div>
            <div class="project-card__actions">
                <button class="card-icon-button" aria-label="Editar proyecto" type="button" @click.stop="emit('edit', project)">✎</button>
            </div>
        </div>

        <div class="project-card__content">
            <span class="type-label">{{ TYPE_LABELS[project.type] }}</span>
            <h3>{{ project.title }}</h3>
            <p>{{ project.description }}</p>
        </div>

        <div class="client-chip">
            <span>{{ clientName.slice(0, 1).toUpperCase() }}</span>
            {{ clientName }}
        </div>

        <div class="date-row">
            <span>Entrega</span>
            <strong :class="{ overdue: isOverdue(project) }">
                {{ formatDate(project.deliveryDate) }}
                <small v-if="isOverdue(project)">Vencido</small>
            </strong>
        </div>

        <div class="payment-summary">
            <div class="payment-summary__labels">
                <span>Cobrado {{ formatCurrency(getPaidAmount(project.payments)) }}</span>
                <strong>{{ getPaymentProgress(project) }}%</strong>
            </div>
            <div class="progress-track">
                <span :style="{ width: `${getPaymentProgress(project)}%` }"></span>
            </div>
            <div class="payment-summary__total">
                <span>Total</span>
                <strong>{{ formatCurrency(project.totalCost) }}</strong>
            </div>
        </div>

        <div class="project-card__footer" @click.stop>
            <span :class="['status-dot', STATUS_STYLES[project.status]]"></span>
            <select :value="project.status" :aria-label="`Estado de ${project.title}`" class="status-select" @change="changeStatus">
                <option v-for="(label, value) in STATUS_LABELS" :key="value" :value="value">{{ label }}</option>
            </select>
            <button class="detail-link" type="button" @click="emit('open', project)">Ver detalle →</button>
        </div>
    </article>
</template>
