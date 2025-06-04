'use client';

import { useState, useCallback, useEffect } from 'react';
import { FoodItem, User, AppSettings, NavigationTab, FridgeState } from '@/types/food';

const STORAGE_KEY = 'muffa_data';

const defaultSettings: AppSettings = {
  language: 'it',
  layout: 'grid',
  homeDaysFilter: 5,
};

const defaultUser: User = {
  id: 'user_' + Math.random().toString(36).substr(2, 9),
  name: 'Utente',
  fridgeId: 'fridge_' + Math.random().toString(36).substr(2, 9),
};

export const useFridge = () => {
  const [state, setState] = useState<FridgeState>({
    items: [],
    user: defaultUser,
    settings: defaultSettings,
    currentTab: 'home',
  });

  // Load data from localStorage on mount
  useEffect(() => {
    console.log('Loading data from localStorage...');
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        console.log('Loaded saved data:', parsed);
        setState(parsed);
      } catch (error) {
        console.error('Error parsing saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    console.log('Saving data to localStorage:', state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addFoodItem = useCallback((item: Omit<FoodItem, 'id' | 'addedAt' | 'addedBy'>) => {
    console.log('Adding food item:', item);
    const newItem: FoodItem = {
      ...item,
      id: 'item_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      addedAt: new Date().toISOString(),
      addedBy: state.user?.name || 'Utente',
    };
    
    setState(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    
    console.log('Food item added successfully:', newItem);
  }, [state.user?.name]);

  const removeFoodItem = useCallback((id: string) => {
    console.log('Removing food item with id:', id);
    setState(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
    }));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    console.log('Updating settings:', newSettings);
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  }, []);

  const setCurrentTab = useCallback((tab: NavigationTab) => {
    console.log('Changing tab to:', tab);
    setState(prev => ({ ...prev, currentTab: tab }));
  }, []);

  const updateUser = useCallback((userData: Partial<User>) => {
    console.log('Updating user data:', userData);
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...userData } : null,
    }));
  }, []);

  // Helper functions
  const getExpiringItems = useCallback(() => {
    const today = new Date();
    const filterDays = state.settings.homeDaysFilter;
    const cutoffDate = new Date(today.getTime() + filterDays * 24 * 60 * 60 * 1000);
    
    return state.items.filter(item => {
      const expiryDate = new Date(item.expiryDate);
      return expiryDate <= cutoffDate;
    });
  }, [state.items, state.settings.homeDaysFilter]);

  const getDaysUntilExpiry = useCallback((expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, []);

  const getExpiryStatus = useCallback((expiryDate: string) => {
    const days = getDaysUntilExpiry(expiryDate);
    if (days < 0) return 'expired';
    if (days === 0) return 'today';
    if (days <= 2) return 'urgent';
    if (days <= 5) return 'warning';
    return 'fresh';
  }, [getDaysUntilExpiry]);

  return {
    ...state,
    addFoodItem,
    removeFoodItem,
    updateSettings,
    setCurrentTab,
    updateUser,
    getExpiringItems,
    getDaysUntilExpiry,
    getExpiryStatus,
  };
};