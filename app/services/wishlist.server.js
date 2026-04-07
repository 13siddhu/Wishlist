import prisma from "../db.server";

export async function addOrUpdateWishlistItem({ shop, productId, userId, note }) {
  return await prisma.wishlistItem.upsert({
    where: { shop_productId_userId: { shop, productId: String(productId), userId: String(userId) } },
    update: { note: note || null },
    create: { shop, productId: String(productId), userId: String(userId), note: note || null },
  });
}

export async function removeWishlistItem({ shop, productId, userId }) {
  return await prisma.wishlistItem.deleteMany({
    where: { shop, productId: String(productId), userId: String(userId) },
  });
}

export async function updateWishlistNote({ shop, productId, userId, note }) {
  return await prisma.wishlistItem.updateMany({
    where: { shop, productId: String(productId), userId: String(userId) },
    data: { note: note || null },
  });
}

export async function checkItemInWishlist({ shop, userId, productId }) {
  const item = await prisma.wishlistItem.findFirst({
    where: { shop, userId, productId: String(productId) }
  });
  return !!item;
}

export async function getUserWishlistItems({ shop, userId }) {
  return await prisma.wishlistItem.findMany({
    where: { shop, userId },
    orderBy: { createdAt: "desc" },
  });
}

// Admin Dashboard metrics
export async function getDashboardMetrics(shop) {
  const totalItems = await prisma.wishlistItem.count({ where: { shop } });
  
  const uniqueUsersGroup = await prisma.wishlistItem.groupBy({
    by: ['userId'],
    where: { shop },
  });
  const uniqueUsers = uniqueUsersGroup.length;
  
  const itemsWithNotes = await prisma.wishlistItem.count({
    where: { shop, note: { not: null } },
  });
  
  const recentItems = await prisma.wishlistItem.findMany({
    where: { shop },
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { productId: true, userId: true, createdAt: true },
  });

  const topProductsGroup = await prisma.wishlistItem.groupBy({
    by: ['productId'],
    where: { shop },
    _count: { productId: true },
    orderBy: { _count: { productId: 'desc' } },
    take: 10,
  });

  return {
    totalItems,
    uniqueUsers,
    itemsWithNotes,
    recentItems,
    topProductsGroup
  };
}
