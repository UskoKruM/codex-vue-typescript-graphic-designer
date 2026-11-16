<script setup lang="ts">
import { computed } from "vue";
import { useDesignStore } from "@/composables/useDesignStore";
import { PROJECT_TYPES, type ProjectStatus } from "@/types/domain";
import { STATUS_LABELS, TYPE_COLORS, TYPE_LABELS } from "@/utils/constants";
import { formatCompactCurrency, formatCurrency, formatDate } from "@/utils/formatters";
import { getPaidAmount, isOverdue } from "@/utils/projects";

const emit = defineEmits<{
    navigate: [view: "projects" | "clients"];
    newProject: [];
    openProject: [id: string];
}>();

const store = useDesignStore();

const activeProjects = computed(() => store.projects.value.filter((project) => project.status === "in-progress").length);
const completedProjects = computed(() => store.projects.value.filter((project) => project.status === "completed").length);
const overdueProjects = computed(() => store.projects.value.filter((project) => isOverdue(project)).length);
const recentProjects = computed(() => store.projects.value.slice(0, 3));

const revenueByType = computed(() => {
    const total = store.totalCollected.value;
    return PROJECT_TYPES.map((type) => {
        const amount = store.projects.value
            .filter((project) => project.type === type)
            .reduce((sum, project) => sum + getPaidAmount(project.payments), 0);
        return { amount, percentage: total ? Math.round((amount / total) * 100) : 0, type };
    })
        .filter((item) => item.amount > 0)
        .sort((a, b) => b.amount - a.amount);
});

const donutStyle = computed(() => {
    let cursor = 0;
    const stops = revenueByType.value.map((item) => {
        const start = cursor;
        cursor += item.percentage;
        return `${TYPE_COLORS[item.type]} ${start}% ${cursor}%`;
    });
    return { background: `conic-gradient(${stops.join(", ")})` };
});

const statusSummary = computed(() => {
    const statuses: ProjectStatus[] = ["in-progress", "not-started", "completed", "cancelled"];
    return statuses.map((status) => ({
        count: store.projects.value.filter((project) => project.status === status).length,
        status
    }));
});

const monthlyRevenue = computed(() => {
    const now = new Date();
    const months = Array.from({ length: 5 }, (_, index) => {
        const date = new Date(now.getFullYear(), now.getMonth() - 4 + index, 1);
        return {
            key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
            label: new Intl.DateTimeFormat("es-PE", { month: "short" }).format(date).replace(".", "")
        };
    }).map((month) => ({
        ...month,
        amount: store.projects.value.flatMap((project) => project.payments).filter((payment) => payment.date.startsWith(month.key)).reduce((sum, payment) => sum + payment.amount, 0)
    }));
    const max = Math.max(...months.map((month) => month.amount), 1);
    return months.map((month) => ({ ...month, height: Math.max((month.amount / max) * 100, month.amount ? 8 : 2) }));
});
</script>

<template>
    <div class="view-shell dashboard-view">
        <section class="welcome-row">
            <div>
                <p class="eyebrow">Panel de estudio</p>
                <h1>Todo tu trabajo, <em>bajo control.</em></h1>
                <p class="welcome-copy">Una lectura clara de tus proyectos, entregas y cobros.</p>
            </div>
            <UButton color="primary" size="lg" @click="emit('newProject')">+ Nuevo proyecto</UButton>
        </section>

        <section class="kpi-grid" aria-label="Indicadores principales">
            <article class="kpi-card kpi-card--violet">
                <div class="kpi-icon">↗</div>
                <span>Ingresos cobrados</span>
                <strong>{{ formatCurrency(store.totalCollected.value) }}</strong>
                <small>Pagos confirmados</small>
            </article>
            <article class="kpi-card kpi-card--orange">
                <div class="kpi-icon">◎</div>
                <span>Por cobrar</span>
                <strong>{{ formatCurrency(store.totalPending.value) }}</strong>
                <small>Solo proyectos vigentes</small>
            </article>
            <article class="kpi-card kpi-card--blue">
                <div class="kpi-icon">◫</div>
                <span>En progreso</span>
                <strong>{{ activeProjects }}</strong>
                <small>{{ completedProjects }} finalizados en total</small>
            </article>
            <article class="kpi-card kpi-card--pink">
                <div class="kpi-icon">⌁</div>
                <span>Entregas vencidas</span>
                <strong>{{ overdueProjects }}</strong>
                <small>{{ overdueProjects ? "Requieren atención" : "Todo al día" }}</small>
            </article>
        </section>

        <section class="analytics-grid">
            <article class="panel revenue-panel">
                <div class="panel-heading">
                    <div>
                        <p class="eyebrow">Rendimiento</p>
                        <h2>Ingresos por mes</h2>
                    </div>
                    <span class="panel-chip">Últimos 5 meses</span>
                </div>
                <div class="bar-chart" aria-label="Gráfico de ingresos mensuales">
                    <div v-for="month in monthlyRevenue" :key="month.key" class="bar-chart__column">
                        <div class="bar-chart__value">{{ month.amount ? formatCompactCurrency(month.amount) : "—" }}</div>
                        <div class="bar-chart__track"><span :style="{ height: `${month.height}%` }"></span></div>
                        <small>{{ month.label }}</small>
                    </div>
                </div>
            </article>

            <article class="panel type-panel">
                <div class="panel-heading">
                    <div>
                        <p class="eyebrow">Distribución</p>
                        <h2>Ganancias por diseño</h2>
                    </div>
                </div>
                <div class="donut-layout">
                    <div class="donut-chart" :style="donutStyle">
                        <div><strong>{{ formatCompactCurrency(store.totalCollected.value) }}</strong><span>Total</span></div>
                    </div>
                    <div class="chart-legend">
                        <div v-for="item in revenueByType.slice(0, 4)" :key="item.type">
                            <i :style="{ background: TYPE_COLORS[item.type] }"></i>
                            <span>{{ TYPE_LABELS[item.type] }}</span>
                            <strong>{{ item.percentage }}%</strong>
                        </div>
                    </div>
                </div>
            </article>
        </section>

        <section class="dashboard-lower">
            <article class="panel recent-panel">
                <div class="panel-heading">
                    <div>
                        <p class="eyebrow">Actividad reciente</p>
                        <h2>Últimos proyectos</h2>
                    </div>
                    <button class="text-link" type="button" @click="emit('navigate', 'projects')">Ver todos →</button>
                </div>
                <div class="recent-list">
                    <button v-for="project in recentProjects" :key="project.id" type="button" @click="emit('openProject', project.id)">
                        <div :class="['mini-project-icon', `project-type-icon--${project.type}`]">✦</div>
                        <div class="recent-list__main">
                            <strong>{{ project.title }}</strong>
                            <span>{{ store.getClientName(project.clientId) }} · {{ formatDate(project.deliveryDate) }}</span>
                        </div>
                        <div class="recent-list__amount">
                            <strong>{{ formatCurrency(project.totalCost) }}</strong>
                            <span>{{ STATUS_LABELS[project.status] }}</span>
                        </div>
                        <span class="recent-arrow">›</span>
                    </button>
                </div>
            </article>

            <article class="panel status-panel">
                <div class="panel-heading">
                    <div>
                        <p class="eyebrow">Flujo de trabajo</p>
                        <h2>Estado general</h2>
                    </div>
                </div>
                <div class="status-overview">
                    <div v-for="item in statusSummary" :key="item.status" :class="`status-overview__${item.status}`">
                        <span>{{ STATUS_LABELS[item.status] }}</span>
                        <strong>{{ item.count }}</strong>
                    </div>
                </div>
                <button class="manage-clients" type="button" @click="emit('navigate', 'clients')">
                    <span class="manage-clients__icon">☺</span>
                    <span><strong>{{ store.clients.value.length }} clientes activos</strong><small>Gestionar directorio</small></span>
                    <b>→</b>
                </button>
            </article>
        </section>
    </div>
</template>
