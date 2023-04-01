import type { FastifyInstance } from 'fastify'
import type { Services } from './services'

type AppServices = Services

export type Application = AppServices
export type WebApplication = FastifyInstance & AppServices
