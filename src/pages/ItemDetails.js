import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import OrangeButton from "../components/OrangeButton";
import QuantitySelector from "../components/QuantitySelector";
import { useCart } from "../context/CartContext";

function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch("/data/products.json")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  const product = products.find((item) => item.id === Number(id));

  function handleAddToCart() {
    if (!product) {
      return;
    }

    addToCart(product, quantity, []);
    navigate("/cart");
  }

  if (!product) {
    return (
      <main className="phone-frame">
        <section className="page-content details-page details-page--loading">
          <Link className="back-button" to="/" aria-label="Back to home">
            <img src="/images/figma/icon-back.svg" alt="" />
          </Link>
          <p>Loading item details...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="phone-frame details-frame">
      <section className="details-page">
        <div className="details-hero">
          <Link className="back-button" to="/" aria-label="Back to home">
            <img src="/images/figma/icon-back.svg" alt="" />
          </Link>
          <img src={product.heroImage || product.image} alt={product.name} />
        </div>

        <div className="details-panel">
          <h1>{product.name}</h1>

          <div className="details-rating">
            <span className="rating">
              <img src="/images/figma/icon-star.svg" alt="" />
              {product.rating}
            </span>
            <strong>${(product.detailsPrice || product.price).toFixed(2)}</strong>
          </div>

          <p className="details-description">{product.description}</p>

          <div className="details-divider" />

          <div className="details-row">
            <h2>Quantity</h2>
            <QuantitySelector value={quantity} onChange={setQuantity} />
          </div>

          <OrangeButton type="button" onClick={handleAddToCart}>
            Add to Cart
          </OrangeButton>
        </div>
      </section>
    </main>
  );
}

export default ItemDetails;
