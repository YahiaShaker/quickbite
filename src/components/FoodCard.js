import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

function FoodCard({ product }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const pricePillStyle = { backgroundColor: "#ff5c16", color: "#fff" };

  useEffect(() => {
    if (!isAdded) {
      return undefined;
    }

    const timerId = window.setTimeout(() => setIsAdded(false), 1200);
    return () => window.clearTimeout(timerId);
  }, [isAdded]);

  function handleQuickAdd(event) {
    event.preventDefault();
    addToCart(product, 1, []);
    setIsAdded(true);
  }

  return (
    <article className="food-card">
      <Link className="food-card__image-link" to={`/item/${product.id}`}>
        <img src={product.image} alt={product.name} />
        <button
          className={isAdded ? "quick-add quick-add--added" : "quick-add"}
          type="button"
          aria-label={isAdded ? `${product.name} added` : `Add ${product.name}`}
          onClick={handleQuickAdd}
        />
      </Link>

      <Link className="food-card__title" to={`/item/${product.id}`}>
        <h4>{product.name}</h4>
      </Link>
      <p>{product.description}</p>

      <div className="card-bottom">
        <span className="rating">
          <img src="/images/figma/icon-star.svg" alt="" />
          {product.rating}
        </span>
        <strong style={pricePillStyle}>${product.price.toFixed(2)}</strong>
      </div>
    </article>
  );
}

export default FoodCard;
