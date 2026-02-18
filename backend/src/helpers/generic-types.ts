import { z } from "zod";

// Mapeia tipos TS básicos para Zod
type ZodShapeFrom<T> = {
  [K in keyof T]: T[K] extends string
    ? z.ZodString
    : T[K] extends number
      ? z.ZodNumber
      : T[K] extends boolean
        ? z.ZodBoolean
        : T[K] extends Date
          ? z.ZodDate
          : z.ZodTypeAny;
};

export function generateZodSchema<T>() {
  const shape = {} as ZodShapeFrom<T>;
  return z.object(shape);
}
