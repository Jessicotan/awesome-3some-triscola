import process from 'node:process'
import { migrate } from 'drizzle-orm/bun-sqlite/migrator'
import { db } from './index'

async function runMigrations() {
	await migrate(db, { migrationsFolder: './drizzle' })
	process.stdout.write('Database migrations applied.\n')
}

void runMigrations().catch((error: unknown) => {
	console.error(error)
	process.exitCode = 1
})
