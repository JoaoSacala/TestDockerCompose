import jwt from "@fastify/jwt";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

export default fp(async (app: FastifyInstance) => {
  app.register(jwt, {
    secret: "supersecret",
    cookie: {
      cookieName: "token",
      signed: false,
    },
  });
});
