import { describe, expect, it } from "vitest";
import { formatCompactCurrency, formatCurrency, formatDate } from "@/utils/formatters";

describe("formatters", () => {
    it("formatea moneda peruana con dos decimales", () => {
        expect(formatCurrency(1250.5).replaceAll(" ", " ")).toBe("S/ 1,250.50");
    });

    it("genera una versión compacta para indicadores", () => {
        expect(formatCompactCurrency(8650)).toMatch(/S\/\s*8[,.]7\s*k/i);
    });

    it("formatea fechas ISO sin desplazarlas por zona horaria", () => {
        expect(formatDate("2026-11-02")).toContain("02");
        expect(formatDate("2026-11-02")).toContain("2026");
    });

    it("conserva valores inválidos y describe fechas vacías", () => {
        expect(formatDate("")).toBe("Sin fecha");
        expect(formatDate("fecha-libre")).toBe("fecha-libre");
    });
});
