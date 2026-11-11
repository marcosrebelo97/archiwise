-- DropForeignKey
ALTER TABLE `Document` DROP FOREIGN KEY `Document_categoryId_fkey`;

-- DropIndex
DROP INDEX `Document_categoryId_fkey` ON `Document`;

-- AlterTable
ALTER TABLE `Document` ADD COLUMN `filePreviewPath` VARCHAR(255) NULL,
    MODIFY `categoryId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
