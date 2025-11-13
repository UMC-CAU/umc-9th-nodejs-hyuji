-- CreateTable
CREATE TABLE `user` (
    `user_id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(10) NULL,
    `email` VARCHAR(20) NULL,
    `password` VARCHAR(100) NOT NULL,
    `nickname` VARCHAR(10) NULL,
    `gender` VARCHAR(10) NULL,
    `birthday` DATETIME NULL,
    `address` TEXT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `inactive_date` DATETIME NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,
    `phone` VARCHAR(20) NULL,
    `provider` VARCHAR(10) NULL,
    `area_id` BIGINT NULL,
    `phone_verified` ENUM('Y', 'N') NOT NULL DEFAULT 'N',

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `area` (
    `area_id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,

    PRIMARY KEY (`area_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `store_category` (
    `store_category_id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,

    PRIMARY KEY (`store_category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `store` (
    `store_id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `area_id` BIGINT NULL,
    `store_category_id` BIGINT NULL,
    `address` VARCHAR(255) NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,

    PRIMARY KEY (`store_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mission` (
    `mission_id` BIGINT NOT NULL AUTO_INCREMENT,
    `store_id` BIGINT NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `body` TEXT NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,

    PRIMARY KEY (`mission_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_mission` (
    `user_mission_id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `mission_id` BIGINT NOT NULL,
    `status` ENUM('ASSIGNED', 'IN_PROGRESS', 'DONE') NOT NULL DEFAULT 'ASSIGNED',
    `end_date` DATETIME(6) NULL,
    `reward` INTEGER NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,

    INDEX `user_mission_user_id_idx`(`user_id`),
    INDEX `user_mission_mission_id_idx`(`mission_id`),
    PRIMARY KEY (`user_mission_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review` (
    `review_id` BIGINT NOT NULL AUTO_INCREMENT,
    `body` TEXT NOT NULL,
    `score` INTEGER NOT NULL,
    `user_mission_id` BIGINT NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,

    UNIQUE INDEX `review_user_mission_id_key`(`user_mission_id`),
    PRIMARY KEY (`review_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review_image` (
    `review_image_id` BIGINT NOT NULL AUTO_INCREMENT,
    `picture_url` VARCHAR(255) NOT NULL,
    `review_id` BIGINT NOT NULL,

    INDEX `review_image_review_id_idx`(`review_id`),
    PRIMARY KEY (`review_image_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `food_type` (
    `food_type_id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(10) NULL,

    PRIMARY KEY (`food_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `preferred_food_type` (
    `prefered_food_type_id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `food_type_id` BIGINT NOT NULL,

    INDEX `preferred_food_type_user_id_idx`(`user_id`),
    INDEX `preferred_food_type_food_type_id_idx`(`food_type_id`),
    PRIMARY KEY (`prefered_food_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `agreement` (
    `agreement_id` BIGINT NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(50) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `version` VARCHAR(20) NULL,
    `is_required` ENUM('Y', 'N') NOT NULL DEFAULT 'Y',
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,

    UNIQUE INDEX `agreement_code_key`(`code`),
    PRIMARY KEY (`agreement_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_agreement` (
    `user_agreement_id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `agreement_id` BIGINT NOT NULL,
    `agreed` ENUM('Y', 'N') NOT NULL DEFAULT 'Y',
    `agreed_at` DATETIME(6) NOT NULL,

    INDEX `user_agreement_user_id_idx`(`user_id`),
    INDEX `user_agreement_agreement_id_idx`(`agreement_id`),
    UNIQUE INDEX `user_agreement_user_id_agreement_id_key`(`user_id`, `agreement_id`),
    PRIMARY KEY (`user_agreement_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `question` (
    `question_id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `body` TEXT NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,

    INDEX `question_user_id_idx`(`user_id`),
    PRIMARY KEY (`question_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `store_image` (
    `store_image_id` BIGINT NOT NULL AUTO_INCREMENT,
    `store_id` BIGINT NOT NULL,
    `picture_url` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,

    INDEX `store_image_store_id_idx`(`store_id`),
    PRIMARY KEY (`store_image_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `questions_image` (
    `questions_image_id` BIGINT NOT NULL AUTO_INCREMENT,
    `question_id` BIGINT NOT NULL,
    `picture_url` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,

    INDEX `questions_image_question_id_idx`(`question_id`),
    PRIMARY KEY (`questions_image_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_area_id_fkey` FOREIGN KEY (`area_id`) REFERENCES `area`(`area_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `store` ADD CONSTRAINT `store_area_id_fkey` FOREIGN KEY (`area_id`) REFERENCES `area`(`area_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `store` ADD CONSTRAINT `store_store_category_id_fkey` FOREIGN KEY (`store_category_id`) REFERENCES `store_category`(`store_category_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mission` ADD CONSTRAINT `mission_store_id_fkey` FOREIGN KEY (`store_id`) REFERENCES `store`(`store_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_mission` ADD CONSTRAINT `user_mission_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_mission` ADD CONSTRAINT `user_mission_mission_id_fkey` FOREIGN KEY (`mission_id`) REFERENCES `mission`(`mission_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_user_mission_id_fkey` FOREIGN KEY (`user_mission_id`) REFERENCES `user_mission`(`user_mission_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review_image` ADD CONSTRAINT `review_image_review_id_fkey` FOREIGN KEY (`review_id`) REFERENCES `review`(`review_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `preferred_food_type` ADD CONSTRAINT `preferred_food_type_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `preferred_food_type` ADD CONSTRAINT `preferred_food_type_food_type_id_fkey` FOREIGN KEY (`food_type_id`) REFERENCES `food_type`(`food_type_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_agreement` ADD CONSTRAINT `user_agreement_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_agreement` ADD CONSTRAINT `user_agreement_agreement_id_fkey` FOREIGN KEY (`agreement_id`) REFERENCES `agreement`(`agreement_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `question` ADD CONSTRAINT `question_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `store_image` ADD CONSTRAINT `store_image_store_id_fkey` FOREIGN KEY (`store_id`) REFERENCES `store`(`store_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `questions_image` ADD CONSTRAINT `questions_image_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `question`(`question_id`) ON DELETE CASCADE ON UPDATE CASCADE;
