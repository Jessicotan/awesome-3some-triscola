import { sql } from 'drizzle-orm'
import { check, foreignKey, index, integer, primaryKey, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { user } from './auth'
import { card } from './cards'
import { room } from './rooms'
import { cardRankValues, GameStatus, gameStatusValues, suitValues } from './values'

export const gameStatus = sqliteTable('game_status', {
	code: text('code', { enum: gameStatusValues }).primaryKey().notNull(),
})

export const game = sqliteTable('game', {
	id: text('id').primaryKey().notNull(),
	roomId: text('room_id').notNull().references(() => room.id),
	statusCode: text('status_code', { enum: gameStatusValues }).notNull().default(GameStatus.Setup).references(() => gameStatus.code),
	createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
	startedAt: integer('started_at', { mode: 'timestamp_ms' }),
	endedAt: integer('ended_at', { mode: 'timestamp_ms' }),
}, table => [
	check('game_start_after_creation', sql`${table.startedAt} is null or ${table.startedAt} >= ${table.createdAt}`),
	check('game_end_after_start', sql`${table.endedAt} is null or (${table.endedAt} >= ${table.createdAt} and (${table.startedAt} is null or ${table.endedAt} >= ${table.startedAt}))`),
	check('game_status_times', sql`(${table.statusCode} = 'setup' and ${table.startedAt} is null and ${table.endedAt} is null) or (${table.statusCode} = 'playing' and ${table.startedAt} is not null and ${table.endedAt} is null) or (${table.statusCode} = 'finished' and ${table.startedAt} is not null and ${table.endedAt} is not null) or (${table.statusCode} = 'abandoned' and ${table.endedAt} is not null)`),
	index('game_room_created_at_idx').on(table.roomId, table.createdAt),
	uniqueIndex('game_one_active_per_room_idx').on(table.roomId).where(sql`${table.statusCode} in ('setup', 'playing')`),
])

export const gamePlayer = sqliteTable('game_player', {
	gameId: text('game_id').notNull().references(() => game.id),
	seat: integer('seat').notNull(),
	userId: text('user_id').references(() => user.id),
}, table => [
	primaryKey({
		columns: [table.gameId, table.seat],
	}),
	uniqueIndex('game_player_user_idx').on(table.gameId, table.userId),
	check('game_player_seat_check', sql`${table.seat} between 1 and 4`),
])

export const gameCard = sqliteTable('game_card', {
	gameId: text('game_id').notNull().references(() => game.id),
	suitCode: text('suit_code', { enum: suitValues }).notNull(),
	rankCode: text('rank_code', { enum: cardRankValues }).notNull(),
	deckPosition: integer('deck_position').notNull(),
	dealtToSeat: integer('dealt_to_seat'),
}, table => [
	primaryKey({
		columns: [table.gameId, table.suitCode, table.rankCode],
	}),
	uniqueIndex('game_card_position_idx').on(table.gameId, table.deckPosition),
	uniqueIndex('game_card_owner_idx').on(table.gameId, table.suitCode, table.rankCode, table.dealtToSeat),
	foreignKey({
		columns: [table.suitCode, table.rankCode],
		foreignColumns: [card.suitCode, card.rankCode],
	}),
	foreignKey({
		columns: [table.gameId, table.dealtToSeat],
		foreignColumns: [gamePlayer.gameId, gamePlayer.seat],
	}),
	check('game_card_position_check', sql`${table.deckPosition} between 1 and 40`),
	check('game_card_seat_check', sql`${table.dealtToSeat} between 1 and 4`),
])

export const trick = sqliteTable('trick', {
	gameId: text('game_id').notNull().references(() => game.id),
	number: integer('number').notNull(),
}, table => [
	primaryKey({
		columns: [table.gameId, table.number],
	}),
	check('trick_number_check', sql`${table.number} between 1 and 20`),
])

export const play = sqliteTable('play', {
	gameId: text('game_id').notNull(),
	trickNumber: integer('trick_number').notNull(),
	playOrder: integer('play_order').notNull(),
	seat: integer('seat').notNull(),
	suitCode: text('suit_code', { enum: suitValues }).notNull(),
	rankCode: text('rank_code', { enum: cardRankValues }).notNull(),
}, table => [
	primaryKey({
		columns: [table.gameId, table.trickNumber, table.playOrder],
	}),
	uniqueIndex('play_trick_seat_idx').on(table.gameId, table.trickNumber, table.seat),
	uniqueIndex('play_card_idx').on(table.gameId, table.suitCode, table.rankCode),
	foreignKey({
		columns: [table.gameId, table.trickNumber],
		foreignColumns: [trick.gameId, trick.number],
	}),
	foreignKey({
		columns: [
			table.gameId,
			table.suitCode,
			table.rankCode,
			table.seat,
		],
		foreignColumns: [
			gameCard.gameId,
			gameCard.suitCode,
			gameCard.rankCode,
			gameCard.dealtToSeat,
		],
	}),
	check('play_order_check', sql`${table.playOrder} between 1 and 4`),
	check('play_seat_check', sql`${table.seat} between 1 and 4`),
])
