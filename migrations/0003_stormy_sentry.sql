CREATE TABLE `auth_tokens` (
	`identifier` text PRIMARY KEY NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL
);
