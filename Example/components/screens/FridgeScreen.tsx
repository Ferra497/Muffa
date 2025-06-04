'use client';

import { Search, Grid, List, Package } from 'lucide-react';
import { useState } from 'react';
import { FoodItem, AppSettings } from '@/types/food';
import FoodCard from '@/components/FoodCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FridgeScreenProps {
  items: FoodItem[];
  settings: AppSettings;
  onRemoveItem: (id: string) => void;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  getDaysUntilExpiry: (date: string) => number;
  getExpiryStatus: (date: string) => string;
}

export default function FridgeScreen({ 
  items, 
  settings, 
  onRemoveItem, 
  onUpdateSettings, 
  getDaysUntilExpiry, 
  getExpiryStatus 
}: FridgeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');

  console.log('FridgeScreen rendered with', items.length, 'total items');

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleLayout = () => {
    const newLayout = settings.layout === 'grid' ? 'list' : 'grid';
    console.log('Toggling layout to:', newLayout);
    onUpdateSettings({ layout: newLayout });
  };

  if (items.length === 0) {
    return (
      <div className="p-6 pb-24 animate-fade-in">
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-800 mb-2">
            Il tuo frigo è vuoto
          </h2>
          <p className="text-neutral-600">
            Inizia aggiungendo alcuni alimenti dal tab "Aggiungi"
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 space-y-4 animate-fade-in">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-800 mb-2">
          Il tuo frigo
        </h1>
        <p className="text-neutral-600">
          {items.length} {items.length === 1 ? 'alimento' : 'alimenti'} in totale
        </p>
      </div>

      {/* Search and Layout Controls */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Cerca alimenti..."
            value={searchQuery}
            onChange={(e) => {
              console.log('Search query changed:', e.target.value);
              setSearchQuery(e.target.value);
            }}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLayout}
          className="px-3 hover:animate-bounce-subtle"
        >
          {settings.layout === 'grid' ? (
            <List className="w-4 h-4" />
          ) : (
            <Grid className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Results */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-8">
          <Search className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <p className="text-neutral-600">
            Nessun alimento trovato per "{searchQuery}"
          </p>
        </div>
      ) : (
        <div className={cn(
          'grid gap-3',
          settings.layout === 'grid' ? 'grid-cols-2' : 'grid-cols-1'
        )}>
          {filteredItems.map(item => (
            <FoodCard
              key={item.id}
              item={item}
              onRemove={onRemoveItem}
              getDaysUntilExpiry={getDaysUntilExpiry}
              getExpiryStatus={getExpiryStatus}
              layout={settings.layout}
            />
          ))}
        </div>
      )}
    </div>
  );
}