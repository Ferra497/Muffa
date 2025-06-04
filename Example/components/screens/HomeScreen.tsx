'use client';

import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { FoodItem, AppSettings } from '@/types/food';
import FoodCard from '@/components/FoodCard';
import { Card } from '@/components/ui/card';

interface HomeScreenProps {
  expiringItems: FoodItem[];
  settings: AppSettings;
  onRemoveItem: (id: string) => void;
  getDaysUntilExpiry: (date: string) => number;
  getExpiryStatus: (date: string) => string;
}

export default function HomeScreen({ 
  expiringItems, 
  settings, 
  onRemoveItem, 
  getDaysUntilExpiry, 
  getExpiryStatus 
}: HomeScreenProps) {
  console.log('HomeScreen rendered with', expiringItems.length, 'expiring items');

  const expiredItems = expiringItems.filter(item => getDaysUntilExpiry(item.expiryDate) < 0);
  const urgentItems = expiringItems.filter(item => {
    const days = getDaysUntilExpiry(item.expiryDate);
    return days >= 0 && days <= 2;
  });
  const warningItems = expiringItems.filter(item => {
    const days = getDaysUntilExpiry(item.expiryDate);
    return days > 2 && days <= settings.homeDaysFilter;
  });

  if (expiringItems.length === 0) {
    return (
      <div className="p-6 pb-24 animate-fade-in">
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-fresh-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-800 mb-2">
            Tutto sotto controllo! 🎉
          </h2>
          <p className="text-neutral-600">
            Non hai alimenti in scadenza nei prossimi {settings.homeDaysFilter} giorni.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-800 mb-2">
          I tuoi alimenti in scadenza
        </h1>
        <p className="text-neutral-600">
          Prossimi {settings.homeDaysFilter} giorni
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 text-center bg-danger-50 border-danger-200">
          <div className="text-2xl font-bold text-danger-600">{expiredItems.length}</div>
          <div className="text-xs text-danger-600 font-medium">Scaduti</div>
        </Card>
        <Card className="p-3 text-center bg-warning-50 border-warning-200">
          <div className="text-2xl font-bold text-warning-600">{urgentItems.length}</div>
          <div className="text-xs text-warning-600 font-medium">Urgenti</div>
        </Card>
        <Card className="p-3 text-center bg-fresh-50 border-fresh-200">
          <div className="text-2xl font-bold text-fresh-600">{warningItems.length}</div>
          <div className="text-xs text-fresh-600 font-medium">Da consumare</div>
        </Card>
      </div>

      {/* Expired Items */}
      {expiredItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-danger-500" />
            <h2 className="text-lg font-semibold text-danger-600">Scaduti</h2>
          </div>
          <div className={cn(
            'grid gap-3',
            settings.layout === 'grid' ? 'grid-cols-2' : 'grid-cols-1'
          )}>
            {expiredItems.map(item => (
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
        </div>
      )}

      {/* Urgent Items */}
      {urgentItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-warning-500" />
            <h2 className="text-lg font-semibold text-warning-600">Scadono presto</h2>
          </div>
          <div className={cn(
            'grid gap-3',
            settings.layout === 'grid' ? 'grid-cols-2' : 'grid-cols-1'
          )}>
            {urgentItems.map(item => (
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
        </div>
      )}

      {/* Warning Items */}
      {warningItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-fresh-500" />
            <h2 className="text-lg font-semibold text-fresh-600">Da tenere d'occhio</h2>
          </div>
          <div className={cn(
            'grid gap-3',
            settings.layout === 'grid' ? 'grid-cols-2' : 'grid-cols-1'
          )}>
            {warningItems.map(item => (
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
        </div>
      )}
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}