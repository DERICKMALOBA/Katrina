import { Navigate, Outlet } from "react-router-dom";

// Function to check authentication status
const isAuthenticated = () => {
  return localStorage.getItem("adminToken"); // Example: Checking if a token exists
};

// Private Route Component
const PrivateRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/sign-in" replace />;
};

export default PrivateRoute;



import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"; 
import Sidebar from "./AdminComponents/Sidebar";
import Header from "./AdminComponents/AdminHeader";
import OverviewPage from "./AdminPages/OverviewPage";
import ProductPage from "./AdminPages/Product";
import Customers from "./AdminPages/Customers";
import SalesPage from "./AdminPages/SalesPage";
import OrdersPage from "./AdminPages/OrdersPage";
import OffersPage from "./AdminPages/Offers";
import AnalyticsPage from "./AdminPages/AnalyticsPage";
import SignIn from "./Pages/SingIn";
import SignUp from "./Pages/SingUp";

import Home from "./Pages/home";
import ProductList from "./Pages/ProductsListing";

// Function to check if user is authenticated
const isAuthenticated = () => {
  return localStorage.getItem("adminToken"); // Example: Checking if a token exists
};

// Higher-Order Component for Protected Routes
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/sign-in" replace />;
};

// Admin Layout Component
const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-primaryBlack text-gray-800 overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="opacity-90" />
        <div className="absolute inset-0 backdrop-blur-lg" />
      </div>

      {/* Main Layout */}
      <div className="flex w-full">
        {/* Sidebar */}
        <div className="flex-shrink-0 bg-primaryBlue">
          <Sidebar />
        </div>

        {/* Admin Panel Content */}
        <div className="relative z-10 flex-grow flex flex-col">
          {/* Admin Header */}
          <Header />

          {/* Page Content */}
          <div className="flex-grow bg-primaryBlack p-6 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Routes Component (Wrapped in ProtectedRoute)
const AdminRoutes = () => {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <Routes>
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </AdminLayout>
    </ProtectedRoute>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<ProductList />} />

        {/* Protected Admin Routes */}
        <Route path="/*" element={<AdminRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
