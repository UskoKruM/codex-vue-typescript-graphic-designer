import { parseEnvironment } from "@/config/environment.schema";

export const env = parseEnvironment(import.meta.env);
