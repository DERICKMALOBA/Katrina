import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "./AdminComponents/Sidebar";
import OverviewPage from "./AdminPages/OverviewPage";
import ProductPage from "./AdminPages/Product";
import Customers from "./AdminPages/Customers";
import SalesPage from "./AdminPages/SalesPage";
import OrdersPage from "./AdminPages/OrdersPage";
import OffersPage from "./AdminPages/Offers";
import AnalyticsPage from "./AdminPages/AnalyticsPage";
import EditDelivery from "./AdminPages/EditDelivery";
import SignIn from "./Pages/SingIn";
import SignUp from "./Pages/SingUp";
import Nav from "./components/Navbar";
import Home from "./Pages/Home";
import ProductList from "./Pages/ProductsListing";
import ProductInfo from "./Pages/Productdetails";
import ProductForm from "./Pages/submit";
import Header from "./components/Header";
import AdmiHeader from "./AdminComponents/AdminHeader";
import ProductDetail from "./Pages/Productdetails";
import Tops from "./Pages/Tops";
import Bottoms from "./Pages/Subcategory";
import CheckoutForm from "./Pages/Checkout";
import Dressers from "./Pages/Dressers";
import Outer from "./Pages/Outer";
import Sleep from "./Pages/Sleep";
import Under from "./Pages/Under";
import Foot from "./Pages/Foot";
import Accessories from "./Pages/Accessories";
import Special from "./Pages/Special";
import Sports from "./Pages/Sports";
// import MessagePopup from "./Pages/Chat";
import ProtectedRoute from "./components/PrivateRoute";
import Cart from "./Pages/Cart";
import AdminMessagePanel from "./Pages/Adminmessages";
import Admin from "./Pages/Adminreply";
import ForgotPassword from "./Pages/Forgotpassword";
import ResetPassword from "./Pages/Resetpassword";
import Profile from "./Pages/test";
import NotificationsPage from "./Pages/notifications";
import Footer from "./components/Footer";
import Subcategories from "./Pages/Subcategory";
// import Navbar from "./components/CategoriesNav";

import Chat from "./Pages/Chat";
import Itemlist from "./Pages/Itemlist";
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
    "/edit-delivery",
    "/adminmessages",
    "/message/:email",
    "/notify"
  ];

  // Routes where Footer should not be displayed
  const noFooterRoutes = ["/sign-in", "/sign-up", ...adminRoutes];

  // Routes where Nav should not be displayed
  const noNavRoutes = ["/checkout", "/cart", "/profile", "/product/:id"];

  // Check if the current route is in the noFooterRoutes list
  const shouldDisplayFooter = !noFooterRoutes.includes(location.pathname);

  // Check if the current route is in the noNavRoutes list
  const shouldDisplayNav = !noNavRoutes.includes(location.pathname);

  // Check if the current route is NOT an admin route
  const shouldDisplayHeader = !adminRoutes.includes(location.pathname);

  return (
    <>
      {/* Show Header and Nav only if NOT on an admin route */}
      {!adminRoutes&& (
        <>
          <Header />
          <Nav />
          <Footer/>
        </>
      )}
      {/* Show Header only if NOT on an admin route */}
      {shouldDisplayHeader && <Header />}

      {/* Show Nav only if NOT on a noNavRoutes route and NOT on an admin route */}
      {shouldDisplayNav && !adminRoutes.includes(location.pathname) && <Nav />}

      {children}

      {/* Show Footer only if NOT on a noFooterRoutes route */}
      {shouldDisplayFooter && <Footer />}
    </>
  );
};
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
          <AdmiHeader />

          {/* Page Content */}
          <div className="flex-grow bg-primaryBlack p-6 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <ToastContainer />
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/sign-in" element={<SignIn/>} />
          <Route path="/sign-up" element={<SignUp/>} />
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<ProductList />} />
          <Route
            path="/productdet/:name/:description/:price"
            element={<ProductInfo />}
          />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/productform" element={<ProductForm />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/products/tops" element={<Tops />} />
          <Route path="/products/bottoms" element={<Bottoms />} />
          <Route path="/checkout" element={<CheckoutForm />} />
          <Route path="/products/dressers" element={<Dressers />} />
          <Route path="/products/outer" element={<Outer />} />
          <Route path="/products/sleep" element={<Sleep />} />
          <Route path="/products/under" element={<Under />} />
          <Route path="/products/foot" element={<Foot />} />
          <Route path="/products/accessories" element={<Accessories />} />
          <Route path="/products/special" element={<Special />} />
          <Route path="/products/sports" element={<Sports />} />
          <Route path="/chats" element={<Chat/>} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/adminmessages" element={<AdminMessagePanel />} />
          <Route path="/message/:email" element={<Admin />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
        
          <Route path="/profile" element={<Profile />} />
          <Route path="/subcategories/:sub" element={<Subcategories/>} />
          <Route path="/items/:item" element={<Itemlist/>} />
          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route
              path="/overview"
              element={
                <AdminLayout>
                  <OverviewPage />
                </AdminLayout>
              }
            />
            <Route
              path="/adminmessages"
              element={
                <AdminLayout>
                  <AdminMessagePanel />
                </AdminLayout>
              }
            />
            <Route
              path="/notify"
              element={
                <AdminLayout>
                  <NotificationsPage />
                </AdminLayout>
              }
            />
            <Route
              path="/message/:email"
              element={
                <AdminLayout>
                  <Admin />
                </AdminLayout>
              }
            />
            <Route
              path="/products"
              element={
                <AdminLayout>
                  <ProductPage />
                </AdminLayout>
              }
            />
            <Route
              path="/customers"
              element={
                <AdminLayout>
                  <Customers />
                </AdminLayout>
              }
            />
            <Route
              path="/sales"
              element={
                <AdminLayout>
                  <SalesPage />
                </AdminLayout>
              }
            />
            <Route
              path="/orders"
              element={
                <AdminLayout>
                  <OrdersPage />
                </AdminLayout>
              }
            />
            <Route
              path="/edit-delivery"
              element={
                <AdminLayout>
                  <EditDelivery />
                </AdminLayout>
              }
            />
            <Route
              path="/offers"
              element={
                <AdminLayout>
                  <OffersPage />
                </AdminLayout>
              }
            />
            <Route
              path="/analytics"
              element={
                <AdminLayout>
                  <AnalyticsPage />
                </AdminLayout>
              }
            />
          </Route>
        </Routes>
        {/* <Footer/> */}
      </Layout>
      
    </Router>
  );
}

export default App;