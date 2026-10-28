import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCartStore, getTotalItems, getTotalPrice } from "../store/cartStore.js";
import { useWatchlistStore } from "../store/watchlistStore.js";
import Tabs from "../components/ui/Tabs.jsx";
import ProductManager from "../components/ProductManager.jsx";

// DASHBOARD MINI PROJECT (a protected route, see AppRoutes.jsx)
//  Overview = numbers read from the Zustand stores (global state)
//  Products = CRUD with a REST API
//  Profile  = data from the AuthContext
export default function DashboardPage() {
  const { user, logout } = useAuth();
  const items = useCartStore((state) => state.items);
  const watchlistCount = useWatchlistStore((state) => state.movies.length);

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      content: (
        <div>
          <div className="card-grid">
            <div className="card"><span className="hint">Items in cart</span><div className="big">{getTotalItems(items)}</div></div>
            <div className="card"><span className="hint">Cart value</span><div className="big">${getTotalPrice(items).toFixed(2)}</div></div>
            <div className="card"><span className="hint">Saved movies</span><div className="big">{watchlistCount}</div></div>
          </div>
          <p className="hint">These numbers update live when you use the <Link to="/shop">Shop</Link> or <Link to="/movies">Movies</Link> apps.</p>
        </div>
      ),
    },
    { id: "products", label: "Products (CRUD)", content: <ProductManager /> },
    {
      id: "profile",
      label: "Profile",
      content: (
        <div className="card narrow">
          <p><strong>Name:</strong> {user.fullName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Age:</strong> {user.age}</p>
          <button type="button" className="btn btn--danger" onClick={logout}>Log out</button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1>Hello, {user.fullName.split(" ")[0]}</h1>
      <Tabs tabs={tabs} />
    </div>
  );
}
