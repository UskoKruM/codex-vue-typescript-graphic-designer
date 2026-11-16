<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";

const props = withDefaults(
    defineProps<{
        description?: string;
        elevated?: boolean;
        open: boolean;
        size?: "sm" | "md" | "lg";
        title: string;
    }>(),
    {
        description: "",
        elevated: false,
        size: "md"
    }
);

const emit = defineEmits<{
    close: [];
}>();

function onKeydown(event: KeyboardEvent): void {
    if (props.open && event.key === "Escape") {
        emit("close");
    }
}

onMounted(() => document.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => document.removeEventListener("keydown", onKeydown));
</script>

<template>
    <Teleport to="body">
        <Transition
            enter-active-class="animate__animated animate__fadeIn animate__faster"
            leave-active-class="animate__animated animate__fadeOut animate__faster"
        >
            <div
                v-if="open"
                :class="['modal-backdrop', { 'modal-backdrop--elevated': elevated }]"
                role="presentation"
                @mousedown.self="emit('close')"
            >
                <section
                    :class="['modal-panel', `modal-panel--${size}`]"
                    aria-modal="true"
                    role="dialog"
                    @mousedown.stop
                >
                    <header class="modal-header">
                        <div>
                            <p class="eyebrow">Atelier workspace</p>
                            <h2>{{ title }}</h2>
                            <p v-if="description" class="modal-description">{{ description }}</p>
                        </div>
                        <button class="icon-button" aria-label="Cerrar" type="button" @click="emit('close')">×</button>
                    </header>
                    <div class="modal-body">
                        <slot></slot>
                    </div>
                </section>
            </div>
        </Transition>
    </Teleport>
</template>
