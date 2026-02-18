import { prisma } from "@/lib/prisma.js";
import type { UserRepository } from "@/modules/user/repository/user.repository.js";
import type { UserCreateSchemaType, UserType } from "@/types/schema.js";

export class PrismaUserRepository implements UserRepository {
  async create(data: UserCreateSchemaType): Promise<UserType> {
    const user = await prisma.user.create({
      data,
    });
    return user;
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }

  async findAll(): Promise<UserType[]> {
    const users = await prisma.user.findMany();
    return users;
  }

  async findByEmail(email: string): Promise<UserType | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  }
}
