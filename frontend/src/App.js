import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Contact from "./pages/Contact";
import "./App.css";

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname === "/admin";

  return (
    <div className="app-container">
      <Navbar />
      <main className={`main-content ${isAdmin ? "main-admin" : ""}`}>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
