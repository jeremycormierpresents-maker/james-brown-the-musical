CREATE TABLE `contact_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`subject` text NOT NULL,
	`message` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `form_rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`requests` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `rate_limits_expiry_idx` ON `form_rate_limits` (`expires_at`);--> statement-breakpoint
CREATE TABLE `information_signups` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text,
	`email` text NOT NULL,
	`consent_text` text NOT NULL,
	`consent_version` text NOT NULL,
	`consent_at` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `information_signups_email_unique` ON `information_signups` (`email`);