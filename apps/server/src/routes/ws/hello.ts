import { Elysia, t } from 'elysia'
import { auth } from '../../auth'
import { env } from '../../env'

const helloRequest = t.Object({
	type: t.Literal('hello'),
})
const helloResponse = t.Object({
	type: t.Literal('hello'),
	message: t.Literal('Hello World from WebSocket!'),
})

function hasAllowedOrigin(headers: Headers): boolean {
	return headers.get('origin') === env.FRONTEND_URL
}

export const helloSocket = new Elysia({ name: 'ws-hello-route' }).ws('/ws/hello', {
	body: helloRequest,
	response: helloResponse,
	async open(ws) {
		const headers = ws.data.request.headers
		if (!hasAllowedOrigin(headers) || !(await auth.api.getSession({ headers }))) {
			ws.close(1008, 'Unauthorized')
		}
	},
	async message(ws, message) {
		const headers = ws.data.request.headers
		if (!hasAllowedOrigin(headers) || !(await auth.api.getSession({ headers }))) {
			ws.close(1008, 'Unauthorized')
			return
		}

		if (message.type === 'hello')
			ws.send({ type: 'hello', message: 'Hello World from WebSocket!' })
	},
})
