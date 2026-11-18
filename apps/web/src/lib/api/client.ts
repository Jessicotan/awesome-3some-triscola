import type { App } from '@my-game/server'
import { env } from '$lib/env'
import { treaty } from '@elysia/eden'

export const api = treaty<App>(env.PUBLIC_API_URL, {
	fetch: { credentials: 'include' },
})
