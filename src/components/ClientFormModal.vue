<script setup lang="ts">
import { reactive, watch } from "vue";
import { clientInputSchema } from "@/schemas/client.schema";
import type { Client, ClientInput } from "@/types/domain";
import BaseModal from "@/components/BaseModal.vue";

const props = defineProps<{
    client: Client | null;
    open: boolean;
}>();

const emit = defineEmits<{
    close: [];
    save: [input: ClientInput];
}>();

const form = reactive<ClientInput>({ company: "", email: "", name: "", phone: "" });
const errors = reactive<Record<string, string>>({});

function reset(): void {
    Object.assign(form, {
        company: props.client?.company ?? "",
        email: props.client?.email ?? "",
        name: props.client?.name ?? "",
        phone: props.client?.phone ?? ""
    });
    for (const key of Object.keys(errors)) {
        delete errors[key];
    }
}

watch(() => [props.open, props.client] as const, reset, { immediate: true });

function submit(): void {
    const result = clientInputSchema.safeParse(form);
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
        :description="client ? 'Actualiza los datos de contacto sin perder el historial.' : 'Crea una ficha para vincular proyectos y cobros.'"
        :open="open"
        size="sm"
        :title="client ? 'Editar cliente' : 'Nuevo cliente'"
        @close="emit('close')"
    >
        <form class="form-stack" novalidate @submit.prevent="submit">
            <label class="field field--full">
                <span>Nombre completo</span>
                <input v-model="form.name" autocomplete="name" data-testid="client-name" placeholder="Ej. Camila Flores" />
                <small v-if="errors.name" class="field-error">{{ errors.name }}</small>
            </label>
            <label class="field field--full">
                <span>Empresa <em>opcional</em></span>
                <input v-model="form.company" autocomplete="organization" placeholder="Ej. Horizonte SAC" />
                <small v-if="errors.company" class="field-error">{{ errors.company }}</small>
            </label>
            <label class="field field--full">
                <span>Correo electrónico</span>
                <input v-model="form.email" autocomplete="email" data-testid="client-email" placeholder="nombre@empresa.com" type="email" />
                <small v-if="errors.email" class="field-error">{{ errors.email }}</small>
            </label>
            <label class="field field--full">
                <span>Teléfono</span>
                <input v-model="form.phone" autocomplete="tel" placeholder="+51 999 999 999" />
                <small v-if="errors.phone" class="field-error">{{ errors.phone }}</small>
            </label>
            <div class="form-actions">
                <UButton color="neutral" type="button" variant="ghost" @click="emit('close')">Cancelar</UButton>
                <UButton color="primary" data-testid="save-client" type="submit">{{ client ? "Guardar cambios" : "Crear cliente" }}</UButton>
            </div>
        </form>
    </BaseModal>
</template>
