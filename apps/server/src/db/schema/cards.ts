import { sql } from 'drizzle-orm'
import { check, integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { cardRankValues, suitValues } from './values'

export const suit = sqliteTable('suit', {
	code: text('code', { enum: suitValues }).primaryKey().notNull(),
})

export const cardRank = sqliteTable('card_rank', {
	code: text('code', { enum: cardRankValues }).primaryKey().notNull(),
	strength: integer('strength').notNull().unique(),
	points: integer('points').notNull(),
}, table => [
	check('card_rank_strength_check', sql`${table.strength} between 1 and 10`),
	check('card_rank_points_check', sql`${table.points} in (0, 2, 3, 4, 10, 11)`),
])

export const card = sqliteTable('card', {
	suitCode: text('suit_code', { enum: suitValues }).notNull().references(() => suit.code),
	rankCode: text('rank_code', { enum: cardRankValues }).notNull().references(() => cardRank.code),
}, table => [
	primaryKey({
		columns: [table.suitCode, table.rankCode],
	}),
])
