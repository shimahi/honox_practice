CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`content` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE users ADD `createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE users ADD `updatedAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `posts_id_unique` ON `posts` (`id`);