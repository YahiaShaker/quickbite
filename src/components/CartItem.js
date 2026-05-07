import QuantitySelector from "./QuantitySelector";

function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <article className="cart-item">
      <img src={item.cartImage || item.image} alt={item.name} />

      <div className="cart-item__content">
        <div className="cart-item__top">
          <div>
            <h4>{item.name}</h4>
            <p>{item.description}</p>
          </div>
          <button className="delete-button" type="button" aria-label={`Remove ${item.name}`} onClick={() => onRemove(item.id)}>
            <img src="/images/figma/icon-trash.svg" alt="" />
          </button>
        </div>

        <span className="rating">
          <img src="/images/figma/icon-star.svg" alt="" />
          {item.rating}
        </span>

        <div className="cart-item__bottom">
          <QuantitySelector compact value={item.quantity} onChange={(quantity) => onQuantityChange(item.id, quantity)} />
          <strong>${(item.price * item.quantity).toFixed(2)}</strong>
        </div>
      </div>
    </article>
  );
}

export default CartItem;
