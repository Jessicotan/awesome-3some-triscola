import { Elysia } from 'elysia'
import { auth } from './index'

export const betterAuthPlugin = new Elysia({ name: 'better-auth' })
	.mount(auth.handler)
	.macro({
		auth: {
			async resolve({ request: { headers }, status }) {
				const result = await auth.api.getSession({ headers })
				if (!result)
					return status(401, { message: 'Authentication required.' })

				return { user: result.user, session: result.session }
			},
		},
	})
