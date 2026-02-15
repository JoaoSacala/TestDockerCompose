import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { routes, users } from "@/routes/user.routes.js";
import type { FastifyTypedInstance } from "@/types/type.js";

describe("User Routes", () => {
  let app: FastifyTypedInstance;

  beforeEach(async () => {
    app = Fastify().withTypeProvider<ZodTypeProvider>();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
    routes(app);
    await app.ready();
  });

  afterEach(() => {
    users.length = 0;
  });

  test("should create a new user", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/users",
      payload: {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      },
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toBe("null");
  });

  test("should retrieve the created user", async () => {
    await app.inject({
      method: "POST",
      url: "/users",
      payload: {
        name: "Jane Doe",
        email: "jane@example.com",
        password: "password456",
      },
    });

    const response = await app.inject({
      method: "GET",
      url: "/users",
    });

    const users = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(users).toHaveLength(1);
    expect(users[0]).toMatchObject({
      name: "Jane Doe",
      email: "jane@example.com",
    });
    expect(users[0]).toHaveProperty("id");
    expect(users[0]).not.toHaveProperty("password");
  });

  test("should fail with invalid email", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/users",
      payload: {
        name: "Invalid User",
        email: "not-an-email",
        password: "password123",
      },
    });

    expect(response.statusCode).toBe(400);
  });

  test("should fail with short password", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/users",
      payload: {
        name: "Test User",
        email: "test@example.com",
        password: "12345",
      },
    });

    expect(response.statusCode).toBe(400);
  });
});
