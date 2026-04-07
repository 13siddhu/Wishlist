export async function hydrateProducts(admin, productIds) {
  if (!productIds || productIds.length === 0) {
    return {};
  }

  const ids = productIds.map(id => `gid://shopify/Product/${id}`);
  
  try {
    const response = await admin.graphql(`
      query getProducts($ids: [ID!]!) {
        nodes(ids: $ids) {
          ... on Product {
            id
            title
            handle
            featuredImage {
              url
              altText
            }
            variants(first: 1) {
              nodes {
                id
              }
            }
            priceRangeV2 {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    `, {
      variables: { ids }
    });

    const responseJson = await response.json();
    const data = responseJson.data;

    const productMap = {};
    if (data && data.nodes) {
      data.nodes.forEach(node => {
        if (node) {
          const pid = node.id.split("/").pop();
          productMap[pid] = node;
        }
      });
    }
    
    return productMap;
  } catch (err) {
    console.error("Failed to fetch product details from Shopify API", err);
    return {};
  }
}
