CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dealId` int NOT NULL,
	`userId` int NOT NULL,
	`flatNumber` varchar(32) NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`timeSlot` varchar(80),
	`pricePerUnit` int NOT NULL,
	`status` enum('confirmed','vendor_assigned','in_progress','completed','cancelled') NOT NULL DEFAULT 'confirmed',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bulkDeals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`societyId` int NOT NULL,
	`serviceId` int NOT NULL,
	`vendorId` int,
	`title` varchar(180) NOT NULL,
	`description` text,
	`targetBookings` int NOT NULL,
	`currentBookings` int NOT NULL DEFAULT 0,
	`normalPrice` int NOT NULL,
	`serviceDate` timestamp NOT NULL,
	`bookingDeadline` timestamp NOT NULL,
	`status` enum('draft','live','unlocked','completed','cancelled') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bulkDeals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bulkPricingTiers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dealId` int NOT NULL,
	`minimumBookings` int NOT NULL,
	`price` int NOT NULL,
	CONSTRAINT `bulkPricingTiers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(180) NOT NULL,
	`body` text NOT NULL,
	`kind` varchar(48) NOT NULL,
	`read` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookingId` int NOT NULL,
	`amount` int NOT NULL,
	`platformFee` int NOT NULL DEFAULT 0,
	`savings` int NOT NULL DEFAULT 0,
	`status` enum('mock_pending','paid','refunded') NOT NULL DEFAULT 'mock_pending',
	`paidAt` timestamp,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dealId` int NOT NULL,
	`inviterUserId` int NOT NULL,
	`inviteeContact` varchar(160) NOT NULL,
	`status` enum('sent','joined') NOT NULL DEFAULT 'sent',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `referrals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookingId` int NOT NULL,
	`vendorId` int NOT NULL,
	`userId` int NOT NULL,
	`quality` int NOT NULL,
	`professionalism` int NOT NULL,
	`punctuality` int NOT NULL,
	`valueForMoney` int NOT NULL,
	`comment` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `serviceRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`societyId` int NOT NULL,
	`createdBy` int NOT NULL,
	`requestedService` varchar(160) NOT NULL,
	`interestCount` int NOT NULL DEFAULT 1,
	`targetInterest` int NOT NULL,
	`estimatedPrice` int,
	`status` enum('collecting','converted','closed') NOT NULL DEFAULT 'collecting',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `serviceRequests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`category` varchar(80) NOT NULL,
	`icon` varchar(16),
	`active` boolean NOT NULL DEFAULT true,
	CONSTRAINT `services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `societies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`city` varchar(80) NOT NULL,
	`address` text,
	`residentCount` int NOT NULL DEFAULT 0,
	`status` enum('pending','active','suspended') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `societies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `societyMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`societyId` int NOT NULL,
	`userId` int NOT NULL,
	`flatNumber` varchar(32),
	`memberRole` enum('resident','secretary') NOT NULL DEFAULT 'resident',
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `societyMembers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `supportTickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`bookingId` int,
	`category` varchar(80) NOT NULL,
	`subject` varchar(180) NOT NULL,
	`description` text NOT NULL,
	`status` enum('open','in_review','resolved') NOT NULL DEFAULT 'open',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `supportTickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vendorQuotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dealId` int NOT NULL,
	`vendorId` int NOT NULL,
	`pricePerService` int NOT NULL,
	`warranty` varchar(120),
	`completionMinutes` int,
	`availableDate` timestamp,
	`score` decimal(5,2),
	`status` enum('submitted','shortlisted','selected','declined') NOT NULL DEFAULT 'submitted',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vendorQuotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vendors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`businessName` varchar(160) NOT NULL,
	`city` varchar(80) NOT NULL,
	`rating` decimal(3,2) NOT NULL DEFAULT '0.00',
	`servicesCompleted` int NOT NULL DEFAULT 0,
	`yearsExperience` int NOT NULL DEFAULT 0,
	`verified` boolean NOT NULL DEFAULT false,
	`onTimeRate` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vendors_id` PRIMARY KEY(`id`)
);
