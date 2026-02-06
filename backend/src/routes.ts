import { randomUUID } from 'node:crypto'
import type { FastifyTypedInstance } from '@/types/type.js'
import { z } from 'zod'

interface User {
  id: string
  name: string
  email: string
  password: string
}

const users: User[] = []

export function routes(app: FastifyTypedInstance) {
  app.get(
    '/users',
    {
      schema: {
        tags: ['User'],
        description: 'Get all users',
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              email: z.string(),
            }),
          ),
        },
      },
    },
    async () => {
      return users
    },
  )

  app.post(
    '/users',
    {
      schema: {
        tags: ['User'],
        body: z.object({
          name: z.string().min(1),
          email: z.email(),
          password: z.string().min(6),
        }),
        response: {
          201: z.null().describe('User created successfully'),
        },
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body

      users.push({
        id: randomUUID(),
        name,
        email,
        password
      })
      return reply.status(201).send(null)
    },
  )

  app.post(
  '/login',
  {
    schema: {
      tags: ['Auth'],
      description: 'User login',
      body: z.object({
        email: z.string().email(),
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
  async (request, reply) => {
    const { email, password } = request.body

    const user = users.find((u) => u.email === email)

    if (!user || user.password !== password) {
      return reply.status(401).send({
        message: 'Email ou password inválidos',
      })
    }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    },
  )

}
