import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { fastify } from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { userRoutes } from "@/routes/user.routes.js";
import { Authenticate } from "./modules/user/auth/middlware/ensure-auth.middleware.js";
import fastifyCookie, { FastifyCookieOptions } from "@fastify/cookie";
import jwtPlugin from "./plugins/jwt.js";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: "*",
  credentials: true,
});

app.register(jwtPlugin);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "My API",
      description: "API documentation",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docsSwagger",
});

app.register(ScalarApiReference, {
  routePrefix: "/docsScalar",
});

app.decorate("authenticate", Authenticate.handle);
app.register(fastifyCookie, {
  secret: "my-secret",
  hook: "onRequest",
  parseOptions: {},
} as FastifyCookieOptions);

app.register(userRoutes);

app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("HTTP Server is running on http://localhost:3333");
  console.log("Swagger docs available at http://localhost:3333/docsSwagger");
  console.log(
    "Scalar API Reference docs available at http://localhost:3333/docsScalar",
  );
});
