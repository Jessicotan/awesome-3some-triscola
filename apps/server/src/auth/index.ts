import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { betterAuth } from 'better-auth'
import { db } from '../db'
import * as schema from '../db/schema'
import { env } from '../env'

export const auth = betterAuth({
	baseURL: env.BETTER_AUTH_URL,
	secret: env.BETTER_AUTH_SECRET,
	trustedOrigins: [env.FRONTEND_URL],
	database: drizzleAdapter(db, { provider: 'sqlite', schema }),
	emailAndPassword: { enabled: true },
	advanced: {
		defaultCookieAttributes: {
			httpOnly: true,
			secure: env.BETTER_AUTH_URL.startsWith('https://'),
			sameSite: 'lax',
		},
	},
})
