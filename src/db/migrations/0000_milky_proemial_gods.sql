CREATE TABLE `employees` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`contract_type` text NOT NULL,
	`fixed_salary` real NOT NULL,
	`commission_percent` real NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `inventory` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`material` text NOT NULL,
	`unit` text NOT NULL,
	`quantity` real NOT NULL,
	`minimum` real NOT NULL,
	`price_per_unit` real NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`employee_id` integer NOT NULL,
	`created_at` text NOT NULL,
	`deadline` text NOT NULL,
	`value` real NOT NULL,
	`description` text NOT NULL,
	`steps` text NOT NULL,
	`current_step_index` integer NOT NULL,
	`status` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`company_name` text NOT NULL,
	`company_phone` text NOT NULL,
	`monthly_revenue_goal` real NOT NULL,
	`default_commission_percent` real NOT NULL,
	`alert_low_inventory` integer NOT NULL,
	`alert_deadline_approaching` integer NOT NULL,
	`alert_pending_payment` integer NOT NULL,
	`alert_weekly_financial_summary` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`description` text NOT NULL,
	`type` text NOT NULL,
	`category` text,
	`date` text NOT NULL,
	`value` real NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
