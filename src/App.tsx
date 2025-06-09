import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages/Components
import Home from "./pages/Home";
import NotFound from "./components/NotFound";
import Product from "./pages/Product";
import ProductField from "./components/Products/ProductField";
import Contact from "./pages/Contact";
import CategoryList from "./components/Category/CategoryList";
import CategoryField from "./components/Category/CategoryField";
import LoginForm from "./components/Login/LoginForm";
import PrivateRoute from "./components/Auth/PrivateRoute";

function App() {
  return (
    <Router>
      <div className="flex">
        <div className="flex-grow py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />

            {/* Protected Routes */}
            <Route
              path="/product"
              element={
                <PrivateRoute>
                  <Product />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-product"
              element={
                <PrivateRoute>
                  <ProductField />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit-product/:id"
              element={
                <PrivateRoute>
                  <ProductField />
                </PrivateRoute>
              }
            />
            <Route
              path="/category"
              element={
                <PrivateRoute>
                  <CategoryList />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-category"
              element={
                <PrivateRoute>
                  <CategoryField />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit-category/:id"
              element={
                <PrivateRoute>
                  <CategoryField />
                </PrivateRoute>
              }
            />

            {/* Catch-all */}
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
