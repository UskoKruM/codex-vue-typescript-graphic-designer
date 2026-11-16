<script setup lang="ts">
import { reactive, watch } from "vue";
import BaseModal from "@/components/BaseModal.vue";
import { projectInputSchema } from "@/schemas/project.schema";
import { PROJECT_STATUSES, PROJECT_TYPES, type Client, type Project, type ProjectInput } from "@/types/domain";
import { STATUS_LABELS, TYPE_LABELS } from "@/utils/constants";
import { todayIso } from "@/utils/formatters";

const props = defineProps<{
    clients: Client[];
    open: boolean;
    project: Project | null;
}>();

const emit = defineEmits<{
    close: [];
    save: [input: ProjectInput];
}>();

const form = reactive<ProjectInput>({
    clientId: "",
    deliveryDate: todayIso(),
    description: "",
    orderDate: todayIso(),
    status: "not-started",
    title: "",
    totalCost: 0,
    type: "advertising"
});
const errors = reactive<Record<string, string>>({});

function reset(): void {
    Object.assign(form, {
        clientId: props.project?.clientId ?? props.clients[0]?.id ?? "",
        deliveryDate: props.project?.deliveryDate ?? todayIso(),
        description: props.project?.description ?? "",
        orderDate: props.project?.orderDate ?? todayIso(),
        status: props.project?.status ?? "not-started",
        title: props.project?.title ?? "",
        totalCost: props.project?.totalCost ?? 0,
        type: props.project?.type ?? "advertising"
    });
    for (const key of Object.keys(errors)) {
        delete errors[key];
    }
}

watch(() => [props.open, props.project, props.clients.length] as const, reset, { immediate: true });

function submit(): void {
    const result = projectInputSchema.safeParse({ ...form, totalCost: Number(form.totalCost) });
    for (const key of Object.keys(errors)) {
        delete errors[key];
    }
    if (!result.success) {
        for (const issue of result.error.issues) {
            const key = String(issue.path[0] ?? "form");
            errors[key] ??= issue.message;
        }
        return;
    }
    emit("save", result.data);
}
</script>

<template>
    <BaseModal
        :description="project ? 'Ajusta alcance, fechas, estado o presupuesto.' : 'Define el encargo y empieza a llevar el control.'"
        :open="open"
        size="lg"
        :title="project ? 'Editar proyecto' : 'Nuevo proyecto'"
        @close="emit('close')"
    >
        <form class="form-grid" novalidate @submit.prevent="submit">
            <label class="field field--full">
                <span>Título del proyecto</span>
                <input v-model="form.title" data-testid="project-title" placeholder="Ej. Campaña de lanzamiento" />
                <small v-if="errors.title" class="field-error">{{ errors.title }}</small>
            </label>
            <label class="field field--full">
                <span>Descripción corta</span>
                <textarea v-model="form.description" maxlength="240" placeholder="Objetivo, piezas y entregables principales"></textarea>
                <small v-if="errors.description" class="field-error">{{ errors.description }}</small>
            </label>
            <label class="field">
                <span>Cliente</span>
                <select v-model="form.clientId" data-testid="project-client">
                    <option disabled value="">Selecciona un cliente</option>
                    <option v-for="client in clients" :key="client.id" :value="client.id">{{ client.name }}</option>
                </select>
                <small v-if="errors.clientId" class="field-error">{{ errors.clientId }}</small>
            </label>
            <label class="field">
                <span>Tipo de diseño</span>
                <select v-model="form.type">
                    <option v-for="type in PROJECT_TYPES" :key="type" :value="type">{{ TYPE_LABELS[type] }}</option>
                </select>
            </label>
            <label class="field">
                <span>Fecha de pedido</span>
                <input v-model="form.orderDate" type="date" />
                <small v-if="errors.orderDate" class="field-error">{{ errors.orderDate }}</small>
            </label>
            <label class="field">
                <span>Fecha de entrega</span>
                <input v-model="form.deliveryDate" type="date" />
                <small v-if="errors.deliveryDate" class="field-error">{{ errors.deliveryDate }}</small>
            </label>
            <label class="field">
                <span>Estado</span>
                <select v-model="form.status">
                    <option v-for="status in PROJECT_STATUSES" :key="status" :value="status">{{ STATUS_LABELS[status] }}</option>
                </select>
            </label>
            <label class="field">
                <span>Costo total (S/)</span>
                <input v-model.number="form.totalCost" data-testid="project-cost" min="0" placeholder="0.00" step="0.01" type="number" />
                <small v-if="errors.totalCost" class="field-error">{{ errors.totalCost }}</small>
            </label>
            <div class="form-actions field--full">
                <UButton color="neutral" type="button" variant="ghost" @click="emit('close')">Cancelar</UButton>
                <UButton color="primary" data-testid="save-project" :disabled="clients.length === 0" type="submit">
                    {{ project ? "Guardar cambios" : "Crear proyecto" }}
                </UButton>
            </div>
        </form>
    </BaseModal>
</template>
