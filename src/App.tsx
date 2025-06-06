import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your pages/components
import Home from "./pages/Home";
import NotFound from "./components/NotFound";
import Product from "./pages/Product";
import ProductField from "./components/Products/ProductField";
import Contact from "./pages/Contact";
import CategoryList from "./components/Category/CategoryList";
import CategoryField from "./components/Category/CategoryField";

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

             <Route path="/category" element={<CategoryList />} />
            <Route
              path="/add-category"
              element={
                <CategoryField />
              }
            />
            <Route
              path="/edit-category/:id"
              element={
                <CategoryField />
              }
            />

            
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
