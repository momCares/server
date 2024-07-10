/*
  Warnings:

  - You are about to drop the `Product_Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Store` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product_Category" DROP CONSTRAINT "Product_Category_category_id_fkey";

-- DropForeignKey
ALTER TABLE "Product_Category" DROP CONSTRAINT "Product_Category_product_id_fkey";

-- DropTable
DROP TABLE "Product_Category";

-- DropTable
DROP TABLE "Store";
