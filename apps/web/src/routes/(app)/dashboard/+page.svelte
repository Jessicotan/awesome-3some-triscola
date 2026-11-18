<script lang='ts'>
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'
	import { api } from '$lib/api/client'
	import { authClient } from '$lib/auth/client'
	import { onDestroy } from 'svelte'

	const session = authClient.useSession()
	let restResult = $state('')
	let restError = $state('')
	let restLoading = $state(false)
	let websocketResult = $state('')
	let websocketError = $state('')
	let websocketStatus = $state<'closed' | 'connecting' | 'open'>('closed')
	let socket: ReturnType<typeof api.ws.hello.subscribe> | undefined

	async function testRest() {
		restLoading = true
		restError = ''
		restResult = ''
		const { data, error } = await api.api.hello.get()
		restLoading = false
		if (error) {
			restError = error.value?.message ?? 'The REST request failed.'
			return
		}
		restResult = data.message
	}

	function createSocket() {
		websocketStatus = 'connecting'
		websocketError = ''
		socket = api.ws.hello.subscribe()
		socket.subscribe((event) => {
			if (event.data.type === 'hello')
				websocketResult = event.data.message
		})
		socket.on('open', () => {
			websocketStatus = 'open'
		})
		socket.on('close', () => {
			websocketStatus = 'closed'
		})
		socket.on('error', () => {
			websocketStatus = 'closed'
			websocketError = 'The WebSocket connection failed or was rejected.'
		})
	}

	function testWebSocket() {
		websocketError = ''
		websocketResult = ''
		if (!socket || websocketStatus === 'closed')
			createSocket()
		const sendWhenReady = () => socket?.send({ type: 'hello' })
		if (websocketStatus === 'open')
			sendWhenReady()
		else socket?.on('open', sendWhenReady)
	}

	async function logout() {
		socket?.close()
		socket = undefined
		await authClient.signOut()
		await goto(resolve('/login'))
	}

	onDestroy(() => socket?.close())
</script>

<svelte:head><title>Dashboard | My Game</title></svelte:head>

{#if $session.data}
	<main class='min-h-screen bg-base-200 p-4 sm:p-8'>
		<section class='card mx-auto w-full max-w-4xl bg-base-100 shadow-xl'>
			<div class='card-body gap-8'>
				<div class='flex flex-col justify-between gap-4 sm:flex-row sm:items-start'>
					<div>
						<p class='text-sm font-bold tracking-[0.2em] text-primary'>MY GAME</p>
						<h1 class='mt-1 text-3xl font-bold'>My Game</h1>
						<p class='mt-1 text-base-content/70'>
							Welcome, {$session.data.user.name || $session.data.user.email}!
						</p>
					</div>
					<button class='btn btn-ghost' onclick={() => void logout()}>Logout</button>
				</div>
				<div class='flex flex-wrap gap-3'>
					<button class='btn btn-primary' onclick={() => void testRest()} disabled={restLoading}>
						{#if restLoading}
							<span class='loading loading-spinner loading-sm'></span>
						{/if}
						{restLoading ? 'Testing REST…' : 'Test REST API'}
					</button>
					<button class='btn btn-secondary' onclick={testWebSocket}>Test WebSocket</button>
				</div>
				<div class='grid gap-4 md:grid-cols-2'>
					<article class='rounded-box border border-base-300 bg-base-200/50 p-5'>
						<h2 class='text-lg font-semibold'>REST result</h2>
						{#if restLoading}
							<p class='mt-3 flex items-center gap-2 text-base-content/70'>
								<span class='loading loading-spinner loading-sm'></span>
								Contacting the server…
							</p>
						{:else if restResult}
							<div class='alert alert-success mt-3 text-sm'><span>{restResult}</span></div>
						{:else if restError}
							<div class='alert alert-error mt-3 text-sm'><span>{restError}</span></div>
						{:else}
							<p class='mt-3 text-base-content/60'>No request sent yet.</p>
						{/if}
					</article>
					<article class='rounded-box border border-base-300 bg-base-200/50 p-5'>
						<div class='flex items-center justify-between gap-3'>
							<h2 class='text-lg font-semibold'>WebSocket result</h2>
							<span
								class:badge-success={websocketStatus === 'open'}
								class:badge-warning={websocketStatus === 'connecting'}
								class='badge badge-outline'
							>
								{websocketStatus}
							</span>
						</div>
						{#if websocketResult}
							<div class='alert alert-success mt-3 text-sm'><span>{websocketResult}</span></div>
						{:else if websocketError}
							<div class='alert alert-error mt-3 text-sm'><span>{websocketError}</span></div>
						{:else}
							<p class='mt-3 text-base-content/60'>No message received yet.</p>
						{/if}
					</article>
				</div>
			</div>
		</section>
	</main>
{/if}
