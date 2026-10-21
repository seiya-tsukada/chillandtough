/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CommerceProvider, useCommerce } from './context/CommerceContext';
import { Navbar } from './components/Navbar';
import { StoreView } from './views/StoreView';
import { AdminView } from './views/AdminView';
import { StoryModal } from './components/StoryModal';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';

const AppContent: React.FC = () => {
  const { currentAppMode } = useCommerce();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* 3-Zone Strict Top Navigation */}
      <Navbar />

      {/* Main View: Storefront Feed or Admin Operations Console */}
      {currentAppMode === 'store' ? <StoreView /> : <AdminView />}

      {/* Global Overlays & Modals */}
      <StoryModal />
      <ProductModal />
      <CartDrawer />
    </div>
  );
};

export default function App() {
  return (
    <CommerceProvider>
      <AppContent />
    </CommerceProvider>
  );
}
