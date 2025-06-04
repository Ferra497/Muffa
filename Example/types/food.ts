export interface FoodItem {
  id: string;
  name: string;
  category?: string;
  expiryDate: string;
  addedBy: string;
  addedAt: string;
  image?: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  fridgeId: string;
}

export interface AppSettings {
  language: 'it' | 'en';
  layout: 'grid' | 'list';
  homeDaysFilter: number;
}

export type NavigationTab = 'home' | 'fridge' | 'add' | 'settings' | 'account';

export interface FridgeState {
  items: FoodItem[];
  user: User | null;
  settings: AppSettings;
  currentTab: NavigationTab;
}