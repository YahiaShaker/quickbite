import { useState } from "react";
import BottomNav from "../components/BottomNav";
import CartItem from "../components/CartItem";
import OrangeButton from "../components/OrangeButton";
import { useCart } from "../context/CartContext";

function getPromoDiscount(promo, subtotal) {
  if (!promo) {
    return 0;
  }

  if (promo.type === "percent") {
    return subtotal * (promo.value / 100);
  }

  if (promo.type === "fixed") {
    return Math.min(promo.value, subtotal);
  }

  return 0;
}

function CartCheckout() {
  const { cartItems, clearCart, deliveryFee, removeFromCart, subtotal, updateQuantity } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [promoStatus, setPromoStatus] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [checkoutStatus, setCheckoutStatus] = useState("");

  const discount = getPromoDiscount(appliedPromo, subtotal);
  const discountedDeliveryFee = appliedPromo?.type === "free_delivery" ? 0 : deliveryFee;
  const finalTotal = Math.max(0, subtotal - discount + discountedDeliveryFee);

  async function handlePromoSubmit(event) {
    event.preventDefault();
    const enteredCode = promoCode.trim().toUpperCase();

    if (!enteredCode) {
      setAppliedPromo(null);
      setPromoMessage("Enter a promo code first.");
      setPromoStatus("error");
      return;
    }

    try {
      // Promo codes are checked by fetching a local JSON file.
      const response = await fetch("/data/promo-codes.json");

      if (!response.ok) {
        throw new Error("Promo API request failed.");
      }

      const promoCodes = await response.json();
      const foundPromo = promoCodes.find(
        (promo) => promo.code === enteredCode && promo.active
      );

      if (!foundPromo) {
        setAppliedPromo(null);
        setPromoMessage("Promo code is not valid.");
        setPromoStatus("error");
        return;
      }

      setAppliedPromo(foundPromo);
      setPromoCode(foundPromo.code);
      setPromoMessage(`${foundPromo.code} applied: ${foundPromo.label}.`);
      setPromoStatus("success");
    } catch {
      setAppliedPromo(null);
      setPromoMessage("Could not check promo codes right now.");
      setPromoStatus("error");
    }
  }

  async function handleCheckout() {
    if (cartItems.length === 0) {
      setCheckoutMessage("Add items to your cart first.");
      setCheckoutStatus("error");
      return;
    }

    const orderData = {
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      subtotal,
      deliveryFee: discountedDeliveryFee,
      discount,
      total: finalTotal,
      promoCode: appliedPromo ? appliedPromo.code : null,
      createdAt: new Date().toISOString()
    };

    try {
      setIsSubmittingOrder(true);
      setCheckoutMessage("");
      setCheckoutStatus("");

      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error("Order API request failed.");
      }

      clearCart();
      setAppliedPromo(null);
      setPromoCode("");
      setPromoMessage("");
      setPromoStatus("");
      setCheckoutMessage(`Order placed successfully.`);
      setCheckoutStatus("success");
    } catch {
      setCheckoutMessage("Could not place order. Try again.");
      setCheckoutStatus("error");
    } finally {
      setIsSubmittingOrder(false);
    }
  }

  return (
    <main className="phone-frame">
      <section className={cartItems.length === 0 ? "cart-page cart-page--empty page-content" : "cart-page page-content"}>
        <header className="brand-header">
          <h1>QuickBite</h1>
        </header>

        <h2 className="page-title">My Cart</h2>

        <div className="cart-list">
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onQuantityChange={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}
        </div>

        {cartItems.length === 0 && (
          <div className="empty-cart-card" role="status">
            <div className="empty-cart-icon">0</div>
            <h3>Your cart is empty.</h3>
            <p>Add a meal from the home page and it will appear here.</p>
          </div>
        )}

        <form className="promo-form" onSubmit={handlePromoSubmit}>
          <img src="/images/figma/icon-tag.svg" alt="" />
          <input
            type="text"
            placeholder="Add Promo Code"
            value={promoCode}
            onChange={(event) => setPromoCode(event.target.value)}
          />
          <button className="promo-chevron" type="submit" aria-label="Apply promo code" />
        </form>
        {promoMessage && (
          <p className={`promo-message promo-message--${promoStatus}`}>{promoMessage}</p>
        )}

        <section className="summary-card" aria-label="Cart total">
          <div>
            <span>Subtotal</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
          <div>
            <span>Delivery Fee</span>
            <strong>${discountedDeliveryFee.toFixed(2)}</strong>
          </div>
          {appliedPromo && discount > 0 && (
            <div className="summary-discount">
              <span>Discount</span>
              <strong>-${discount.toFixed(2)}</strong>
            </div>
          )}
          {appliedPromo?.type === "free_delivery" && (
            <div className="summary-discount">
              <span>Promo</span>
              <strong>Free delivery</strong>
            </div>
          )}
          <hr />
          <div className="summary-total">
            <span>Total</span>
            <strong>${finalTotal.toFixed(2)}</strong>
          </div>
        </section>

        <OrangeButton type="button" disabled={isSubmittingOrder} onClick={handleCheckout}>
          {isSubmittingOrder ? "Placing Order..." : "Checkout"}
        </OrangeButton>
        {checkoutMessage && (
          <p className={`checkout-message checkout-message--${checkoutStatus}`}>
            {checkoutMessage}
          </p>
        )}
      </section>

      <BottomNav />
    </main>
  );
}

export default CartCheckout;
