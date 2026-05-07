import { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import FoodCard from "../components/FoodCard";

const categories = ["Pizza", "Burgers", "Drinks", "Desserts"];

function Home() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Products are loaded from a local JSON file to show API-style fetching.
    fetch("/data/products.json")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  const searchText = searchTerm.trim().toLowerCase();
  const shownProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchText) ||
      product.description.toLowerCase().includes(searchText);
    const matchesCategory = !selectedCategory || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  function handleSearchSubmit(event) {
    event.preventDefault();
  }

  function handleCategoryClick(category) {
    setSelectedCategory((previousCategory) =>
      previousCategory === category ? null : category
    );
  }

  return (
    <main className="phone-frame">
      <section className="home-page page-content">
        <header className="brand-header">
          <h1>QuickBite</h1>
        </header>

        <div className="delivery-copy">
          <strong>Hi, Mazen</strong>
          <span>
            Deliver to <b>Apartment</b> <img src="/images/figma/icon-location.svg" alt="" />
          </span>
        </div>

        <form className="search-form" onSubmit={handleSearchSubmit}>
          <img src="/images/figma/icon-search.svg" alt="" />
          <input
            className="form-control"
            type="search"
            placeholder="Search meals, drinks, desserts"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </form>

        <div className="category-row" aria-label="Food categories">
          {categories.map((category) => (
            <button
              className={selectedCategory === category ? "category-chip category-chip--active" : "category-chip"}
              key={category}
              type="button"
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <section className="popular-section">
          <h2>Popular Now</h2>
          <div className="food-grid">
            {shownProducts.map((product) => (
              <FoodCard key={product.id} product={product} />
            ))}
          </div>

          {shownProducts.length === 0 && <p className="empty-copy">No meals match your search.</p>}
        </section>
      </section>

      <BottomNav />
    </main>
  );
}

export default Home;
