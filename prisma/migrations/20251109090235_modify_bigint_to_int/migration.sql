/*
  Warnings:

  - The primary key for the `agreement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `agreement_id` on the `agreement` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `area` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `area_id` on the `area` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `food_type` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `food_type_id` on the `food_type` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `mission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `mission_id` on the `mission` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `store_id` on the `mission` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `preferred_food_type` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `prefered_food_type_id` on the `preferred_food_type` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `user_id` on the `preferred_food_type` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `food_type_id` on the `preferred_food_type` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `question` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `question_id` on the `question` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `user_id` on the `question` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `questions_image` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `questions_image_id` on the `questions_image` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `question_id` on the `questions_image` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `review` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `review_id` on the `review` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `user_mission_id` on the `review` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `review_image` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `review_image_id` on the `review_image` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `review_id` on the `review_image` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `store` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `store_id` on the `store` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `area_id` on the `store` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `store_category_id` on the `store` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `store_category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `store_category_id` on the `store_category` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `store_image` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `store_image_id` on the `store_image` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `store_id` on the `store_image` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `user_id` on the `user` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `birthday` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `inactive_date` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `area_id` on the `user` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `user_agreement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `user_agreement_id` on the `user_agreement` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `user_id` on the `user_agreement` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `agreement_id` on the `user_agreement` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `user_mission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `user_mission_id` on the `user_mission` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `user_id` on the `user_mission` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `mission_id` on the `user_mission` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `mission` DROP FOREIGN KEY `mission_store_id_fkey`;

-- DropForeignKey
ALTER TABLE `preferred_food_type` DROP FOREIGN KEY `preferred_food_type_food_type_id_fkey`;

-- DropForeignKey
ALTER TABLE `preferred_food_type` DROP FOREIGN KEY `preferred_food_type_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `question` DROP FOREIGN KEY `question_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `questions_image` DROP FOREIGN KEY `questions_image_question_id_fkey`;

-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `review_user_mission_id_fkey`;

-- DropForeignKey
ALTER TABLE `review_image` DROP FOREIGN KEY `review_image_review_id_fkey`;

-- DropForeignKey
ALTER TABLE `store` DROP FOREIGN KEY `store_area_id_fkey`;

-- DropForeignKey
ALTER TABLE `store` DROP FOREIGN KEY `store_store_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `store_image` DROP FOREIGN KEY `store_image_store_id_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_area_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_agreement` DROP FOREIGN KEY `user_agreement_agreement_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_agreement` DROP FOREIGN KEY `user_agreement_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_mission` DROP FOREIGN KEY `user_mission_mission_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_mission` DROP FOREIGN KEY `user_mission_user_id_fkey`;

-- DropIndex
DROP INDEX `mission_store_id_fkey` ON `mission`;

-- DropIndex
DROP INDEX `store_area_id_fkey` ON `store`;

-- DropIndex
DROP INDEX `store_store_category_id_fkey` ON `store`;

-- DropIndex
DROP INDEX `user_area_id_fkey` ON `user`;

-- AlterTable
ALTER TABLE `agreement` DROP PRIMARY KEY,
    MODIFY `agreement_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`agreement_id`);

-- AlterTable
ALTER TABLE `area` DROP PRIMARY KEY,
    MODIFY `area_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`area_id`);

-- AlterTable
ALTER TABLE `food_type` DROP PRIMARY KEY,
    MODIFY `food_type_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`food_type_id`);

-- AlterTable
ALTER TABLE `mission` DROP PRIMARY KEY,
    MODIFY `mission_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `store_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`mission_id`);

-- AlterTable
ALTER TABLE `preferred_food_type` DROP PRIMARY KEY,
    MODIFY `prefered_food_type_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `user_id` INTEGER NOT NULL,
    MODIFY `food_type_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`prefered_food_type_id`);

-- AlterTable
ALTER TABLE `question` DROP PRIMARY KEY,
    MODIFY `question_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`question_id`);

-- AlterTable
ALTER TABLE `questions_image` DROP PRIMARY KEY,
    MODIFY `questions_image_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `question_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`questions_image_id`);

-- AlterTable
ALTER TABLE `review` DROP PRIMARY KEY,
    MODIFY `review_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `user_mission_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`review_id`);

-- AlterTable
ALTER TABLE `review_image` DROP PRIMARY KEY,
    MODIFY `review_image_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `review_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`review_image_id`);

-- AlterTable
ALTER TABLE `store` DROP PRIMARY KEY,
    MODIFY `store_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `area_id` INTEGER NULL,
    MODIFY `store_category_id` INTEGER NULL,
    ADD PRIMARY KEY (`store_id`);

-- AlterTable
ALTER TABLE `store_category` DROP PRIMARY KEY,
    MODIFY `store_category_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`store_category_id`);

-- AlterTable
ALTER TABLE `store_image` DROP PRIMARY KEY,
    MODIFY `store_image_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `store_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`store_image_id`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `birthday` DATETIME NULL,
    MODIFY `inactive_date` DATETIME NULL,
    MODIFY `area_id` INTEGER NULL,
    ADD PRIMARY KEY (`user_id`);

-- AlterTable
ALTER TABLE `user_agreement` DROP PRIMARY KEY,
    MODIFY `user_agreement_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `user_id` INTEGER NOT NULL,
    MODIFY `agreement_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`user_agreement_id`);

-- AlterTable
ALTER TABLE `user_mission` DROP PRIMARY KEY,
    MODIFY `user_mission_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `user_id` INTEGER NOT NULL,
    MODIFY `mission_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`user_mission_id`);

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
