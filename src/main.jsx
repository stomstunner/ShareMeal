import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Home from "./pages/page.jsx";
import Explore from "./pages/explore/page.jsx";
import Login from "./pages/login/page.jsx";
import Register from "./pages/register/page.jsx";
import Donate from "./pages/donate/page.jsx";
import Onboarding from "./pages/onboarding/page.jsx";
import Dashboard from "./pages/dashboard/page.jsx";
import Requests from "./pages/requests/page.jsx";
import Admin from "./pages/admin/page.jsx";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./styles/globals.css";

function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("sharemeal_token", token);
      try {
        const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
        window.history.replaceState({}, "", payload.role ? "/" : "/onboarding/role");
      } catch {
        window.history.replaceState({}, "", "/");
      }
      setPath(window.location.pathname);
    }
    const updatePath = () => setPath(window.location.pathname);
    window.addEventListener("popstate", updatePath);
    return () => window.removeEventListener("popstate", updatePath);
  }, []);

  const Page = path === "/explore" ? Explore : path === "/login" ? Login : path === "/register" ? Register : path === "/donate" ? Donate : path === "/onboarding/role" ? Onboarding : path === "/dashboard" ? Dashboard : path === "/requests" ? Requests : path === "/admin" ? Admin : Home;
  return <><Navbar /><main><Page /></main><Footer /></>;
}

createRoot(document.getElementById("root")).render(
  <StrictMode><App /></StrictMode>
);
