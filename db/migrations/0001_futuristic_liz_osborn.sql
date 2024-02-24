ALTER TABLE `users` RENAME COLUMN `name` TO `displayName`;--> statement-breakpoint
ALTER TABLE users ADD `googleProfileId` text;
