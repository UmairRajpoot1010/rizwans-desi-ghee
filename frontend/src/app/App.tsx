'use client';

import { AppProvider, useApp } from './context/app-context';
import { Header } from './components/header';
import { AnnouncementBar } from './components/announcement-bar';
import { Footer } from './components/footer';
import { MobileBottomBar } from './components/mobile-bottom-bar';
import { HomePage } from './pages/home-page';
import { ShopPage } from './pages/shop-page';
import { ProductDetailPage } from './pages/product-detail-page';
import { CartPage } from './pages/cart-page';
import { CheckoutPage } from './pages/checkout-page';
import { ProfilePage } from './pages/profile-page';
import { AboutPage } from './pages/about-page';
import { ContactPage } from './pages/contact-page';
import { FavouritesPage } from './pages/favourites-page';
import { OrderDetailPage } from './pages/order-detail-page';

function AppContent() {
  const { currentPage, selectedOrderId } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'product':
        return <ProductDetailPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'favourites':
        return <FavouritesPage />;
      case 'profile':
        return <ProfilePage />;
      case 'order-detail':
        return selectedOrderId ? <OrderDetailPage orderId={selectedOrderId} /> : <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <Header />
      {/* Continuous sliding announcement bar directly below navbar (hide on home to not overlap hero) */}
      {currentPage !== 'home' && <AnnouncementBar />}
      <main>
        {renderPage()}
      </main>
      <Footer />
      <MobileBottomBar />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
