import antfu from '@antfu/eslint-config'

export default antfu({
	svelte: true,
	typescript: true,
	stylistic: {
		indent: 'tab',
	},
}, {
	ignores: [
		'**/.svelte-kit/**',
		'**/dist/**',
		'**/drizzle/**',
	],
}, {
	rules: {
		'style/max-len': [
			'error',
			{
				code: 120,
				ignoreStrings: true,
				ignoreTemplateLiterals: true,
				ignoreUrls: true,
			},
		],
	},
})
