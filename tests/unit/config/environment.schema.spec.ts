import { describe, expect, it } from "vitest";
import { parseEnvironment } from "@/config/environment.schema";

describe("environmentSchema", () => {
    it("acepta nombres legibles con espacios y caracteres acentuados", () => {
        expect(parseEnvironment({ VITE_APP_NAME: "Gestión de Diseño Gráfico" })).toEqual({
            VITE_APP_NAME: "Gestión de Diseño Gráfico"
        });
    });

    it("elimina espacios exteriores del nombre", () => {
        expect(parseEnvironment({ VITE_APP_NAME: "  Atelier Creativo  " }).VITE_APP_NAME).toBe("Atelier Creativo");
    });

    it("rechaza valores vacíos y caracteres de marcado", () => {
        expect(() => parseEnvironment({ VITE_APP_NAME: "   " })).toThrow("VITE_APP_NAME is required.");
        expect(() => parseEnvironment({ VITE_APP_NAME: "<Atelier>" })).toThrow("unsupported characters");
    });
});
