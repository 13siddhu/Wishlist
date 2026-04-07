# 🎁 Shopify Wishlist - Premium App Experience

Welcome to the **Shopify Wishlist App**! This isn't just a simple "Saved" button—it’s a fully polished, merchant-ready tool designed to help customers save what they love and help shop owners sell more.

---

### 🤔 Why this Wishlist?
I built this app with a **"Merchant-First"** mindset. Most wishlist apps are basic, but this one focuses on **Conversion** and **UX**:
*   **Move to Cart**: Don't just save an item—buy it! Users can add products directly from their wishlist to the cart in one click.
*   **Shareable Registry**: Users can send a link to friends or family (perfect for birthdays or holidays).
*   **Personal Notes**: "Gift for Dad," "Size M for summer"—users can add private context to their saved products.
*   **Merchant Analytics**: Shop owners see exactly what's trending and what's being saved the most.

---

### 🚀 High-End Engineering
Under the hood, I used a **Service-Oriented Architecture (SOA)**. I decoupled the business logic from the routes into dedicated `WishlistService` and `ProductService` layers. This makes the code:
*   **Scalable**: Easy to add new features without breaking existing ones.
*   **Maintainable**: Logic is isolated and easy to test.
*   **Performant**: Uses optimized GraphQL queries and background syncing.

---

### 📖 For Evaluators
I have prepared a detailed **[SUBMISSION.md](./SUBMISSION.md)** file which contains:
1.  **A Full Feature Breakdown** (with screenshots).
2.  **Architectural Design Decisions** (why I built it this way).
3.  **Setup Instructions** for local development.
4.  **Technical Highlights** like App Proxy routing and Optimistic UI.

---

### 🛠️ Quick Start
1.  `npm install`
2.  `npx prisma migrate dev`
3.  `npm run dev`

---

*Thank you for taking the time to evaluate my project! I put a lot of effort into making this feel like a premium, production-ready Shopify App.*
