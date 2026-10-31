ALTER TABLE `audition_submissions` ADD `first_name` text NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE `audition_submissions` ADD `middle_name` text;--> statement-breakpoint
ALTER TABLE `audition_submissions` ADD `last_name` text NOT NULL DEFAULT '';--> statement-breakpoint
-- Backfill existing rows: first word -> first_name, last word -> last_name, anything between -> middle_name.
UPDATE `audition_submissions` SET
	`first_name` = substr(trim(`name`), 1, instr(trim(`name`) || ' ', ' ') - 1),
	`last_name` = CASE WHEN instr(trim(`name`), ' ') = 0 THEN '' ELSE substr(trim(`name`), length(rtrim(trim(`name`), replace(trim(`name`), ' ', ''))) + 1) END,
	`middle_name` = CASE WHEN instr(trim(`name`), ' ') = 0 THEN NULL ELSE nullif(trim(substr(rtrim(trim(`name`), replace(trim(`name`), ' ', '')), instr(trim(`name`), ' ') + 1)), '') END;
