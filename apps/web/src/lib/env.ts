import { env as runtimeEnv } from '$env/dynamic/public'
import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
	clientPrefix: 'PUBLIC_',
	client: {
		PUBLIC_API_URL: z.url().default('http://localhost:3000'),
	},
	runtimeEnvStrict: {
		PUBLIC_API_URL: runtimeEnv.PUBLIC_API_URL,
	},
	emptyStringAsUndefined: true,
})
