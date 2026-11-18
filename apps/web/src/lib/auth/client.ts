import { env } from '$lib/env'
import { createAuthClient } from 'better-auth/svelte'

export const authClient = createAuthClient({
	baseURL: env.PUBLIC_API_URL,
	fetchOptions: { credentials: 'include' },
})
