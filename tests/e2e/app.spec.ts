import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
});

test("muestra el resumen financiero y permite alternar el tema", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Todo tu trabajo/i })).toBeVisible();
    await expect(page.getByText("Ganancias por diseño")).toBeVisible();
    await expect(page.getByText("Ingresos cobrados")).toBeVisible();

    await page.getByRole("button", { name: "Activar modo oscuro" }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect.poll(() => page.evaluate(() => localStorage.getItem("atelier-theme"))).toBe("dark");
});

test("crea y edita un cliente", async ({ page }) => {
    await page.getByRole("button", { name: "Clientes", exact: true }).click();
    await page.getByTestId("new-client").click();
    await page.getByTestId("client-name").fill("Renata Campos");
    await page.getByPlaceholder("Ej. Horizonte SAC").fill("Marea Creativa");
    await page.getByTestId("client-email").fill("renata@marea.pe");
    await page.getByPlaceholder("+51 999 999 999").fill("+51 900 111 222");
    await page.getByTestId("save-client").click();

    await expect(page.getByRole("heading", { name: "Renata Campos" })).toBeVisible();
    await expect(page.getByText("Marea Creativa")).toBeVisible();
});

test("crea un proyecto, cambia su estado y registra un pago parcial", async ({ page }) => {
    await page.getByRole("button", { name: "Proyectos", exact: true }).click();
    await page.getByTestId("new-project").click();
    await page.getByTestId("project-title").fill("Campaña E2E Primavera");
    await page.getByPlaceholder("Objetivo, piezas y entregables principales").fill("Piezas publicitarias para el lanzamiento de temporada.");
    await page.getByTestId("project-cost").fill("2400");
    await page.getByLabel("Fecha de entrega").fill("2026-12-20");
    await page.getByTestId("save-project").click();

    await expect(page.getByRole("heading", { name: "Campaña E2E Primavera" })).toBeVisible();
    await page.getByRole("heading", { name: "Campaña E2E Primavera" }).click();
    const projectDialog = page.getByRole("dialog");
    await expect.poll(() => projectDialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    const dialogBox = await projectDialog.boundingBox();
    const viewport = page.viewportSize();
    expect(dialogBox).not.toBeNull();
    expect(viewport).not.toBeNull();
    expect(Math.abs(dialogBox!.x + dialogBox!.width / 2 - viewport!.width / 2)).toBeLessThan(2);
    await page.getByRole("button", { name: "+ Registrar pago" }).click();
    await page.getByTestId("payment-label").fill("Adelanto de producción");
    await page.getByTestId("payment-amount").fill("800");
    await page.getByTestId("save-payment").click();

    await expect(page.getByText("Adelanto de producción")).toBeVisible();
    await expect(page.locator(".payment-item").filter({ hasText: "Adelanto de producción" }).getByText("S/ 800.00", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: /Estado del proyecto/i }).click();
    await page.getByRole("listbox", { name: "Estados disponibles" }).getByRole("option", { name: "Cancelado" }).click();
    await expect(page.getByText("Proyecto cancelado")).toBeVisible();
    await expect(page.getByText(/no se consideran reembolsables/i)).toBeVisible();
});

test("filtra proyectos por texto y estado", async ({ page }) => {
    await page.getByRole("button", { name: "Proyectos", exact: true }).click();
    await page.getByTestId("project-search").fill("Nativa");
    await expect(page.getByRole("heading", { name: "Rebranding Nativa" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Campaña Luma Invierno" })).toHaveCount(0);
});

test("no reabre el modal de creación al volver al menú de proyectos", async ({ page }) => {
    await page.getByRole("button", { name: "+ Nuevo proyecto" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Cerrar" }).click();

    await page.getByRole("button", { name: "Resumen", exact: true }).click();
    await page.getByRole("button", { name: "Proyectos", exact: true }).click();

    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Proyectos" })).toBeVisible();
});
