<script lang='ts'>
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'
	import { authClient } from '$lib/auth/client'

	let name = $state('')
	let email = $state('')
	let password = $state('')
	let confirmPassword = $state('')
	let error = $state('')
	let submitting = $state(false)

	async function register() {
		error = ''
		if (password !== confirmPassword) {
			error = 'Passwords do not match.'
			return
		}
		submitting = true
		const result = await authClient.signUp.email({ name, email, password })
		submitting = false
		if (result.error) {
			error = result.error.message ?? 'Unable to create your account.'
			return
		}
		await goto(resolve('/dashboard'))
	}

	function submit(event: SubmitEvent) {
		event.preventDefault()
		void register()
	}
</script>

<svelte:head><title>Create account | My Game</title></svelte:head>

<main class='grid min-h-screen place-items-center bg-base-200 p-6'>
	<section class='card w-full max-w-md bg-base-100 shadow-xl'>
		<div class='card-body'>
			<p class='text-sm font-bold tracking-[0.2em] text-primary'>MY GAME</p>
			<h1 class='card-title text-3xl'>Create your account</h1>
			<p class='text-base-content/70'>Start with a player profile for the future game.</p>
			<form class='mt-2 grid gap-4' onsubmit={submit}>
				<label class='form-control w-full'>
					<span class='label-text mb-1 font-medium'>Name</span>
					<input
						class='input input-bordered w-full'
						bind:value={name}
						autocomplete='name'
						required
						minlength='2'
					/>
				</label>
				<label class='form-control w-full'>
					<span class='label-text mb-1 font-medium'>Email</span>
					<input
						class='input input-bordered w-full'
						type='email'
						bind:value={email}
						autocomplete='email'
						required
					/>
				</label>
				<label class='form-control w-full'>
					<span class='label-text mb-1 font-medium'>Password</span>
					<input
						class='input input-bordered w-full'
						type='password'
						bind:value={password}
						autocomplete='new-password'
						required
						minlength='8'
					/>
				</label>
				<label class='form-control w-full'>
					<span class='label-text mb-1 font-medium'>Confirm password</span>
					<input
						class='input input-bordered w-full'
						type='password'
						bind:value={confirmPassword}
						autocomplete='new-password'
						required
						minlength='8'
					/>
				</label>
				{#if error}<div class='alert alert-error text-sm' role='alert'><span>{error}</span></div>{/if}
				<button class='btn btn-primary w-full' type='submit' disabled={submitting}>{#if submitting}<span class='loading loading-spinner loading-sm'></span>{/if}{submitting ? 'Creating account…' : 'Create account'}</button>
			</form>
			<p class='text-center text-sm text-base-content/70'>Already have an account? <a class='link link-primary font-medium' href={resolve('/login')}>Sign in</a></p>
		</div>
	</section>
</main>
