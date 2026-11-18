import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'
import { betterAuthPlugin } from './auth/plugin'
import { env } from './env'
import { apiRoutes } from './routes/api'
import { socketRoutes } from './routes/ws'

export const app = new Elysia()
	.use(
		cors({
			origin: env.FRONTEND_URL,
			credentials: true,
			methods: ['GET', 'POST', 'OPTIONS'],
			allowedHeaders: ['Content-Type', 'Authorization'],
		}),
	)
	.use(betterAuthPlugin)
	.use(apiRoutes)
	.use(socketRoutes)
	.get('/health', () => ({ ok: true }))

export type App = typeof app
