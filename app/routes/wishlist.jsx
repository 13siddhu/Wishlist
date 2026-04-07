import { useEffect, useState } from "react";

export default function Wishlist() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("wishlist_user");

    fetch(`/apps/api/wishlist?userId=${userId}`)
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  return (
    <div>
      <h1>Your Wishlist</h1>
      {items.map((item, i) => (
        <div key={i}>{item.productId}</div>
      ))}
    </div>
  );
}