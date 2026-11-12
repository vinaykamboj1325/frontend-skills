import { useEffect, useState } from 'react';
import './ProductDetails.css';

interface Details {
  id: string;
  name: string;
  descriptionHtml: string;
  stock: number;
  reviews: { author: string; text: string }[];
}

export default function ProductDetails({ productId, onClose }: { productId: string; onClose: () => void }) {
  const [details, setDetails] = useState<Details | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    fetch('/api/products/' + productId)
      .then((r) => r.json())
      .then((d: any) => setDetails(d));
  }, []);

  useEffect(() => {
    setInterval(() => setNow(Date.now()), 1000);
  }, []);

  if (!details) return <div>Loading…</div>;

  return (
    <div className="details">
      <div className="close" onClick={onClose}>
        ✕
      </div>
      <h3>{details.name}</h3>
      <div dangerouslySetInnerHTML={{ __html: details.descriptionHtml }} />
      {details.stock && <p className="stock">{details.stock} in stock</p>}
      {details.reviews.map((review, i) => (
        <div key={i} className="review">
          <b>{review.author}</b>
          <p>{review.text}</p>
        </div>
      ))}
      <p className="updated">Updated {new Date(now).toLocaleTimeString()}</p>
    </div>
  );
}
