import type { UserCreateSchemaType, UserType } from "@/types/schema.js";

export interface UserRepository {
  create(data: UserCreateSchemaType): Promise<UserType>;
  delete(id: string): Promise<void>;
  findAll(): Promise<UserType[]>;
  findByEmail(email: string): Promise<UserType | null>;
}
