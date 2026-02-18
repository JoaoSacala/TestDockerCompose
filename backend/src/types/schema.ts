import z from "zod";
import { generateZodSchema } from "@/helpers/generic-types.js";
import type { User } from "../../generated/prisma/client.js";

const UserSchema = generateZodSchema<User>();
export type UserType = z.infer<typeof UserSchema>;

export const UserSubsetType = UserSchema.pick({
  id: true,
  name: true,
  email: true,
  password: true,
  createdAt: true,
  updatedAt: true,
});

const UserCreateSchema = UserSubsetType.extend({
  name: z.string().min(2).max(100),
  email: z.email(),
  password: z.string().min(8).max(100),
});

export type UserCreateSchemaType = z.infer<typeof UserCreateSchema>;

export const UserLoginSchema = UserSubsetType.extend({
  email: z.email(),
  password: z.string().min(5).max(100),
});

export type UserLoginSchemaType = z.infer<typeof UserLoginSchema>;

export const UserRegisterSchema = UserCreateSchema.extend({
  email: z.email(),
  password: z.string().min(8).max(100),
});

export type UserRegisterSchemaType = z.infer<typeof UserRegisterSchema>;

export const UserGetAllSchema = UserSchema.pick({
  id: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
});

export type UserGetAllSchemaType = z.infer<typeof UserGetAllSchema>;
