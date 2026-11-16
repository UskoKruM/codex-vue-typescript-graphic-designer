<script setup lang="ts">
import { computed, ref } from "vue";
import BaseModal from "@/components/BaseModal.vue";
import ClientFormModal from "@/components/ClientFormModal.vue";
import { useDesignStore } from "@/composables/useDesignStore";
import type { Client, ClientInput } from "@/types/domain";
import { formatCurrency } from "@/utils/formatters";
import { getPaidAmount } from "@/utils/projects";

const store = useDesignStore();
const query = ref("");
const formOpen = ref(false);
const editingClient = ref<Client | null>(null);
const deleteTarget = ref<Client | null>(null);
const blockedMessage = ref("");

const filteredClients = computed(() => {
    const normalized = query.value.trim().toLocaleLowerCase("es");
    return store.clients.value.filter((client) =>
        [client.name, client.company, client.email].some((value) => value.toLocaleLowerCase("es").includes(normalized))
    );
});

function clientStats(clientId: string) {
    const projects = store.projects.value.filter((project) => project.clientId === clientId);
    return {
        collected: projects.reduce((total, project) => total + getPaidAmount(project.payments), 0),
        projects: projects.length
    };
}

function openCreate(): void {
    editingClient.value = null;
    formOpen.value = true;
}

function openEdit(client: Client): void {
    editingClient.value = client;
    formOpen.value = true;
}

function saveClient(input: ClientInput): void {
    if (editingClient.value) {
        store.updateClient(editingClient.value.id, input);
    } else {
        store.addClient(input);
    }
    formOpen.value = false;
}

function confirmDelete(): void {
    if (!deleteTarget.value) {
        return;
    }
    const deleted = store.deleteClient(deleteTarget.value.id);
    if (!deleted) {
        blockedMessage.value = "Este cliente tiene proyectos vinculados. Elimina o reasigna esos proyectos antes de borrar su ficha.";
    }
    deleteTarget.value = null;
}
</script>

<template>
    <div class="view-shell clients-view">
        <section class="page-heading">
            <div>
                <p class="eyebrow">Directorio</p>
                <h1>Clientes</h1>
                <p>Mantén los datos de contacto y el valor de cada relación a la vista.</p>
            </div>
            <UButton color="primary" data-testid="new-client" size="lg" @click="openCreate">+ Nuevo cliente</UButton>
        </section>

        <div v-if="blockedMessage" class="notice-banner animate__animated animate__fadeIn">
            <span>!</span><p>{{ blockedMessage }}</p><button aria-label="Cerrar aviso" type="button" @click="blockedMessage = ''">×</button>
        </div>

        <section class="client-toolbar">
            <label class="search-field">
                <span aria-hidden="true">⌕</span>
                <input v-model="query" data-testid="client-search" placeholder="Buscar por nombre, empresa o correo..." type="search" />
            </label>
            <span>{{ filteredClients.length }} contactos</span>
        </section>

        <section v-if="filteredClients.length" class="client-grid">
            <article v-for="client in filteredClients" :key="client.id" class="client-card animate__animated animate__fadeInUp">
                <div class="client-card__top">
                    <div class="client-avatar">{{ client.name.split(' ').map((part) => part[0]).join('').slice(0, 2) }}</div>
                    <div class="client-actions">
                        <button aria-label="Editar cliente" type="button" @click="openEdit(client)">✎</button>
                        <button aria-label="Eliminar cliente" type="button" @click="deleteTarget = client">×</button>
                    </div>
                </div>
                <h2>{{ client.name }}</h2>
                <p>{{ client.company || "Cliente independiente" }}</p>
                <div class="client-contact">
                    <a :href="`mailto:${client.email}`">{{ client.email }}</a>
                    <a :href="`tel:${client.phone}`">{{ client.phone }}</a>
                </div>
                <div class="client-stats">
                    <div><span>Proyectos</span><strong>{{ clientStats(client.id).projects }}</strong></div>
                    <div><span>Total cobrado</span><strong>{{ formatCurrency(clientStats(client.id).collected) }}</strong></div>
                </div>
            </article>
        </section>
        <section v-else class="empty-state">
            <div>☺</div>
            <h2>{{ store.clients.value.length ? "No encontramos ese cliente" : "Crea tu directorio de clientes" }}</h2>
            <p>{{ store.clients.value.length ? "Cambia el término de búsqueda para volver a intentarlo." : "Registra tus contactos y vincúlalos con cada encargo." }}</p>
            <UButton color="primary" @click="store.clients.value.length ? (query = '') : openCreate()">
                {{ store.clients.value.length ? "Limpiar búsqueda" : "Crear cliente" }}
            </UButton>
        </section>

        <ClientFormModal :client="editingClient" :open="formOpen" @close="formOpen = false" @save="saveClient" />
        <BaseModal :open="Boolean(deleteTarget)" size="sm" title="Eliminar cliente" @close="deleteTarget = null">
            <div class="confirm-dialog">
                <div class="confirm-icon">!</div>
                <p>¿Deseas eliminar la ficha de <strong>{{ deleteTarget?.name }}</strong>?</p>
                <div class="form-actions">
                    <UButton color="neutral" variant="ghost" @click="deleteTarget = null">Cancelar</UButton>
                    <UButton color="error" data-testid="confirm-delete-client" @click="confirmDelete">Eliminar</UButton>
                </div>
            </div>
        </BaseModal>
    </div>
</template>
