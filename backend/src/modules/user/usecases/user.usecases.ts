import type { PrismaUserRepository } from "@/modules/user/repository/prisma-user.repository.js";
import { AppError } from "@/shared/errors/app.error.js";
import type {
  CreateSchemaResponseType,
  LoginSchemaResponseType,
} from "@/types/response.schema.js";
import type {
  UserCreateSchemaType,
  UserGetAllSchemaType,
  UserLoginSchemaType,
} from "@/types/schema.js";
import { PasswordHasher } from "../services/userservice.js";

export class userUseCase {
  constructor(
    private readonly repository: PrismaUserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async register(
    data: UserCreateSchemaType,
  ): Promise<CreateSchemaResponseType> {
    const alreadyExists = await this.repository.findByEmail(data.email);

    if (alreadyExists) {
      throw new AppError("User already exists", 409);
    }

    const hashedPassword = await this.passwordHasher.hash(data.password);

    const user = await this.repository.create({
      ...data,
      password: hashedPassword,
    });

    return user;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async login(data: UserLoginSchemaType): Promise<LoginSchemaResponseType> {
    const user = await this.repository.findByEmail(data.email);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async getAllUsers(): Promise<UserGetAllSchemaType[]> {
    const users = await this.repository.findAll();

    return users;
  }
}
