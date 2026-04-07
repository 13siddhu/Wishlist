
import { authenticate } from "../shopify.server";
import { 
  addOrUpdateWishlistItem, 
  removeWishlistItem, 
  updateWishlistNote, 
  checkItemInWishlist, 
  getUserWishlistItems 
} from "../services/wishlist.server";
import { hydrateProducts } from "../services/product.server";

export async function action({ request }) {
  try {
    // Clone request before reading body since appProxy may need to read it
    const { session } = await authenticate.public.appProxy(request);
    if (!session) {
      console.warn("[Wishlist] appProxy returned no session");
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { shop } = session;
    console.log("[Wishlist] Session shop:", shop);

    const body = await request.json();
    const { productId, userId, action: userAction, note } = body;
    console.log("Wishlist Action:", { productId, userId, userAction, note, shop });

    if (!productId || !userId || !userAction) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (request.method === "POST" && userAction === "ADD") {
      const item = await addOrUpdateWishlistItem({ shop, productId, userId, note });
      return Response.json({ success: true, item });
    } else if (request.method === "POST" && userAction === "REMOVE") {
      await removeWishlistItem({ shop, productId, userId });
      return Response.json({ success: true });
    } else if (request.method === "PATCH") {
      await updateWishlistNote({ shop, productId, userId, note });
      return Response.json({ success: true });
    }

    return Response.json({ error: "Invalid method/action" }, { status: 400 });
  } catch (error) {
    console.error("[Wishlist] UNHANDLED action error:", error.message, "\n", error.stack);
    return Response.json({ error: "Server error", msg: error.message }, { status: 500 });
  }
}

export async function loader({ request }) {
  const { session, admin } = await authenticate.public.appProxy(request);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { shop } = session;

  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  const checkProductId = url.searchParams.get("checkProductId");

  if (!userId) {
    return Response.json({ error: "Missing userId" }, { status: 400 });
  }

  // Quick check for single product (used by the button on PDP)
  if (checkProductId) {
    const inWishlist = await checkItemInWishlist({ shop, userId, productId: checkProductId });
    return Response.json({ inWishlist });
  }

  // Fetch all items for user
  const items = await getUserWishlistItems({ shop, userId });

  // Hydrate product details via Admin API Service
  let hydratedItems = items;
  if (items.length > 0 && admin) {
    const productIds = items.map(item => item.productId);
    const productMap = await hydrateProducts(admin, productIds);
    
    hydratedItems = items.map(item => ({
      ...item,
      product: productMap[item.productId] || null,
    }));
  }

  return Response.json(hydratedItems);
}