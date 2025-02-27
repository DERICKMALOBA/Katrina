import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Import Components
import Sidebar from "./AdminComponents/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Nav from "./components/Navbar";
import AdmiHeader from "./AdminComponents/AdminHeader";
import ProtectedRoute from "./components/PrivateRoute";

// Import Admin Pages
import OverviewPage from "./AdminPages/OverviewPage";
import ProductPage from "./AdminPages/Product";
import Customers from "./AdminPages/Customers";
import SalesPage from "./AdminPages/SalesPage";
import OrdersPage from "./AdminPages/OrdersPage";
import OffersPage from "./AdminPages/Offers";
import AnalyticsPage from "./AdminPages/AnalyticsPage";
import EditDelivery from "./AdminPages/EditDelivery";
import AdminMessagePanel from "./Pages/Adminmessages";
import Admin from "./Pages/Adminreply";

// Import User Pages
import SignIn from "./Pages/SingIn";
import SignUp from "./Pages/SingUp";
import Home from "./Pages/Home";
import ProductList from "./Pages/ProductsListing";
import ProductInfo from "./Pages/Productdetails";
import ProductForm from "./Pages/submit";
import ProductDetail from "./Pages/Productdetails";
import Tops from "./Pages/Tops";
import Bottoms from "./Pages/Bottoms";
import CheckoutForm from "./Pages/Checkout";
import Dressers from "./Pages/Dressers";
import Outer from "./Pages/Outer";
import Sleep from "./Pages/Sleep";
import Under from "./Pages/Under";
import Foot from "./Pages/Foot";
import Accessories from "./Pages/Accessories";
import Special from "./Pages/Special";
import Sports from "./Pages/Sports";
import MessagePopup from "./Pages/Chat";
import Cart from "./Pages/Cart";
import ForgotPassword from "./Pages/Forgotpassword";
import ResetPassword from "./Pages/Resetpassword";
import Profile from "./Pages/test";

// Layout component



import NotificationsPage from "./Pages/notifications";

// Component to conditionally render the layout

const Layout = ({ children }) => {
  const location = useLocation();

  // Routes where the Footer should be hidden
  const excludedRoutes = [
    "/sign-in",
    "/sign-up",
    // "/cart",
    // "/checkout",
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

  const isExcludedRoute = excludedRoutes.includes(location.pathname);

  return (
    <>
      {/* Show Header and Nav only if NOT on an excluded route */}
      {!isExcludedRoute && (
        <>
          <Header />
          <Nav />
        </>
      )}

      {/* Page Content */}
      {children}

      {/* Show Footer only if NOT on an excluded route */}
      {!isExcludedRoute && <Footer />}
    </>
  );
};

// Admin Layout
const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-primaryBlack text-gray-800 overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="opacity-90" />
        <div className="absolute inset-0 backdrop-blur-lg" />
      </div>

      <div className="flex w-full">
        <div className="flex-shrink-0 bg-primaryBlue">
          <Sidebar />
        </div>

        <div className="relative z-10 flex-grow flex flex-col">
          <AdmiHeader />
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
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<ProductList />} />
          <Route path="/productdet/:name/:description/:price" element={<ProductInfo />} />
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
          <Route path="/chats" element={<MessagePopup />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>

            <Route path="/overview" element={<AdminLayout><OverviewPage /></AdminLayout>} />
            <Route path="/adminmessages" element={<AdminLayout><AdminMessagePanel /></AdminLayout>} />
            <Route path="/message/:email" element={<AdminLayout><Admin /></AdminLayout>} />
            <Route path="/products" element={<AdminLayout><ProductPage /></AdminLayout>} />
            <Route path="/customers" element={<AdminLayout><Customers /></AdminLayout>} />
            <Route path="/sales" element={<AdminLayout><SalesPage /></AdminLayout>} />
            <Route path="/orders" element={<AdminLayout><OrdersPage /></AdminLayout>} />
            <Route path="/edit-delivery" element={<AdminLayout><EditDelivery /></AdminLayout>} />
            <Route path="/offers" element={<AdminLayout><OffersPage /></AdminLayout>} />
            <Route path="/analytics" element={<AdminLayout><AnalyticsPage /></AdminLayout>} />
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
                  <NotificationsPage/>
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
      </Layout>
    </Router>
  );
}

export default App;
