<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import AppSidebar from "@/components/AppSidebar.vue";
import ClientsView from "@/components/ClientsView.vue";
import DashboardView from "@/components/DashboardView.vue";
import ProjectsView from "@/components/ProjectsView.vue";
import { env } from "@/config/env";

type View = "dashboard" | "projects" | "clients";

const activeView = ref<View>("dashboard");
const mobileOpen = ref(false);
const darkMode = ref(false);
const projectToOpen = ref("");
const createProjectRequest = ref(0);

const viewTitle = computed(() => ({ clients: "Clientes", dashboard: "Resumen", projects: "Proyectos" })[activeView.value]);
const appName = computed(() => env.VITE_APP_NAME.replace(/[-_]+/g, " "));

function navigate(view: string): void {
    if (view === "dashboard" || view === "projects" || view === "clients") {
        activeView.value = view;
    }
}

function newProject(): void {
    projectToOpen.value = "";
    createProjectRequest.value += 1;
    activeView.value = "projects";
}

function openProject(id: string): void {
    projectToOpen.value = id;
    activeView.value = "projects";
}

function toggleTheme(): void {
    darkMode.value = !darkMode.value;
}

watch(darkMode, (isDark) => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("atelier-theme", isDark ? "dark" : "light");
});

onMounted(() => {
    const stored = localStorage.getItem("atelier-theme");
    darkMode.value = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
});
</script>

<template>
    <UApp>
        <div class="app-shell">
            <AppSidebar
                :active-view="activeView"
                :app-name="appName"
                :mobile-open="mobileOpen"
                @close="mobileOpen = false"
                @navigate="navigate"
            />
            <main class="main-shell">
                <header class="topbar">
                    <div class="topbar__left">
                        <button class="mobile-menu" aria-label="Abrir menú" type="button" @click="mobileOpen = true">☰</button>
                        <div class="breadcrumb"><span>Workspace</span><b>/</b><strong>{{ viewTitle }}</strong></div>
                    </div>
                    <div class="topbar__right">
                        <span class="sync-status"><i></i> Guardado local</span>
                        <button class="theme-toggle" :aria-label="darkMode ? 'Activar modo claro' : 'Activar modo oscuro'" type="button" @click="toggleTheme">
                            <span>{{ darkMode ? "☀" : "☾" }}</span>
                        </button>
                    </div>
                </header>

                <DashboardView
                    v-if="activeView === 'dashboard'"
                    @navigate="navigate"
                    @new-project="newProject"
                    @open-project="openProject"
                />
                <ProjectsView
                    v-else-if="activeView === 'projects'"
                    :initial-project-id="projectToOpen"
                    :request-create="createProjectRequest"
                    @clear-create="createProjectRequest = 0"
                    @clear-initial="projectToOpen = ''"
                    @go-clients="activeView = 'clients'"
                />
                <ClientsView v-else />
            </main>
        </div>
    </UApp>
</template>
