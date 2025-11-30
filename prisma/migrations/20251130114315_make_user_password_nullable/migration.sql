/*
  Warnings:

  - The primary key for the `preferred_food_type` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `prefered_food_type_id` on the `preferred_food_type` table. All the data in the column will be lost.
  - You are about to alter the column `birthday` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `inactive_date` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `preferred_food_type_id` to the `preferred_food_type` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `preferred_food_type` DROP PRIMARY KEY,
    DROP COLUMN `prefered_food_type_id`,
    ADD COLUMN `preferred_food_type_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`preferred_food_type_id`);

-- AlterTable
ALTER TABLE `user` MODIFY `password` VARCHAR(100) NULL,
    MODIFY `birthday` DATETIME NULL,
    MODIFY `inactive_date` DATETIME NULL;
