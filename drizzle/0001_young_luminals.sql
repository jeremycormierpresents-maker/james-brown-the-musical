CREATE TABLE `audition_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`location` text NOT NULL,
	`disciplines` text NOT NULL,
	`productions` text NOT NULL,
	`experience` text,
	`video_url` text,
	`headshot_key` text NOT NULL,
	`headshot_name` text NOT NULL,
	`headshot_type` text NOT NULL,
	`headshot_size` integer NOT NULL,
	`resume_key` text NOT NULL,
	`resume_name` text NOT NULL,
	`resume_type` text NOT NULL,
	`resume_size` integer NOT NULL,
	`payload_hash` text NOT NULL,
	`consent_text` text NOT NULL,
	`consent_version` text NOT NULL,
	`consent_at` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `audition_created_at_idx` ON `audition_submissions` (`created_at`);