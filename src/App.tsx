import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your pages/components
import Home from "./pages/Home";
import NotFound from "./components/NotFound";
import Product from "./pages/Product";
import ProductField from "./components/Products/ProductField";
import Contact from "./pages/Contact";

function App() {
  return (
    <Router>
      <div className="flex">
        <div className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product" element={<Product />} />
            <Route path="/add-product" element={<ProductField />} />
            <Route path="/edit-product/:id" element={<ProductField />} />
            <Route path="/contact" element={<Contact />} />


            {/* Add more routes as needed */}
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </div>
       
      </div>
    </Router>
  );
}

export default App;
