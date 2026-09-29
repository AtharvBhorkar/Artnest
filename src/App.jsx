import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import ArtistLayout from "./layouts/ArtistLayout";
import AdminLayout from "./layouts/AdminLayout";

// Public pages
import Home from "./pages/public/Home";
import Discover from "./pages/public/Discover";
import Sculptures from "./pages/public/Sculptures";
import Collections from "./pages/public/Collections";
import ArtworkDetail from "./pages/public/ArtworkDetail";
import Artists from "./pages/public/Artists";
import ArtistDetails from "./pages/public/ArtistDetails";
import CustomArt from "./pages/public/CustomArt";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import NotFound from "./pages/public/NotFound";

// Auth pages
import BuyerLogin from "./pages/auth/BuyerLogin";
import BuyerRegister from "./pages/auth/BuyerRegister";
import BuyerForgotPass from "./pages/auth/BuyerForgotPass";
import ArtistLogin from "./pages/auth/ArtistLogin";
import ArtistRegister from "./pages/auth/ArtistRegister";
import ArtistForgotPass from "./pages/auth/ArtistForgotPass";
import AdminLogin from "./pages/auth/AdminLogin";

// Buyer pages
import Wishlist from "./pages/buyer/Wishlist";
import Cart from "./pages/buyer/Cart";
import Checkout from "./pages/buyer/Checkout";
import OrderSuccess from "./pages/buyer/OrderSuccess";
import BuyerOrders from "./pages/buyer/Orders";
import OrderDetails from "./pages/buyer/OrderDetails";
import BuyerProfile from "./pages/buyer/Profile";

// Artist pages
import ArtistDashboard from "./pages/artist/Dashboard";
import MyArtworks from "./pages/artist/MyArtworks";
import ArtworkForm from "./pages/artist/ArtworkForm";
import ArtistOrders from "./pages/artist/Orders";
import CustomRequests from "./pages/artist/CustomRequests";
import Earnings from "./pages/artist/Earnings";
import Reviews from "./pages/artist/Reviews";
import Messages from "./pages/artist/Messages";
import ArtistProfile from "./pages/artist/Profile";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminArtists from "./pages/admin/Artists";
import AdminArtworks from "./pages/admin/Artworks";
import Users from "./pages/admin/Users";
import AdminOrders from "./pages/admin/Orders";
import Categories from "./pages/admin/Categories";
import ReportedListings from "./pages/admin/ReportedListings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Navbar + Footer wale pages (public + buyer) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/sculptures" element={<Sculptures />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/artwork/:id" element={<ArtworkDetail />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/artists/:id" element={<ArtistDetails />} />
          <Route path="/custom-art" element={<CustomArt />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Buyer */}
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/orders" element={<BuyerOrders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/profile" element={<BuyerProfile />} />
        </Route>

        {/* Auth: bina layout ke, poori screen */}
        <Route path="/buyer/login" element={<BuyerLogin />} />
        <Route path="/buyer/register" element={<BuyerRegister />} />
        <Route path="/buyer/forgot-password" element={<BuyerForgotPass />} />
        <Route path="/artist/login" element={<ArtistLogin />} />
        <Route path="/artist/register" element={<ArtistRegister />} />
        <Route path="/artist/forgot-password" element={<ArtistForgotPass />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Artist dashboard (sidebar wala) */}
        <Route path="/artist" element={<ArtistLayout />}>
          <Route index element={<ArtistDashboard />} />
          <Route path="artworks" element={<MyArtworks />} />
          <Route path="artworks/new" element={<ArtworkForm />} />
          <Route path="artworks/:id/edit" element={<ArtworkForm />} />
          <Route path="orders" element={<ArtistOrders />} />
          <Route path="requests" element={<CustomRequests />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<ArtistProfile />} />
        </Route>

        {/* Admin dashboard (sidebar wala) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="artists" element={<AdminArtists />} />
          <Route path="artworks" element={<AdminArtworks />} />
          <Route path="users" element={<Users />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="categories" element={<Categories />} />
          <Route path="reports" element={<ReportedListings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}