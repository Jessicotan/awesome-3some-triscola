import { describe, expect, test } from 'bun:test'
import { app } from './app'

describe('application security baseline', () => {
	test('health endpoint is available', async () => {
		const response = await app.handle(new Request('http://localhost:3000/health'))
		expect(response.status).toBe(200)
		expect(await response.json()).toEqual({ ok: true })
	})

	test('REST hello rejects requests without a Better Auth session', async () => {
		const response = await app.handle(new Request('http://localhost:3000/api/hello'))
		expect(response.status).toBe(401)
	})
})
