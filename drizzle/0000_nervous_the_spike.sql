CREATE TABLE `certifications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`resume_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`name` text NOT NULL,
	`issuer` text,
	`date` text,
	`credential_url` text,
	`order_index` integer DEFAULT 0,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`name` text NOT NULL,
	`platform` text,
	`instructor` text,
	`completion_date` text,
	`certificate_url` text,
	`skills_learned` text,
	`duration` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `education` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`resume_id` integer NOT NULL,
	`school` text,
	`degree` text,
	`field` text,
	`start_date` text,
	`end_date` text,
	`grade` text,
	`order_index` integer DEFAULT 0,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `experiences` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`resume_id` integer NOT NULL,
	`source_type` text,
	`source_id` integer,
	`company` text,
	`position` text,
	`start_date` text,
	`end_date` text,
	`current` integer DEFAULT false,
	`description` text,
	`order_index` integer DEFAULT 0,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `hackathons` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`name` text NOT NULL,
	`organizer` text,
	`date` text NOT NULL,
	`position` text,
	`project_name` text,
	`description` text,
	`technologies` text,
	`team_size` integer,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `internships` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`company` text NOT NULL,
	`position` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text,
	`current` integer DEFAULT false,
	`description` text,
	`skills_used` text,
	`location` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `personal_info` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`resume_id` integer NOT NULL,
	`full_name` text,
	`title` text,
	`email` text,
	`phone` text,
	`location` text,
	`linkedin` text,
	`website` text,
	`summary` text,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `personal_info_resume_id_unique` ON `personal_info` (`resume_id`);--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`link` text,
	`github_url` text,
	`technologies` text,
	`start_date` text,
	`end_date` text,
	`status` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `resume_skills` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`resume_id` integer NOT NULL,
	`skill_id` integer NOT NULL,
	`order_index` integer DEFAULT 0,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `resumes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`name` text NOT NULL,
	`template` text DEFAULT 'modern' NOT NULL,
	`thumbnail` text,
	`ats_score` integer,
	`last_updated` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`name` text NOT NULL,
	`category` text,
	`proficiency` text,
	`source_type` text,
	`source_id` integer,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);