CREATE TABLE `card` (
	`suit_code` text NOT NULL,
	`rank_code` text NOT NULL,
	PRIMARY KEY(`suit_code`, `rank_code`),
	FOREIGN KEY (`suit_code`) REFERENCES `suit`(`code`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`rank_code`) REFERENCES `card_rank`(`code`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `card_rank` (
	`code` text PRIMARY KEY NOT NULL,
	`strength` integer NOT NULL,
	`points` integer NOT NULL,
	CONSTRAINT "card_rank_strength_check" CHECK("card_rank"."strength" between 1 and 10),
	CONSTRAINT "card_rank_points_check" CHECK("card_rank"."points" in (0, 2, 3, 4, 10, 11))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `card_rank_strength_unique` ON `card_rank` (`strength`);--> statement-breakpoint
CREATE TABLE `suit` (
	`code` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `room` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`status_code` text DEFAULT 'waiting' NOT NULL,
	`created_by` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`status_code`) REFERENCES `room_status`(`code`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "room_name_check" CHECK(length(trim("room"."name")) between 1 and 100)
);
--> statement-breakpoint
CREATE TABLE `room_member` (
	`room_id` text NOT NULL,
	`user_id` text NOT NULL,
	`joined_at` integer NOT NULL,
	PRIMARY KEY(`room_id`, `user_id`),
	FOREIGN KEY (`room_id`) REFERENCES `room`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `room_member_user_id_idx` ON `room_member` (`user_id`);--> statement-breakpoint
CREATE TABLE `room_status` (
	`code` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `game` (
	`id` text PRIMARY KEY NOT NULL,
	`room_id` text NOT NULL,
	`status_code` text DEFAULT 'setup' NOT NULL,
	`created_at` integer NOT NULL,
	`started_at` integer,
	`ended_at` integer,
	FOREIGN KEY (`room_id`) REFERENCES `room`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`status_code`) REFERENCES `game_status`(`code`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "game_start_after_creation" CHECK("game"."started_at" is null or "game"."started_at" >= "game"."created_at"),
	CONSTRAINT "game_end_after_start" CHECK("game"."ended_at" is null or ("game"."ended_at" >= "game"."created_at" and ("game"."started_at" is null or "game"."ended_at" >= "game"."started_at"))),
	CONSTRAINT "game_status_times" CHECK(("game"."status_code" = 'setup' and "game"."started_at" is null and "game"."ended_at" is null) or ("game"."status_code" = 'playing' and "game"."started_at" is not null and "game"."ended_at" is null) or ("game"."status_code" = 'finished' and "game"."started_at" is not null and "game"."ended_at" is not null) or ("game"."status_code" = 'abandoned' and "game"."ended_at" is not null))
);
--> statement-breakpoint
CREATE INDEX `game_room_created_at_idx` ON `game` (`room_id`,`created_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `game_one_active_per_room_idx` ON `game` (`room_id`) WHERE "game"."status_code" in ('setup', 'playing');--> statement-breakpoint
CREATE TABLE `game_card` (
	`game_id` text NOT NULL,
	`suit_code` text NOT NULL,
	`rank_code` text NOT NULL,
	`deck_position` integer NOT NULL,
	`dealt_to_seat` integer,
	PRIMARY KEY(`game_id`, `suit_code`, `rank_code`),
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`suit_code`,`rank_code`) REFERENCES `card`(`suit_code`,`rank_code`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`game_id`,`dealt_to_seat`) REFERENCES `game_player`(`game_id`,`seat`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "game_card_position_check" CHECK("game_card"."deck_position" between 1 and 40),
	CONSTRAINT "game_card_seat_check" CHECK("game_card"."dealt_to_seat" between 1 and 4)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `game_card_position_idx` ON `game_card` (`game_id`,`deck_position`);--> statement-breakpoint
CREATE UNIQUE INDEX `game_card_owner_idx` ON `game_card` (`game_id`,`suit_code`,`rank_code`,`dealt_to_seat`);--> statement-breakpoint
CREATE TABLE `game_player` (
	`game_id` text NOT NULL,
	`seat` integer NOT NULL,
	`user_id` text,
	PRIMARY KEY(`game_id`, `seat`),
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "game_player_seat_check" CHECK("game_player"."seat" between 1 and 4)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `game_player_user_idx` ON `game_player` (`game_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `game_status` (
	`code` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `play` (
	`game_id` text NOT NULL,
	`trick_number` integer NOT NULL,
	`play_order` integer NOT NULL,
	`seat` integer NOT NULL,
	`suit_code` text NOT NULL,
	`rank_code` text NOT NULL,
	PRIMARY KEY(`game_id`, `trick_number`, `play_order`),
	FOREIGN KEY (`game_id`,`trick_number`) REFERENCES `trick`(`game_id`,`number`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`game_id`,`suit_code`,`rank_code`,`seat`) REFERENCES `game_card`(`game_id`,`suit_code`,`rank_code`,`dealt_to_seat`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "play_order_check" CHECK("play"."play_order" between 1 and 4),
	CONSTRAINT "play_seat_check" CHECK("play"."seat" between 1 and 4)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `play_trick_seat_idx` ON `play` (`game_id`,`trick_number`,`seat`);--> statement-breakpoint
CREATE UNIQUE INDEX `play_card_idx` ON `play` (`game_id`,`suit_code`,`rank_code`);--> statement-breakpoint
CREATE TABLE `trick` (
	`game_id` text NOT NULL,
	`number` integer NOT NULL,
	PRIMARY KEY(`game_id`, `number`),
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "trick_number_check" CHECK("trick"."number" between 1 and 20)
);
