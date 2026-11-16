<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import BaseModal from "@/components/BaseModal.vue";
import { paymentInputSchema } from "@/schemas/project.schema";
import { PROJECT_STATUSES, type PaymentInput, type Project, type ProjectStatus } from "@/types/domain";
import { STATUS_LABELS, STATUS_STYLES, TYPE_LABELS } from "@/utils/constants";
import { formatCurrency, formatDate, todayIso } from "@/utils/formatters";
import { getPaidAmount, getPaymentProgress, getProjectBalance } from "@/utils/projects";

const props = defineProps<{
    clientName: string;
    open: boolean;
    project: Project | null;
}>();

const emit = defineEmits<{
    addPayment: [projectId: string, input: PaymentInput];
    close: [];
    delete: [project: Project];
    edit: [project: Project];
    removePayment: [projectId: string, paymentId: string];
    status: [projectId: string, status: ProjectStatus];
}>();

const showPaymentForm = reactive({ value: false });
const statusMenuOpen = ref(false);
const payment = reactive<PaymentInput>({ amount: 0, date: todayIso(), label: "", note: "" });
const errors = reactive<Record<string, string>>({});

const paid = computed(() => (props.project ? getPaidAmount(props.project.payments) : 0));
const balance = computed(() => (props.project ? getProjectBalance(props.project) : 0));

watch(
    () => props.open,
    () => {
        showPaymentForm.value = false;
        statusMenuOpen.value = false;
        Object.assign(payment, { amount: 0, date: todayIso(), label: "", note: "" });
    }
);

function submitPayment(): void {
    if (!props.project) {
        return;
    }
    const result = paymentInputSchema.safeParse({ ...payment, amount: Number(payment.amount) });
    for (const key of Object.keys(errors)) {
        delete errors[key];
    }
    if (!result.success) {
        for (const issue of result.error.issues) {
            errors[String(issue.path[0] ?? "form")] ??= issue.message;
        }
        return;
    }
    emit("addPayment", props.project.id, result.data);
    showPaymentForm.value = false;
    Object.assign(payment, { amount: 0, date: todayIso(), label: "", note: "" });
}

function chooseStatus(status: ProjectStatus): void {
    if (props.project) {
        emit("status", props.project.id, status);
        statusMenuOpen.value = false;
    }
}

function closeStatusMenuOnBlur(event: FocusEvent): void {
    const container = event.currentTarget as HTMLElement;
    const nextTarget = event.relatedTarget as Node | null;
    if (!nextTarget || !container.contains(nextTarget)) {
        statusMenuOpen.value = false;
    }
}
</script>

<template>
    <BaseModal v-if="project" :open="open" size="lg" title="Detalle del proyecto" @close="emit('close')">
        <div class="project-detail">
            <div class="detail-hero">
                <div>
                    <span class="type-label">{{ TYPE_LABELS[project.type] }}</span>
                    <h3>{{ project.title }}</h3>
                    <p>{{ project.description }}</p>
                </div>
                <div class="detail-hero__actions">
                    <UButton color="neutral" size="sm" variant="outline" @click="emit('edit', project)">Editar</UButton>
                    <button class="danger-link" type="button" @click="emit('delete', project)">Eliminar</button>
                </div>
            </div>

            <div v-if="project.status === 'cancelled'" class="cancelled-note">
                <span>!</span>
                <div>
                    <strong>Proyecto cancelado</strong>
                    <p>Los {{ formatCurrency(paid) }} cobrados se conservan en el historial y no se consideran reembolsables.</p>
                </div>
            </div>

            <div class="detail-facts">
                <div><span>Cliente</span><strong>{{ clientName }}</strong></div>
                <div><span>Pedido</span><strong>{{ formatDate(project.orderDate) }}</strong></div>
                <div><span>Entrega</span><strong>{{ formatDate(project.deliveryDate) }}</strong></div>
                <label>
                    <span>Estado</span>
                    <div class="status-control" @focusout="closeStatusMenuOnBlur" @keydown.escape.stop="statusMenuOpen = false">
                        <i :class="['status-dot', STATUS_STYLES[project.status]]"></i>
                        <button
                            :aria-expanded="statusMenuOpen"
                            :aria-label="`Estado del proyecto: ${STATUS_LABELS[project.status]}`"
                            aria-haspopup="listbox"
                            class="status-control__trigger"
                            type="button"
                            @click="statusMenuOpen = !statusMenuOpen"
                        >
                            <span>{{ STATUS_LABELS[project.status] }}</span>
                            <i aria-hidden="true"></i>
                        </button>
                        <div v-if="statusMenuOpen" class="status-menu" role="listbox" aria-label="Estados disponibles">
                            <button
                                v-for="status in PROJECT_STATUSES"
                                :key="status"
                                :aria-selected="project.status === status"
                                :class="{ 'status-menu__option--selected': project.status === status }"
                                role="option"
                                type="button"
                                @click="chooseStatus(status)"
                            >
                                <span :class="['status-dot', STATUS_STYLES[status]]"></span>
                                {{ STATUS_LABELS[status] }}
                            </button>
                        </div>
                    </div>
                </label>
            </div>

            <section class="finance-section">
                <div class="section-heading">
                    <div>
                        <p class="eyebrow">Control financiero</p>
                        <h4>Pagos del proyecto</h4>
                    </div>
                    <UButton color="primary" size="sm" @click="showPaymentForm.value = !showPaymentForm.value">
                        {{ showPaymentForm.value ? "Cerrar" : "+ Registrar pago" }}
                    </UButton>
                </div>

                <div class="finance-kpis">
                    <div><span>Presupuesto</span><strong>{{ formatCurrency(project.totalCost) }}</strong></div>
                    <div><span>Cobrado</span><strong class="positive">{{ formatCurrency(paid) }}</strong></div>
                    <div><span>Por cobrar</span><strong>{{ formatCurrency(balance) }}</strong></div>
                    <div><span>Avance</span><strong>{{ getPaymentProgress(project) }}%</strong></div>
                </div>

                <form v-if="showPaymentForm.value" class="payment-form animate__animated animate__fadeIn" @submit.prevent="submitPayment">
                    <label class="field">
                        <span>Concepto</span>
                        <input v-model="payment.label" data-testid="payment-label" placeholder="Ej. Adelanto inicial" />
                        <small v-if="errors.label" class="field-error">{{ errors.label }}</small>
                    </label>
                    <label class="field">
                        <span>Monto (S/)</span>
                        <input v-model.number="payment.amount" data-testid="payment-amount" min="0" step="0.01" type="number" />
                        <small v-if="errors.amount" class="field-error">{{ errors.amount }}</small>
                    </label>
                    <label class="field">
                        <span>Fecha</span>
                        <input v-model="payment.date" type="date" />
                    </label>
                    <label class="field">
                        <span>Nota <em>opcional</em></span>
                        <input v-model="payment.note" placeholder="Referencia o detalle" />
                    </label>
                    <div class="payment-form__action">
                        <UButton color="primary" data-testid="save-payment" size="sm" type="submit">Guardar pago</UButton>
                    </div>
                </form>

                <div v-if="project.payments.length" class="payment-list">
                    <article v-for="item in project.payments" :key="item.id" class="payment-item">
                        <div class="payment-item__icon">✓</div>
                        <div class="payment-item__main">
                            <strong>{{ item.label }}</strong>
                            <span>{{ formatDate(item.date) }}<template v-if="item.note"> · {{ item.note }}</template></span>
                        </div>
                        <strong>{{ formatCurrency(item.amount) }}</strong>
                        <button aria-label="Eliminar pago" class="payment-delete" type="button" @click="emit('removePayment', project.id, item.id)">×</button>
                    </article>
                </div>
                <div v-else class="empty-inline">Aún no hay pagos registrados para este proyecto.</div>
            </section>
        </div>
    </BaseModal>
</template>
