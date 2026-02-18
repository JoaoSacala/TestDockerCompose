import type { FastifyReply, FastifyRequest } from "fastify";
import type { userUseCase } from "@/modules/user/usecases/user.usecases.js";
import type {
  UserLoginSchemaType,
  UserRegisterSchemaType,
} from "@/types/schema.js";

export class UserController {
  constructor(private readonly usecases: userUseCase) {}

  register = async (
    request: FastifyRequest<{ Body: UserRegisterSchemaType }>,
    reply: FastifyReply,
  ) => {
    const user = await this.usecases.register(request.body);

    const response = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    reply.status(201).send(response);
  };

  delete = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    await this.usecases.delete(request.params.id);

    reply.status(204).send();
  };

  login = async (
    request: FastifyRequest<{ Body: UserLoginSchemaType }>,
    reply: FastifyReply,
  ) => {
    const user = await this.usecases.login(request.body);
    const token = await reply.jwtSign({ id: user.id });

    return reply
      .setCookie("token", token, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        maxAge: 60 * 60 * 24,
      })
      .status(200)
      .send({
        id: user.id,
        name: user.name,
        email: user.email,
        token,
      });
  };

  getAllUsers = async (_: FastifyRequest, reply: FastifyReply) => {
    const users = await this.usecases.getAllUsers();
    reply.status(200).send(users);
  };
}
