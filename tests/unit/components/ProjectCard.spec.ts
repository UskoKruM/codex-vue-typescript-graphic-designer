import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ProjectCard from "@/components/ProjectCard.vue";
import type { Project } from "@/types/domain";

const project: Project = {
    clientId: "ee618260-1c65-4e20-bc08-985d965ced9d",
    deliveryDate: "2026-12-01",
    description: "Sistema gráfico de identidad para una marca local.",
    id: "5e170f89-70c0-44bb-955c-88dc447d0969",
    orderDate: "2026-11-01",
    payments: [{ amount: 500, date: "2026-11-01", id: "98cd4473-9909-4581-8039-dfb50f4285c0", label: "Inicial", note: "" }],
    status: "in-progress",
    title: "Identidad Aurora",
    totalCost: 2000,
    type: "branding"
};

describe("ProjectCard", () => {
    it("muestra cliente, montos y porcentaje cobrado", () => {
        const wrapper = mount(ProjectCard, { props: { clientName: "Camila Torres", project } });

        expect(wrapper.text()).toContain("Identidad Aurora");
        expect(wrapper.text()).toContain("Camila Torres");
        expect(wrapper.text()).toContain("25%");
        expect(wrapper.text()).toContain("S/ 2,000.00");
    });

    it("emite el nuevo estado desde la tarjeta", async () => {
        const wrapper = mount(ProjectCard, { props: { clientName: "Camila Torres", project } });

        await wrapper.get("select").setValue("completed");

        expect(wrapper.emitted("status")?.[0]).toEqual([project.id, "completed"]);
    });
});
