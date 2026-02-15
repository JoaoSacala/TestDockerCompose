import { z } from "zod";
import { UserController } from "@/modules/user/controllers/user.controller.js";
import { PrismaUserRepository } from "@/modules/user/repository/prisma-user.repository.js";
import { userUseCase } from "@/modules/user/usecases/user.usecases.js";
import type { FastifyTypedInstance } from "@/types/type.js";
import { PasswordHasher } from "@/modules/user/services/userservice.js";

export function userRoutes(app: FastifyTypedInstance) {
  const userRepository = new PrismaUserRepository();
  const passwordHasher = new PasswordHasher();
  const userUseCases = new userUseCase(userRepository, passwordHasher);
  const controller = new UserController(userUseCases);

  app.get(
    "/users",
    {
      schema: {
        tags: ["User"],
        description: "Get all users",
        response: {
          200: z.array(
            z
              .object({
                id: z.string(),
                name: z.string(),
                email: z.string(),
              })
              .describe("User getted successfully"),
          ),
        },
      },
    },
    controller.getAllUsers,
  );

  app.post(
    "/users",
    {
      schema: {
        tags: ["User"],
        body: z.object({
          name: z.string(),
          email: z.string(),
          password: z.string(),
        }),
        response: {
          201: z
            .object({
              id: z.string(),
              name: z.string(),
              email: z.string(),
            })
            .describe("User created successfully"),
          409: z
            .object({
              message: z.string(),
            })
            .describe("Email already exists"),
        },
      },
    },
    controller.register,
  );

  app.post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        description: "User login",
        body: z.object({
          email: z.email(),
          password: z.string().min(6),
        }),
        response: {
          200: z.object({
            id: z.string(),
            name: z.string(),
            email: z.string(),
          }),
          401: z.object({
            message: z.string(),
          }),
        },
      },
    },
    controller.login,
  );

  app.delete(
    "/users/:id",
    {
      schema: {
        tags: ["User"],
        description: "Delete user",
        params: z.object({
          id: z.string(),
        }),
        response: {
          204: z
            .object({
              message: z.string(),
            })
            .describe("User deleted successfully"),
        },
      },
    },
    controller.delete,
  );
}
