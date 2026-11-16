import { z } from "zod";
import { clientSchema } from "@/schemas/client.schema";
import { projectSchema } from "@/schemas/project.schema";

export const databaseSchema = z.object({
    clients: z.array(clientSchema),
    projects: z.array(projectSchema)
});
