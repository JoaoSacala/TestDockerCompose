import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import ScalarApiReference from '@scalar/fastify-api-reference'
import { routes } from '@/routes.js'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
  origin: 'https://test-docker-compose-five.vercel.app',
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'My API',
      description: 'API documentation',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docsSwagger',
})


app.register(ScalarApiReference, {
  routePrefix: '/docsScalar',
})

app.register(routes)

const PORT = process.env.PORT || 3333;

app.listen({ port: Number(PORT), host: '0.0.0.0' }).then(() => {
  console.log(`HTTP Server is running on port ${PORT}`)
  console.log(`Swagger docs available at port ${PORT}/docsSwagger`)
  console.log(`Scalar API Reference docs available at port ${PORT}/docsScalar`)
})

