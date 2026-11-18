import type { PageServerLoad } from './$types'
import { hasAuthenticatedSession } from '$lib/server/session'
import { redirect } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ request }) => {
	redirect(303, (await hasAuthenticatedSession(request))
		? '/dashboard'
		: '/login')
}
