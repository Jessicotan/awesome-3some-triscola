import { sql } from 'drizzle-orm'
import { check, index, integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { user } from './auth'
import { RoomStatus, roomStatusValues } from './values'

export const roomStatus = sqliteTable('room_status', {
	code: text('code', { enum: roomStatusValues }).primaryKey().notNull(),
})

export const room = sqliteTable('room', {
	id: text('id').primaryKey().notNull(),
	name: text('name').notNull(),
	statusCode: text('status_code', { enum: roomStatusValues }).notNull().default(RoomStatus.Waiting).references(() => roomStatus.code),
	createdBy: text('created_by').notNull().references(() => user.id),
	createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
}, table => [
	check('room_name_check', sql`length(trim(${table.name})) between 1 and 100`),
])

export const roomMember = sqliteTable('room_member', {
	roomId: text('room_id').notNull().references(() => room.id),
	userId: text('user_id').notNull().references(() => user.id),
	joinedAt: integer('joined_at', { mode: 'timestamp_ms' }).notNull(),
}, table => [
	primaryKey({
		columns: [table.roomId, table.userId],
	}),
	index('room_member_user_id_idx').on(table.userId),
])
