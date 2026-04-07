-- CreateTable
CREATE TABLE "WishlistItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "WishlistItem_shop_productId_idx" ON "WishlistItem"("shop", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "WishlistItem_shop_productId_userId_key" ON "WishlistItem"("shop", "productId", "userId");
