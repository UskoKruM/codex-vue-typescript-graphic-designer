<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import BaseModal from "@/components/BaseModal.vue";
import ProjectCard from "@/components/ProjectCard.vue";
import ProjectDetailModal from "@/components/ProjectDetailModal.vue";
import ProjectFormModal from "@/components/ProjectFormModal.vue";
import { useDesignStore } from "@/composables/useDesignStore";
import { PROJECT_STATUSES, PROJECT_TYPES, type PaymentInput, type Project, type ProjectFilters, type ProjectInput, type ProjectStatus } from "@/types/domain";
import { STATUS_LABELS, TYPE_LABELS } from "@/utils/constants";

const props = withDefaults(
    defineProps<{
        initialProjectId?: string;
        requestCreate?: number;
    }>(),
    { initialProjectId: "", requestCreate: 0 }
);

const emit = defineEmits<{
    clearCreate: [];
    clearInitial: [];
    goClients: [];
}>();

const store = useDesignStore();
const filters = reactive<ProjectFilters>({ clientId: "all", query: "", status: "all", type: "all" });
const formOpen = ref(false);
const editingProject = ref<Project | null>(null);
const selectedId = ref(props.initialProjectId);
const deleteTarget = ref<Project | null>(null);

const filteredProjects = computed(() => store.filterProjects(filters));
const selectedProject = computed(() => store.projects.value.find((project) => project.id === selectedId.value) ?? null);
const hasFilters = computed(() => filters.query || filters.status !== "all" || filters.type !== "all" || filters.clientId !== "all");

watch(
    () => props.requestCreate,
    (request) => {
        if (request > 0) {
            editingProject.value = null;
            formOpen.value = true;
            emit("clearCreate");
        }
    },
    { immediate: true }
);

function openCreate(): void {
    editingProject.value = null;
    formOpen.value = true;
}

function openEdit(project: Project): void {
    selectedId.value = "";
    editingProject.value = project;
    formOpen.value = true;
}

function saveProject(input: ProjectInput): void {
    if (editingProject.value) {
        store.updateProject(editingProject.value.id, input);
    } else {
        store.addProject(input);
    }
    formOpen.value = false;
    editingProject.value = null;
}

function openDetail(project: Project): void {
    selectedId.value = project.id;
    emit("clearInitial");
}

function closeDetail(): void {
    selectedId.value = "";
    emit("clearInitial");
}

function requestDelete(project: Project): void {
    deleteTarget.value = project;
}

function confirmDelete(): void {
    if (deleteTarget.value) {
        store.deleteProject(deleteTarget.value.id);
        selectedId.value = "";
    }
    deleteTarget.value = null;
}

function clearFilters(): void {
    Object.assign(filters, { clientId: "all", query: "", status: "all", type: "all" });
}

function addPayment(projectId: string, input: PaymentInput): void {
    store.addPayment(projectId, input);
}

function changeStatus(projectId: string, status: ProjectStatus): void {
    store.changeProjectStatus(projectId, status);
}
</script>

<template>
    <div class="view-shell projects-view">
        <section class="page-heading">
            <div>
                <p class="eyebrow">Portafolio activo</p>
                <h1>Proyectos</h1>
                <p>Organiza encargos, entregas y pagos desde un solo lugar.</p>
            </div>
            <UButton color="primary" data-testid="new-project" size="lg" @click="openCreate">+ Nuevo proyecto</UButton>
        </section>

        <section class="filter-bar">
            <label class="search-field">
                <span aria-hidden="true">⌕</span>
                <input v-model="filters.query" data-testid="project-search" placeholder="Buscar proyecto o cliente..." type="search" />
            </label>
            <label class="filter-select"><span>Estado</span><select v-model="filters.status">
                <option value="all">Todos</option>
                <option v-for="status in PROJECT_STATUSES" :key="status" :value="status">{{ STATUS_LABELS[status] }}</option>
            </select></label>
            <label class="filter-select"><span>Tipo</span><select v-model="filters.type">
                <option value="all">Todos</option>
                <option v-for="type in PROJECT_TYPES" :key="type" :value="type">{{ TYPE_LABELS[type] }}</option>
            </select></label>
            <label class="filter-select"><span>Cliente</span><select v-model="filters.clientId">
                <option value="all">Todos</option>
                <option v-for="client in store.clients.value" :key="client.id" :value="client.id">{{ client.name }}</option>
            </select></label>
            <button v-if="hasFilters" class="clear-filters" type="button" @click="clearFilters">Limpiar</button>
        </section>

        <div class="results-heading">
            <span>{{ filteredProjects.length }} {{ filteredProjects.length === 1 ? "proyecto" : "proyectos" }}</span>
            <small>Ordenados por fecha de pedido</small>
        </div>

        <section v-if="filteredProjects.length" class="project-grid">
            <ProjectCard
                v-for="project in filteredProjects"
                :key="project.id"
                :client-name="store.getClientName(project.clientId)"
                :project="project"
                @edit="openEdit"
                @open="openDetail"
                @status="changeStatus"
            />
        </section>

        <section v-else class="empty-state">
            <div>◇</div>
            <h2>{{ store.projects.value.length ? "No encontramos coincidencias" : "Tu primer proyecto empieza aquí" }}</h2>
            <p>{{ store.projects.value.length ? "Prueba con otros filtros o limpia la búsqueda." : "Crea un encargo para comenzar a organizar tu trabajo." }}</p>
            <UButton v-if="store.clients.value.length" color="primary" @click="store.projects.value.length ? clearFilters() : openCreate()">
                {{ store.projects.value.length ? "Limpiar filtros" : "Crear proyecto" }}
            </UButton>
            <UButton v-else color="primary" @click="emit('goClients')">Crear un cliente primero</UButton>
        </section>

        <ProjectFormModal
            :clients="store.clients.value"
            :open="formOpen"
            :project="editingProject"
            @close="formOpen = false"
            @save="saveProject"
        />
        <ProjectDetailModal
            :client-name="selectedProject ? store.getClientName(selectedProject.clientId) : ''"
            :open="Boolean(selectedProject)"
            :project="selectedProject"
            @add-payment="addPayment"
            @close="closeDetail"
            @delete="requestDelete"
            @edit="openEdit"
            @remove-payment="store.removePayment"
            @status="changeStatus"
        />
        <BaseModal elevated :open="Boolean(deleteTarget)" size="sm" title="Eliminar proyecto" @close="deleteTarget = null">
            <div class="confirm-dialog">
                <div class="confirm-icon">!</div>
                <p>Se eliminará <strong>{{ deleteTarget?.title }}</strong> y todo su historial de pagos. Esta acción no se puede deshacer.</p>
                <div class="form-actions">
                    <UButton color="neutral" variant="ghost" @click="deleteTarget = null">Cancelar</UButton>
                    <UButton color="error" data-testid="confirm-delete-project" @click="confirmDelete">Eliminar</UButton>
                </div>
            </div>
        </BaseModal>
    </div>
</template>
