'use client';

import { FoodItem } from '@/types/food';
import { Calendar, User, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FoodCardProps {
  item: FoodItem;
  onRemove: (id: string) => void;
  getDaysUntilExpiry: (date: string) => number;
  getExpiryStatus: (date: string) => string;
  layout?: 'grid' | 'list';
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'expired':
      return 'bg-danger-500 text-white';
    case 'today':
      return 'bg-danger-100 text-danger-700 border-danger-200';
    case 'urgent':
      return 'bg-warning-100 text-warning-700 border-warning-200';
    case 'warning':
      return 'bg-warning-50 text-warning-600 border-warning-100';
    default:
      return 'bg-fresh-50 text-fresh-600 border-fresh-100';
  }
};

const getStatusText = (status: string, days: number) => {
  switch (status) {
    case 'expired':
      return `Scaduto ${Math.abs(days)} giorni fa`;
    case 'today':
      return 'Scade oggi';
    case 'urgent':
      return `${days} giorni`;
    case 'warning':
      return `${days} giorni`;
    default:
      return `${days} giorni`;
  }
};

export default function FoodCard({ 
  item, 
  onRemove, 
  getDaysUntilExpiry, 
  getExpiryStatus, 
  layout = 'grid' 
}: FoodCardProps) {
  const days = getDaysUntilExpiry(item.expiryDate);
  const status = getExpiryStatus(item.expiryDate);
  const statusColor = getStatusColor(status);
  const statusText = getStatusText(status, days);

  console.log(`Rendering FoodCard for ${item.name} with status ${status}`);

  if (layout === 'list') {
    return (
      <Card className="p-4 flex items-center gap-4 animate-fade-in hover:shadow-md transition-shadow">
        <div className="w-12 h-12 bg-gradient-to-br from-fresh-100 to-fresh-200 rounded-lg flex items-center justify-center text-fresh-600 font-semibold text-lg">
          {item.name.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-neutral-800 truncate">{item.name}</h3>
          {item.category && (
            <p className="text-sm text-neutral-500">{item.category}</p>
          )}
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="w-3 h-3 text-neutral-400" />
            <span className="text-xs text-neutral-500">
              {new Date(item.expiryDate).toLocaleDateString('it-IT')}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Badge className={cn('text-xs font-medium border', statusColor)}>
            {statusText}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log('Removing item:', item.id);
              onRemove(item.id);
            }}
            className="text-neutral-500 hover:text-danger-600 p-1 h-auto"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-3 animate-fade-in hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 bg-gradient-to-br from-fresh-100 to-fresh-200 rounded-xl flex items-center justify-center text-fresh-600 font-semibold text-lg">
          {item.name.charAt(0).toUpperCase()}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            console.log('Removing item:', item.id);
            onRemove(item.id);
          }}
          className="text-neutral-500 hover:text-danger-600 p-1 h-auto"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div>
        <h3 className="font-semibold text-neutral-800 leading-tight">{item.name}</h3>
        {item.category && (
          <p className="text-sm text-neutral-500 mt-1">{item.category}</p>
        )}
      </div>

      <div className="space-y-2">
        <Badge className={cn('text-xs font-medium border w-full justify-center', statusColor)}>
          {statusText}
        </Badge>
        
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(item.expiryDate).toLocaleDateString('it-IT')}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{item.addedBy}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}