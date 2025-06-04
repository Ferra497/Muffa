'use client';

import { useFridge } from '@/hooks/useFridge';
import { Toaster } from '@/components/ui/sonner';
import BottomNavigation from '@/components/BottomNavigation';
import HomeScreen from '@/components/screens/HomeScreen';
import FridgeScreen from '@/components/screens/FridgeScreen';
import AddScreen from '@/components/screens/AddScreen';
import SettingsScreen from '@/components/screens/SettingsScreen';
import AccountScreen from '@/components/screens/AccountScreen';

export default function MuffaApp() {
  const {
    items,
    user,
    settings,
    currentTab,
    addFoodItem,
    removeFoodItem,
    updateSettings,
    setCurrentTab,
    updateUser,
    getExpiringItems,
    getDaysUntilExpiry,
    getExpiryStatus,
  } = useFridge();

  console.log('MuffaApp rendered with currentTab:', currentTab);

  const renderCurrentScreen = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomeScreen
            expiringItems={getExpiringItems()}
            settings={settings}
            onRemoveItem={removeFoodItem}
            getDaysUntilExpiry={getDaysUntilExpiry}
            getExpiryStatus={getExpiryStatus}
          />
        );
      case 'fridge':
        return (
          <FridgeScreen
            items={items}
            settings={settings}
            onRemoveItem={removeFoodItem}
            onUpdateSettings={updateSettings}
            getDaysUntilExpiry={getDaysUntilExpiry}
            getExpiryStatus={getExpiryStatus}
          />
        );
      case 'add':
        return (
          <AddScreen
            onAddItem={addFoodItem}
            onTabChange={setCurrentTab}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            settings={settings}
            user={user}
            onUpdateSettings={updateSettings}
            onUpdateUser={updateUser}
          />
        );
      case 'account':
        return (
          <AccountScreen
            user={user}
            onUpdateUser={updateUser}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Main Content */}
      <main className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
        {renderCurrentScreen()}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation
        currentTab={currentTab}
        onTabChange={setCurrentTab}
      />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}