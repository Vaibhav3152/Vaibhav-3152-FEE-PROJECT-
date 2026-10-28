import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// shown on the register and login pages when somebody is already logged in
export default function LoggedInNotice() {
  const { user, logout } = useAuth();

  return (
    <div className="center">
      <h2>You are logged in</h2>
      <p>{user.fullName} ({user.email})</p>
      <div className="row row--center">
        <Link to="/dashboard" className="btn btn--primary">Open dashboard</Link>
        <button type="button" className="btn" onClick={logout}>Log out</button>
      </div>
    </div>
  );
}
