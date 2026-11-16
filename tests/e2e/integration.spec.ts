import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
});

test("valida el formulario de cliente antes de guardar", async ({ page }) => {
    await page.getByRole("button", { name: "Clientes", exact: true }).click();
    await page.getByTestId("new-client").click();
    await page.getByTestId("client-name").fill("A");
    await page.getByTestId("client-email").fill("correo-invalido");
    await page.getByPlaceholder("+51 999 999 999").fill("12");
    await page.getByTestId("save-client").click();

    await expect(page.getByText(/al menos 2 caracteres/i)).toBeVisible();
    await expect(page.getByText("Ingresa un correo válido.")).toBeVisible();
    await expect(page.getByText("Ingresa un teléfono válido.")).toBeVisible();
    await expect(page.getByRole("dialog")).toBeVisible();
});

test("persiste un proyecto en LocalStorage después de recargar", async ({ page }) => {
    await page.getByRole("button", { name: "Proyectos", exact: true }).click();
    await page.getByTestId("new-project").click();
    await page.getByTestId("project-title").fill("Proyecto Persistente");
    await page.getByPlaceholder("Objetivo, piezas y entregables principales").fill("Sistema visual completo para comprobar la persistencia local.");
    await page.getByTestId("project-cost").fill("1750");
    await page.getByLabel("Fecha de entrega").fill("2026-12-18");
    await page.getByTestId("save-project").click();
    await expect(page.getByRole("heading", { name: "Proyecto Persistente" })).toBeVisible();

    await page.reload();
    await page.getByRole("button", { name: "Proyectos", exact: true }).click();

    await expect(page.getByRole("heading", { name: "Proyecto Persistente" })).toBeVisible();
    await expect.poll(() => page.evaluate(() => localStorage.getItem("atelier-design-manager-v1"))).toContain("Proyecto Persistente");
});

test("filtra los proyectos finalizados desde el selector de estado", async ({ page }) => {
    await page.getByRole("button", { name: "Proyectos", exact: true }).click();
    await page.locator(".filter-select").filter({ hasText: "Estado" }).locator("select").selectOption("completed");

    await expect(page.getByRole("heading", { name: "Rebranding Nativa" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Campaña Luma Invierno" })).toHaveCount(0);
    await expect(page.getByText("1 proyecto", { exact: true })).toBeVisible();
});

test("completa el ciclo de creación, edición y eliminación de un cliente", async ({ page }) => {
    await page.getByRole("button", { name: "Clientes", exact: true }).click();
    await page.getByTestId("new-client").click();
    await page.getByTestId("client-name").fill("Cliente Temporal");
    await page.getByTestId("client-email").fill("temporal@cliente.pe");
    await page.getByPlaceholder("+51 999 999 999").fill("+51 999 888 777");
    await page.getByTestId("save-client").click();

    const card = page.locator(".client-card").filter({ hasText: "Cliente Temporal" });
    await card.getByRole("button", { name: "Editar cliente" }).click();
    await page.getByTestId("client-name").fill("Cliente Temporal Editado");
    await page.getByTestId("save-client").click();
    await expect(page.getByRole("heading", { name: "Cliente Temporal Editado" })).toBeVisible();

    const editedCard = page.locator(".client-card").filter({ hasText: "Cliente Temporal Editado" });
    await editedCard.getByRole("button", { name: "Eliminar cliente" }).click();
    await page.getByTestId("confirm-delete-client").click();

    await expect(page.getByRole("heading", { name: "Cliente Temporal Editado" })).toHaveCount(0);
});

test("mantiene el detalle del proyecto detrás de la confirmación de eliminación", async ({ page }) => {
    await page.getByRole("button", { name: "Proyectos", exact: true }).click();
    await page.getByRole("heading", { name: "Rebranding Nativa" }).click();
    await expect(page.getByRole("heading", { name: "Detalle del proyecto" })).toBeVisible();

    await page.getByRole("button", { name: "Eliminar", exact: true }).click();

    await expect(page.getByRole("dialog")).toHaveCount(2);
    await expect(page.getByRole("heading", { name: "Detalle del proyecto" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Eliminar proyecto" })).toBeVisible();

    await page.getByRole("button", { name: "Cancelar", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Detalle del proyecto" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Eliminar proyecto" })).toHaveCount(0);
});
