'use client';

import { Home, Refrigerator, Plus, Settings, User } from 'lucide-react';
import { NavigationTab } from '@/types/food';
import { cn } from '@/lib/utils';

interface BottomNavigationProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

const tabs = [
  { id: 'home' as NavigationTab, icon: Home, label: 'Home' },
  { id: 'fridge' as NavigationTab, icon: Refrigerator, label: 'Frigo' },
  { id: 'add' as NavigationTab, icon: Plus, label: 'Aggiungi' },
  { id: 'settings' as NavigationTab, icon: Settings, label: 'Impostazioni' },
  { id: 'account' as NavigationTab, icon: User, label: 'Account' },
];

export default function BottomNavigation({ currentTab, onTabChange }: BottomNavigationProps) {
  console.log('BottomNavigation rendered with currentTab:', currentTab);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          const isAddButton = tab.id === 'add';
          
          return (
            <button
              key={tab.id}
              onClick={() => {
                console.log('Tab clicked:', tab.id);
                onTabChange(tab.id);
              }}
              className={cn(
                'flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200',
                isAddButton && 'bg-fresh-gradient text-white shadow-lg transform hover:scale-105 -mt-3',
                !isAddButton && isActive && 'text-fresh-600',
                !isAddButton && !isActive && 'text-neutral-500',
                'hover:animate-bounce-subtle'
              )}
            >
              <Icon 
                className={cn(
                  isAddButton ? 'w-6 h-6' : 'w-5 h-5',
                  'mb-1'
                )} 
              />
              <span className={cn(
                isAddButton ? 'text-xs font-medium' : 'text-xs',
                isAddButton && 'text-white'
              )}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}