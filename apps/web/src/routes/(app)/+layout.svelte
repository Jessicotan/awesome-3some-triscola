<script lang='ts'>
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'
	import { authClient } from '$lib/auth/client'

	const { children } = $props()
	const session = authClient.useSession()

	$effect(() => {
		if (!$session.isPending && !$session.data)
			void goto(resolve('/login'))
	})
</script>

{#if $session.isPending}
	<main class='grid min-h-screen place-items-center bg-base-200 p-6'>
		<span class='loading loading-spinner loading-lg' aria-label='Loading your dashboard'></span>
	</main>
{:else if $session.data}
	{@render children()}
{/if}
