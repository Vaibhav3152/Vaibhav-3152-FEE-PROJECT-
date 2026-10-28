import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// PROTECTED ROUTE: wrap a page with this. Nobody logged in? Show a
// "please log in" message instead of the page.
export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="center">
        <h2>Please log in</h2>
        <p className="hint">The dashboard is private.</p>
        <Link to="/register/login" className="btn btn--primary">Log in</Link>
      </div>
    );
  }

  return children;
}
