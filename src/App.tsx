import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { CustomerHome } from './components/CustomerView/CustomerHome';
import { MerchantDashboard } from './components/MerchantView/MerchantDashboard';
import { DriverDashboard } from './components/DriverView/DriverDashboard';
import { AdminDashboard } from './components/AdminView/AdminDashboard';
import { CartDrawer } from './components/CustomerView/CartDrawer';
import { CheckoutModal } from './components/CustomerView/CheckoutModal';
import { OrderTrackingModal } from './components/CustomerView/OrderTrackingModal';

const AppContent: React.FC = () => {
  const { role, activeOrder, setActiveOrder } = useApp();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Tajawal',sans-serif]">
      {/* Universal Top Header */}
      <Header
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
      />

      {/* Main View based on active role */}
      <main className="flex-1">
        {role === 'customer' && <CustomerHome />}
        {role === 'merchant' && <MerchantDashboard />}
        {role === 'driver' && <DriverDashboard />}
        {role === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Modals for Seamless Customer Access */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(createdOrder) => {
          setIsCheckoutOpen(false);
          setActiveOrder(createdOrder);
          setIsTrackingOpen(true);
        }}
      />

      <OrderTrackingModal
        order={activeOrder}
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
