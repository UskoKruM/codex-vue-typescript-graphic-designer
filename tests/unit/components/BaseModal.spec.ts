import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import BaseModal from "@/components/BaseModal.vue";

describe("BaseModal", () => {
    it("renderiza título, descripción y contenido cuando está abierto", () => {
        const wrapper = mount(BaseModal, {
            attachTo: document.body,
            props: { description: "Descripción de prueba", open: true, title: "Modal de prueba" },
            slots: { default: "Contenido del modal" }
        });

        expect(document.body.textContent).toContain("Modal de prueba");
        expect(document.body.textContent).toContain("Descripción de prueba");
        expect(document.body.textContent).toContain("Contenido del modal");
        wrapper.unmount();
    });

    it("emite cierre al presionar Escape", async () => {
        const wrapper = mount(BaseModal, {
            attachTo: document.body,
            props: { open: true, title: "Modal de prueba" }
        });

        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted("close")).toHaveLength(1);
        wrapper.unmount();
    });
});
