import z from "zod";
import { UserSubsetType } from "@/types/schema.js";

const ResponseCreateSchema = UserSubsetType.extend({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

export type CreateSchemaResponseType = z.infer<typeof ResponseCreateSchema>;

export const ResponseLoginSchema = UserSubsetType.extend({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

export type LoginSchemaResponseType = z.infer<typeof ResponseLoginSchema>;
