'use client';

import { AppProvider, useApp } from './context/app-context';
import { Header } from './components/header';
import { Footer } from './components/footer';
import { MobileBottomBar } from './components/mobile-bottom-bar';
import { HomePage } from './pages/home-page';
import { ShopPage } from './pages/shop-page';
import { ProductDetailPage } from './pages/product-detail-page';
import { CartPage } from './pages/cart-page';
import { CheckoutPage } from './pages/checkout-page';
import { AboutPage } from './pages/about-page';
import { ContactPage } from './pages/contact-page';

function AppContent() {
  const { currentPage } = useApp();

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
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <Header />
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
