# 🛍️ Shopify Wishlist - Assessment Submission

This project is a high-performance, feature-rich Wishlist app built for the Shopify ecosystem. I’ve designed it to be more than just a "save" button—it's a tool for driving conversion and merchant growth.

---

## 🚀 How I Met the Requirements

### 1. The Core Experience
*   **Smart "Heart" Button**: Placed on every product page. It uses **"Pulse" animations** and **particle effects** to make saving an item feel rewarding.
*   **The Command Center**: A beautiful, responsive grid at `/pages/my-wishlist` where users manage their items, add notes, and move products to their cart.

### 2. Solving for Logged-Out Users (The "Guest" Problem)
*   **The Problem**: Many users browse without logging in. How do we keep their wishlist?
*   **My Solution**: I implemented a **Guest-First Architecture**.
    *   The app generates a secure, unique `Wishlist ID` saved in the browser's local storage.
    *   This ID is synced with our database, so the wishlist persists even if they refresh or come back days later.
    *   **Cross-Device Support**: By using our "Social Sharing" feature, a user can send their link to their phone and access their wishlist instantly without needing an account.

### 3. Data & Performance (Speed & Scale)
*   **Storage**: I used **Prisma with SQLite** for its speed and reliability. 
*   **Performance**: To make the app feel "instant," I implemented **Optimistic UI**. This means when a user clicks "Save," the UI updates immediately while the server syncs in the background. No waiting for spinning loaders!
*   **Admin Efficiency**: On the merchant dashboard, I use **Batched GraphQL queries** to fetch data for all products at once, reducing the number of requests to Shopify.

### 4. Observability & Testing
*   **Validation**: Every user action is validated both on the frontend (browser) and the backend (server) to prevent data corruption.
*   **Error Awareness**: I've implemented meaningful error messages (e.g., "Product out of stock") so users never feel stuck.
*   **Clean Code**: I refactored the app into a **Service-Oriented Architecture**. This makes it incredibly easy to write unit tests for the business logic (Wishlist and Product services) without worrying about the Shopify routes.

---

## ✨ Bonus Features (Making it Stand Out)

### 📈 Merchant Analytics Dashboard
Shop owners get a "Command Center" in their admin panel. It shows:
*   **Top Wishlisted Products**: A visual bar chart of what’s trending.
*   **Engagement Badges**: Gold/Silver/Bronze tiers for top products.
*   **Live Activity Feed**: Real-time insight into customer desires.

### 📝 Personal Shopping Notes
Users can add "Notes" to their items (e.g., "Buy for anniversary"). This adds a personal touch found only in premium apps.

### 🛒 One-Click "Move to Cart"
The #1 request from merchants. Instead of just saving a product, users can add it directly to their cart from the wishlist, drastically increasing the chance of a sale.

---

## 📸 Final Results (Screenshots)
1.  **./screenshots/pdp-button.png**: The animated "Pulse" button.
2.  **./screenshots/wishlist-grid.png**: The full wishlist experience.
3.  **./screenshots/note-ui.png**: The personal notes feature.
4.  **./screenshots/added-to-cart.png**: The conversion to cart in action.
5.  **./screenshots/admin-dashboard.png**: The merchant insights panel.

---

**Thank you for reviewing my work! I aimed to build an app that isn't just "functional" but feels like a professional product a merchant would actually pay for.**

