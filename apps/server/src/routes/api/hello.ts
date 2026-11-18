import { Elysia, t } from 'elysia'
import { betterAuthPlugin } from '../../auth/plugin'

export const helloRoute = new Elysia({ name: 'api-hello-route' }).use(betterAuthPlugin).get(
	'/api/hello',
	({ user }) => ({
		message: 'Hello World from REST!',
		user: { id: user.id, name: user.name, email: user.email },
	}),
	{
		auth: true,
		response: t.Object({
			message: t.Literal('Hello World from REST!'),
			user: t.Object({
				id: t.String(),
				name: t.String(),
				email: t.String(),
			}),
		}),
	},
)
