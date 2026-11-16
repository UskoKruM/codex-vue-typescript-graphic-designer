<script setup lang="ts">
import type { Component } from "vue";

defineProps<{
    activeView: string;
    appName: string;
    mobileOpen: boolean;
}>();

const emit = defineEmits<{
    close: [];
    navigate: [view: string];
}>();

const navItems: Array<{ id: string; icon: Component | string; label: string }> = [
    { id: "dashboard", icon: "grid", label: "Resumen" },
    { id: "projects", icon: "layers", label: "Proyectos" },
    { id: "clients", icon: "users", label: "Clientes" }
];

function navigate(view: string): void {
    emit("navigate", view);
    emit("close");
}
</script>

<template>
    <div v-if="mobileOpen" class="sidebar-scrim" @click="emit('close')"></div>
    <aside :class="['sidebar', { 'sidebar--open': mobileOpen }]">
        <div class="brand">
            <div class="brand-mark">
                <img alt="Logo" src="/favicon.svg" />
            </div>
            <div class="brand-copy">
                <span>{{ appName }}</span>
                <small>Design workspace</small>
            </div>
            <button class="sidebar-close" aria-label="Cerrar menú" type="button" @click="emit('close')">×</button>
        </div>

        <p class="nav-label">Espacio de trabajo</p>
        <nav aria-label="Navegación principal" class="sidebar-nav">
            <button
                v-for="item in navItems"
                :key="item.id"
                :class="['nav-item', { 'nav-item--active': activeView === item.id }]"
                type="button"
                @click="navigate(item.id)"
            >
                <span :class="['nav-icon', `nav-icon--${String(item.icon)}`]" aria-hidden="true"></span>
                <span>{{ item.label }}</span>
            </button>
        </nav>

        <div class="sidebar-spacer"></div>
        <div class="sidebar-card">
            <span class="sidebar-card__spark">✦</span>
            <p>Tu estudio, en orden.</p>
            <small>Clientes, entregas y cobros siempre visibles.</small>
        </div>

        <div class="profile-row">
            <div class="avatar">DG</div>
            <div>
                <strong>Diseñador gráfico</strong>
                <span>Administrador</span>
            </div>
            <span class="online-dot" title="En línea"></span>
        </div>
    </aside>
</template>
