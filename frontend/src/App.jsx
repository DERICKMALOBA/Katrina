import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom"; 
import Sidebar from "./AdminComponents/Sidebar";

import OverviewPage from "./AdminPages/OverviewPage";
import ProductPage from "./AdminPages/Product";
import Customers from "./AdminPages/Customers";
import SalesPage from "./AdminPages/SalesPage";
import OrdersPage from "./AdminPages/OrdersPage";
import OffersPage from "./AdminPages/Offers";
import AnalyticsPage from "./AdminPages/AnalyticsPage";
import SignIn from "./Pages/SingIn";
import SignUp from "./Pages/SingUp";

import Nav from "./components/Navbar";
import Home from "./Pages/home";
import ProductList from "./Pages/ProductsListing";
import Header from "./components/Header";

// Component to conditionally render the layout
const Layout = ({ children }) => {
  const location = useLocation();
  
  // List of admin routes
  const adminRoutes = [
    "/overview",
    "/products",
    "/customers",
    "/sales",
    "/orders",
    "/offers",
    "/analytics",
  ];

  // Check if the current route is an admin route
  const isAdminRoute = adminRoutes.includes(location.pathname);

  return (
    <>
      {/* Show Header and Nav only if NOT on an admin route */}
      {!isAdminRoute && (
        <>
          <Header/>
          <Nav />
        </>
      )}
      {children}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<ProductList />} />

          {/* Admin Routes */}
          <Route path="/overview" element={<AdminLayout><OverviewPage /></AdminLayout>} />
          <Route path="/products" element={<AdminLayout><ProductPage /></AdminLayout>} />
          <Route path="/customers" element={<AdminLayout><Customers /></AdminLayout>} />
          <Route path="/sales" element={<AdminLayout><SalesPage /></AdminLayout>} />
          <Route path="/orders" element={<AdminLayout><OrdersPage /></AdminLayout>} />
          <Route path="/offers" element={<AdminLayout><OffersPage /></AdminLayout>} />
          <Route path="/analytics" element={<AdminLayout><AnalyticsPage /></AdminLayout>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

// Separate layout for admin pages
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

export default App;
