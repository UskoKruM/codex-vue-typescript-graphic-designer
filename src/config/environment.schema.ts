import { z } from "zod";

export const environmentSchema = z.object({
    VITE_APP_NAME: z
        .string()
        .trim()
        .min(1, "VITE_APP_NAME is required.")
        .regex(/^[\p{L}\p{N} _-]+$/u, "VITE_APP_NAME contains unsupported characters.")
});

export type Environment = z.infer<typeof environmentSchema>;

export function parseEnvironment(input: unknown): Environment {
    return environmentSchema.parse(input);
}
