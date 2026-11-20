INSERT OR IGNORE INTO `room_status` (`code`) VALUES ('waiting'), ('playing'), ('closed');
--> statement-breakpoint
INSERT OR IGNORE INTO `game_status` (`code`) VALUES ('setup'), ('playing'), ('finished'), ('abandoned');
--> statement-breakpoint
INSERT OR IGNORE INTO `suit` (`code`) VALUES ('coins'), ('cups'), ('swords'), ('batons');
--> statement-breakpoint
INSERT OR IGNORE INTO `card_rank` (`code`, `strength`, `points`) VALUES
  ('two', 1, 0), ('four', 2, 0), ('five', 3, 0), ('six', 4, 0), ('seven', 5, 0),
  ('jack', 6, 2), ('knight', 7, 3), ('king', 8, 4), ('three', 9, 10), ('ace', 10, 11);
--> statement-breakpoint
INSERT OR IGNORE INTO `card` (`suit_code`, `rank_code`)
SELECT `suit`.`code`, `card_rank`.`code` FROM `suit` CROSS JOIN `card_rank`;
