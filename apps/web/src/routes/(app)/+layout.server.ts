import type { LayoutServerLoad } from './$types'
import { hasAuthenticatedSession } from '$lib/server/session'
import { redirect } from '@sveltejs/kit'

export const load: LayoutServerLoad = async ({ request }) => {
	if (!(await hasAuthenticatedSession(request)))
		redirect(303, '/login')
}
