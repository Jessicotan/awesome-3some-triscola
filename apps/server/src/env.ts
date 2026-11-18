import process from 'node:process'
import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().min(1).default('./game.db'),
		BETTER_AUTH_URL: z.url().default('http://localhost:3000'),
		BETTER_AUTH_SECRET: z.string().min(32, 'BETTER_AUTH_SECRET must contain at least 32 characters.'),
		FRONTEND_URL: z.url().default('http://localhost:5173'),
		PORT: z.coerce.number().int().min(1).max(65_535).default(3000),
	},
	runtimeEnvStrict: {
		DATABASE_URL: process.env.DATABASE_URL,
		BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		FRONTEND_URL: process.env.FRONTEND_URL,
		PORT: process.env.PORT,
	},
	emptyStringAsUndefined: true,
})
