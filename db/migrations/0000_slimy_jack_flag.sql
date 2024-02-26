CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`accountId` text NOT NULL,
	`displayName` text NOT NULL,
	`googleProfileId` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_id_unique` ON `users` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_accountId_unique` ON `users` (`accountId`);