ALTER TABLE `audition_submissions` ADD `city` text NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE `audition_submissions` ADD `state` text;--> statement-breakpoint
ALTER TABLE `audition_submissions` ADD `country` text NOT NULL DEFAULT '';--> statement-breakpoint
-- Backfill existing rows: text before the first comma -> city, the rest -> state. Country was never collected, so it stays blank.
UPDATE `audition_submissions` SET
	`city` = trim(CASE WHEN instr(`location`, ',') = 0 THEN `location` ELSE substr(`location`, 1, instr(`location`, ',') - 1) END),
	`state` = CASE WHEN instr(`location`, ',') = 0 THEN NULL ELSE nullif(trim(substr(`location`, instr(`location`, ',') + 1)), '') END;
