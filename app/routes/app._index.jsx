import { useLoaderData } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { getDashboardMetrics } from "../services/wishlist.server";
import { hydrateProducts } from "../services/product.server";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const { shop } = session;

  const metrics = await getDashboardMetrics(shop);

  const allIds = [
    ...metrics.topProductsGroup.map(p => p.productId),
    ...metrics.recentItems.map(r => r.productId),
  ];
  const uniqueIds = [...new Set(allIds)];
  
  const productMap = await hydrateProducts(admin, uniqueIds);

  const hydratedProducts = metrics.topProductsGroup.map(p => ({
    ...p,
    product: productMap[p.productId] || null,
    count: p._count.productId,
  }));

  const hydratedRecent = metrics.recentItems.map(r => ({
    ...r,
    product: productMap[r.productId] || null,
  }));

  return {
    totalItems: metrics.totalItems,
    uniqueUsers: metrics.uniqueUsers,
    itemsWithNotes: metrics.itemsWithNotes,
    topProducts: hydratedProducts,
    recentItems: hydratedRecent,
    shop,
  };
};

const styles = `
  .dash-container { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

  /* ── Stat Cards ── */
  .stat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 28px;
  }
  .stat-card {
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 16px;
    padding: 20px 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .stat-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.08); transform: translateY(-2px); }
  .stat-icon {
    width: 52px; height: 52px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; flex-shrink: 0;
  }
  .stat-icon.red   { background: linear-gradient(135deg, #fff0f1, #ffe4e6); }
  .stat-icon.blue  { background: linear-gradient(135deg, #eff6ff, #dbeafe); }
  .stat-icon.amber { background: linear-gradient(135deg, #fffbeb, #fef3c7); }
  .stat-label { font-size: 13px; color: #888; font-weight: 500; margin-bottom: 4px; }
  .stat-value { font-size: 28px; font-weight: 800; color: #111; letter-spacing: -0.03em; line-height: 1; }

  /* ── Section Header ── */
  .section-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 16px;
  }
  .section-title {
    font-size: 16px; font-weight: 700; color: #111;
    display: flex; align-items: center; gap: 8px;
  }
  .section-badge {
    background: #f3f4f6; border-radius: 50px;
    padding: 2px 10px; font-size: 12px; font-weight: 600; color: #666;
  }

  /* ── Top Products ── */
  .products-list { display: flex; flex-direction: column; gap: 10px; }
  .product-row {
    display: flex; align-items: center; gap: 14px;
    background: #fff; border: 1px solid #f0f0f0;
    border-radius: 14px; padding: 14px 16px;
    transition: all 0.2s ease;
  }
  .product-row:hover { border-color: #e0e0e0; box-shadow: 0 4px 12px rgba(0,0,0,0.06); transform: translateX(3px); }
  .rank-badge {
    width: 32px; height: 32px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 800; flex-shrink: 0;
  }
  .rank-1 { background: linear-gradient(135deg, #FFD700, #FFA500); color: #7a4800; }
  .rank-2 { background: linear-gradient(135deg, #C0C0C0, #a8a8a8); color: #444; }
  .rank-3 { background: linear-gradient(135deg, #CD7F32, #b06a27); color: #fff; }
  .rank-other { background: #f3f4f6; color: #666; }
  .prod-thumb {
    width: 52px; height: 52px; border-radius: 10px;
    object-fit: cover; border: 1px solid #f0f0f0; flex-shrink: 0;
  }
  .prod-thumb-placeholder {
    width: 52px; height: 52px; border-radius: 10px;
    background: #f5f5f5; display: flex; align-items: center;
    justify-content: center; font-size: 20px; flex-shrink: 0;
  }
  .prod-info { flex: 1; min-width: 0; }
  .prod-name { font-size: 14px; font-weight: 600; color: #111; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .prod-count { font-size: 12px; color: #888; margin-top: 2px; }

  /* ── Bar chart ── */
  .bar-wrap { margin-top: 4px; display: flex; align-items: center; gap: 8px; }
  .bar-track { flex: 1; background: #f3f4f6; border-radius: 50px; height: 6px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 50px; background: linear-gradient(90deg, #ff4757, #ff6b81); transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); }
  .bar-label { font-size: 12px; font-weight: 700; color: #ff4757; min-width: 24px; text-align: right; }

  .view-btn {
    padding: 7px 14px; border-radius: 8px;
    background: #f3f4f6; border: none; color: #333;
    font-size: 12px; font-weight: 600; cursor: pointer;
    white-space: nowrap; transition: all 0.2s; flex-shrink: 0;
  }
  .view-btn:hover { background: #111; color: #fff; }

  /* ── Recent Activity ── */
  .activity-list { display: flex; flex-direction: column; gap: 8px; }
  .activity-row {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 14px; background: #fafafa;
    border-radius: 12px; border: 1px solid #f0f0f0;
  }
  .activity-dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; flex-shrink: 0; }
  .activity-text { font-size: 13px; color: #333; flex: 1; }
  .activity-text strong { font-weight: 600; color: #111; }
  .activity-time { font-size: 11px; color: #bbb; white-space: nowrap; }

  /* ── Tip Card ── */
  .tip-card {
    background: linear-gradient(135deg, #fff0f1, #fff8f0);
    border: 1px solid #fdd;
    border-radius: 16px;
    padding: 20px;
  }
  .tip-title { font-size: 14px; font-weight: 700; color: #c0392b; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
  .tip-text { font-size: 13px; color: #555; line-height: 1.6; }

  /* ── Empty State ── */
  .empty-state { text-align: center; padding: 40px 20px; color: #aaa; }
  .empty-state p { font-size: 14px; margin-top: 8px; }
`;

function timeAgo(date) {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return `${Math.floor(diffHrs / 24)}d ago`;
}

export default function Index() {
  const { totalItems, uniqueUsers, itemsWithNotes, topProducts, recentItems } = useLoaderData();
  const maxCount = topProducts[0]?.count || 1;

  return (
    <s-page heading="Wishlist Dashboard">
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <s-section heading="Overview">
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon red">❤️</div>
            <div>
              <div className="stat-label">Total Saved Items</div>
              <div className="stat-value">{totalItems}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue">👥</div>
            <div>
              <div className="stat-label">Unique Customers</div>
              <div className="stat-value">{uniqueUsers}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon amber">📝</div>
            <div>
              <div className="stat-label">Items with Notes</div>
              <div className="stat-value">{itemsWithNotes}</div>
            </div>
          </div>
        </div>
      </s-section>

      <s-section heading="Top 10 Wishlisted Products">
        {topProducts.length === 0 ? (
          <div className="empty-state">
            <span style={{ fontSize: 40 }}>🛍️</span>
            <p>No products wishlisted yet. Share your store to get started!</p>
          </div>
        ) : (
          <div className="products-list">
            {topProducts.map((item, index) => (
              <div className="product-row" key={item.productId}>
                <div className={`rank-badge ${index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : 'rank-other'}`}>
                  {index + 1}
                </div>
                {item.product?.featuredImage ? (
                  <img src={item.product.featuredImage.url} alt={item.product.title} className="prod-thumb" />
                ) : (
                  <div className="prod-thumb-placeholder">🛍️</div>
                )}
                <div className="prod-info">
                  <span className="prod-name">{item.product?.title || 'Unknown Product'}</span>
                  <div className="bar-wrap">
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${(item.count / maxCount) * 100}%` }} />
                    </div>
                    <span className="bar-label">{item.count}</span>
                  </div>
                  <div className="prod-count">{item.count} {item.count === 1 ? 'customer' : 'customers'} wishlisted this</div>
                </div>
                <button
                  className="view-btn"
                  onClick={() => window.open(`shopify:admin/products/${item.productId}`, '_blank')}
                >
                  View →
                </button>
              </div>
            ))}
          </div>
        )}
      </s-section>

      <s-section heading="Recent Activity">
        {recentItems.length === 0 ? (
          <div className="empty-state">
            <span style={{ fontSize: 32 }}>🕐</span>
            <p>No recent activity yet.</p>
          </div>
        ) : (
          <div className="activity-list">
            {recentItems.map((item, i) => (
              <div className="activity-row" key={i}>
                <div className="activity-dot" />
                <div className="activity-text">
                  Customer saved <strong>{item.product?.title || `Product #${item.productId}`}</strong> to their wishlist
                </div>
                <div className="activity-time">{timeAgo(item.createdAt)}</div>
              </div>
            ))}
          </div>
        )}
      </s-section>

      <s-section slot="aside" heading="💡 Merchant Tips">
        <div className="tip-card">
          <div className="tip-title">📈 Use Wishlist Data</div>
          <p className="tip-text">
            Products with high wishlist counts but low sales indicate strong interest but possible price or availability barriers.
            Consider running a targeted sale or restocking alert for these items!
          </p>
        </div>
        <br />
        <div className="tip-card">
          <div className="tip-title">🎯 Marketing Potential</div>
          <p className="tip-text">
            Customers who add notes to wishlist items (e.g., "for birthday", "size M") are high intent buyers.
            Consider sending them personalised discount emails to convert them.
          </p>
        </div>
      </s-section>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
