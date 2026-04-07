-- AlterTable
ALTER TABLE "WishlistItem" ADD COLUMN "claimedAt" DATETIME;
ALTER TABLE "WishlistItem" ADD COLUMN "claimedBy" TEXT;
ALTER TABLE "WishlistItem" ADD COLUMN "claimedName" TEXT;

-- CreateIndex
CREATE INDEX "WishlistItem_shop_userId_idx" ON "WishlistItem"("shop", "userId");
