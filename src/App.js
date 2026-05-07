import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles/App.css";
import { CartProvider } from "./context/CartContext";
import CartCheckout from "./pages/CartCheckout";
import Home from "./pages/Home";
import ItemDetails from "./pages/ItemDetails";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/cart" element={<CartCheckout />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
