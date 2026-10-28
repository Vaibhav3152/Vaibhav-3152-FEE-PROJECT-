import { Routes, Route, Link } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import MoviesPage from "./pages/MoviesPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

function NotFound() {
  return (
    <div className="center">
      <h2>404 - page not found</h2>
      <p className="hint">That address does not exist in this app.</p>
      <Link to="/" className="btn">Back to the desktop</Link>
    </div>
  );
}

// THE ROUTE MAP. Every app window shows ONE page from this map.
// `path` is the address that window is currently on, so two windows can
// show two different pages at the same time.
//
//  /shop  /shop/cart              shopping mini project
//  /movies                        movie search mini project
//  /register  /register/login     forms mini project
//  /dashboard                     protected, needs a login
//  anything else                  404
export default function AppRoutes({ path }) {
  return (
    <Routes location={path}>
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/shop/cart" element={<CartPage />} />
      <Route path="/movies" element={<MoviesPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register/login" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
