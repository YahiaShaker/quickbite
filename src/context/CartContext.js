import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const DELIVERY_FEE = 0.99;
const STORAGE_KEY = "quickbite-cart-v3";

const starterCart = [
  {
    id: 2,
    name: "Margherita Pizza",
    category: "Pizza",
    description: "Tomato, basil, mozzarella.",
    price: 9.99,
    rating: 4.7,
    image: "/images/pizza.jpg",
    heroImage: "/images/pizza.jpg",
    cartImage: "/images/pizza.jpg",
    quantity: 1,
    extras: []
  },
  {
    id: 1,
    name: "Cheeseburger",
    category: "Burgers",
    description: "Double cheeseburger with lettuce, cheese, pickles and buffalo sauce.",
    price: 8.99,
    detailsPrice: 9.99,
    rating: 4.8,
    image: "/images/burger.png",
    heroImage: "/images/burger.png",
    cartImage: "/images/burger.png",
    quantity: 1,
    extras: []
  }
];

function getInitialCart() {
  try {
    const savedCart = window.localStorage.getItem(STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : starterCart;
  } catch {
    return starterCart;
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(getInitialCart);

  useEffect(() => {
    // Save the cart so it stays after refreshing the page.
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  function addToCart(product, quantity = 1, extras = []) {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                extras
              }
            : item
        );
      }

      return [...currentItems, { ...product, quantity, extras }];
    });
  }

  function updateQuantity(productId, quantity) {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  }

  function removeFromCart(productId) {
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== productId));
  }

  function clearCart() {
    setCartItems([]);
  }

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const deliveryFee = cartItems.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    total
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
