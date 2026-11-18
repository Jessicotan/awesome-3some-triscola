import { env } from '$lib/env'

interface SessionPayload { session?: unknown | null }

function hasSession(payload: unknown): payload is SessionPayload & { session: unknown } {
	return typeof payload === 'object' && payload !== null && 'session' in payload && payload.session !== null
}

export async function hasAuthenticatedSession(request: Request): Promise<boolean> {
	const cookie = request.headers.get('cookie')

	try {
		const response = await fetch(new URL('/api/auth/get-session', env.PUBLIC_API_URL), {
			headers: cookie
				? { cookie }
				: {},
			cache: 'no-store',
		})

		if (!response.ok)
			return false
		return hasSession(await response.json())
	}
	catch {
		return false
	}
}
