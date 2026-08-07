ALTER TABLE `employees` ADD `password` text DEFAULT '123456' NOT NULL;--> statement-breakpoint
ALTER TABLE `settings` ADD `manager_password` text DEFAULT 'admin123' NOT NULL;