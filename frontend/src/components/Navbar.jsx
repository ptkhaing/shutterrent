import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);

      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setIsAdmin(payload.isAdmin || false);
        } catch (e) {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    window.addEventListener("storage", checkToken);
    const interval = setInterval(checkToken, 500);
    checkToken(); // Run once on mount

    return () => {
      window.removeEventListener("storage", checkToken);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/login");
  };

  return (
    <nav className="w-full px-6 py-4 bg-ink-900 dark:bg-ink-950 text-ink-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sticky top-0 z-40">
      <Link
        to="/"
        className="font-display text-2xl tracking-tight text-white hover:text-amber-300 transition-colors duration-200"
      >
        ShutterRent
      </Link>

      <div className="flex flex-wrap items-center justify-start sm:justify-end gap-x-6 gap-y-2 text-sm font-medium">
        <button
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="flex items-center justify-center h-8 w-8 rounded-full text-ink-200 hover:text-amber-300 hover:bg-ink-800 transition-colors duration-200"
        >
          {theme === "dark" ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
              <circle cx="12" cy="12" r="4" />
              <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
            </svg>
          )}
        </button>

        <Link to="/" className="text-ink-200 hover:text-amber-300 transition-colors duration-200">Home</Link>

        {!isAdmin && (
          <>
            <Link to="/listings" className="text-ink-200 hover:text-amber-300 transition-colors duration-200">Browse</Link>
            <Link to="/about" className="text-ink-200 hover:text-amber-300 transition-colors duration-200">About Us</Link>
          </>
        )}

        {isLoggedIn ? (
          <>
            {isAdmin ? (
              <>
                <Link to="/admin" className="text-ink-200 hover:text-amber-300 transition-colors duration-200">Dashboard</Link>
                <Link to="/admin-profile" className="text-ink-200 hover:text-amber-300 transition-colors duration-200">Profile</Link>
              </>
            ) : (
              <>
                <Link to="/orders" className="text-ink-200 hover:text-amber-300 transition-colors duration-200">Order History</Link>
                <Link to="/profile" className="text-ink-200 hover:text-amber-300 transition-colors duration-200">Profile</Link>
              </>
            )}
            <button
              onClick={handleLogout}
              className="rounded-full border border-ink-600 px-4 py-1.5 text-ink-200 hover:border-amber-400 hover:text-amber-300 transition-colors duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-ink-200 hover:text-amber-300 transition-colors duration-200">Login</Link>
            <Link
              to="/register"
              className="rounded-full bg-amber-400 px-4 py-1.5 text-ink-900 font-semibold hover:bg-amber-300 transition-colors duration-200"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;