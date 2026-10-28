import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProductStore, PRODUCTS_PER_PAGE } from "../store/productStore.js";
import { useCartStore, getTotalItems } from "../store/cartStore.js";
import { useToast } from "../context/ToastContext.jsx";
import { useDebounce } from "../hooks/useDebounce.js";
import { prettyCategory } from "../utils/api.js";
import Dropdown from "../components/ui/Dropdown.jsx";
import Modal from "../components/ui/Modal.jsx";
import Pagination from "../components/ui/Pagination.jsx";
import { LoadingMessage, ErrorMessage, EmptyMessage } from "../components/ui/StatusMessage.jsx";

const sortOptions = [
  { label: "Default order", sortBy: "", order: "asc" },
  { label: "Price: low to high", sortBy: "price", order: "asc" },
  { label: "Price: high to low", sortBy: "price", order: "desc" },
  { label: "Title: A to Z", sortBy: "title", order: "asc" },
];

// SHOP: search, filter, sort and pagination all happen on the SERVER (the API)
// local state = what the user chose, global state = products + cart (Zustand)
export default function ShopPage() {
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("");
  const [sortIndex, setSortIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [quickView, setQuickView] = useState(null);

  const { products, totalProducts, categories, loading, error, fetchProducts, fetchCategories } = useProductStore();
  const addItem = useCartStore((state) => state.addItem);
  const cartCount = useCartStore((state) => getTotalItems(state.items));
  const { showToast } = useToast();

  // DEBOUNCE: wait until the user stopped typing before asking the API
  const search = useDebounce(searchText.trim(), 500);
  const sort = sortOptions[sortIndex];

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const loadProducts = () => fetchProducts({ search, category, sortBy: sort.sortBy, order: sort.order, page });

  useEffect(() => {
    fetchProducts({ search, category, sortBy: sort.sortBy, order: sort.order, page });
  }, [search, category, sort, page, fetchProducts]);

  // whenever a filter changes we go back to page 1
  const changeFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const addToCart = (product) => {
    addItem(product);
    showToast(product.title + " added to cart", "success");
  };

  const sortItems = sortOptions.map((option, index) => ({
    label: option.label,
    isActive: index === sortIndex,
    onClick: () => changeFilter(setSortIndex)(index),
  }));

  return (
    <div>
      <div className="heading-row">
        <h1>Shop</h1>
        <Link to="/shop/cart" className="btn">&#128722; Cart ({cartCount})</Link>
      </div>

      <div className="toolbar">
        <div className="field toolbar__grow">
          <label htmlFor="shop-search">Search products</label>
          <input
            id="shop-search"
            type="search"
            className="input"
            placeholder="phone, laptop, mascara..."
            value={searchText}
            onChange={(e) => changeFilter(setSearchText)(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="shop-category">Category</label>
          <select
            id="shop-category"
            className="input"
            value={category}
            disabled={search !== ""}
            onChange={(e) => changeFilter(setCategory)(e.target.value)}
          >
            <option value="">All</option>
            {categories.map((slug) => (
              <option key={slug} value={slug}>{prettyCategory(slug)}</option>
            ))}
          </select>
        </div>

        <Dropdown buttonText={"Sort: " + sort.label} items={sortItems} align="right" />
      </div>

      {search !== "" && <p className="hint">Category filter is paused while searching.</p>}

      {loading && <LoadingMessage text="Loading products..." />}
      {error && <ErrorMessage message={error} onRetry={loadProducts} />}
      {!loading && !error && products.length === 0 && <EmptyMessage text="No products found." />}

      {!error && (
        <div className="card-grid">
          {products.map((product) => (
            <article key={product.id} className="card">
              <img src={product.thumbnail} alt={product.title} loading="lazy" className="card__image" />
              <span className="tag">{prettyCategory(product.category)}</span>
              <h3>{product.title}</h3>
              <p className="price">${product.price.toFixed(2)}</p>
              <div className="row">
                <button type="button" className="btn btn--primary btn--sm" onClick={() => addToCart(product)}>
                  Add to cart
                </button>
                <button type="button" className="btn btn--sm" onClick={() => setQuickView(product)}>
                  Quick view
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={Math.ceil(totalProducts / PRODUCTS_PER_PAGE)} onPageChange={setPage} />

      <Modal title={quickView ? quickView.title : ""} isOpen={quickView !== null} onClose={() => setQuickView(null)}>
        {quickView && (
          <div>
            <img src={quickView.thumbnail} alt={quickView.title} className="card__image" />
            <p>{quickView.description}</p>
            <p className="hint">Rating {quickView.rating} / 5 &middot; {quickView.stock} in stock</p>
            <p className="price">${quickView.price.toFixed(2)}</p>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => {
                addToCart(quickView);
                setQuickView(null);
              }}
            >
              Add to cart
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
