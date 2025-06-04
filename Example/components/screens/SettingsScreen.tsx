'use client';

import { Settings, Globe, Layout, Calendar, Share2, Copy } from 'lucide-react';
import { AppSettings, User } from '@/types/food';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface SettingsScreenProps {
  settings: AppSettings;
  user: User | null;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onUpdateUser: (userData: Partial<User>) => void;
}

export default function SettingsScreen({ 
  settings, 
  user, 
  onUpdateSettings, 
  onUpdateUser 
}: SettingsScreenProps) {
  const { toast } = useToast();

  console.log('SettingsScreen rendered with settings:', settings);

  const copyFridgeId = async () => {
    if (!user?.fridgeId) return;
    
    try {
      await navigator.clipboard.writeText(user.fridgeId);
      console.log('Fridge ID copied to clipboard:', user.fridgeId);
      toast({
        title: "ID copiato!",
        description: "L'ID del frigo è stato copiato negli appunti",
      });
    } catch (error) {
      console.error('Failed to copy fridge ID:', error);
      toast({
        title: "Errore",
        description: "Impossibile copiare l'ID",
        variant: "destructive",
      });
    }
  };

  const shareFridgeId = async () => {
    if (!user?.fridgeId) return;

    const shareData = {
      title: 'Muffa - Condividi Frigo',
      text: `Unisciti al mio frigo condiviso su Muffa! ID: ${user.fridgeId}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        console.log('Fridge ID shared successfully');
      } else {
        // Fallback to copy
        await copyFridgeId();
      }
    } catch (error) {
      console.error('Error sharing fridge ID:', error);
    }
  };

  const handleFridgeIdChange = (newFridgeId: string) => {
    console.log('Updating fridge ID to:', newFridgeId);
    onUpdateUser({ fridgeId: newFridgeId });
    toast({
      title: "ID aggiornato!",
      description: "Il tuo ID frigo è stato aggiornato",
    });
  };

  return (
    <div className="p-6 pb-24 space-y-6 animate-fade-in">
      <div className="text-center">
        <Settings className="w-12 h-12 text-fresh-500 mx-auto mb-3" />
        <h1 className="text-2xl font-bold text-neutral-800 mb-2">
          Impostazioni
        </h1>
        <p className="text-neutral-600">
          Personalizza la tua esperienza Muffa
        </p>
      </div>

      {/* Language Settings */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-fresh-500" />
          <h3 className="font-semibold text-neutral-800">Lingua</h3>
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Lingua dell'app</Label>
          <Select
            value={settings.language}
            onValueChange={(value: 'it' | 'en') => {
              console.log('Language changed to:', value);
              onUpdateSettings({ language: value });
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="it">🇮🇹 Italiano</SelectItem>
              <SelectItem value="en">🇬🇧 English</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Layout Settings */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Layout className="w-5 h-5 text-fresh-500" />
          <h3 className="font-semibold text-neutral-800">Visualizzazione</h3>
        </div>
        <div className="space-y-2">
          <Label htmlFor="layout">Layout</Label>
          <Select
            value={settings.layout}
            onValueChange={(value: 'grid' | 'list') => {
              console.log('Layout changed to:', value);
              onUpdateSettings({ layout: value });
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">🔲 Griglia</SelectItem>
              <SelectItem value="list">📋 Lista</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Home Filter Settings */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-fresh-500" />
          <h3 className="font-semibold text-neutral-800">Filtro Home</h3>
        </div>
        <div className="space-y-2">
          <Label htmlFor="homeDays">Giorni per scadenza in Home</Label>
          <Select
            value={settings.homeDaysFilter.toString()}
            onValueChange={(value) => {
              const days = parseInt(value);
              console.log('Home days filter changed to:', days);
              onUpdateSettings({ homeDaysFilter: days });
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 giorni</SelectItem>
              <SelectItem value="5">5 giorni</SelectItem>
              <SelectItem value="7">7 giorni</SelectItem>
              <SelectItem value="14">14 giorni</SelectItem>
              <SelectItem value="30">30 giorni</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-neutral-500">
            Mostra alimenti che scadono entro questo periodo
          </p>
        </div>
      </Card>

      {/* Fridge ID Settings */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Share2 className="w-5 h-5 text-fresh-500" />
          <h3 className="font-semibold text-neutral-800">Frigo condiviso</h3>
        </div>
        <div className="space-y-3">
          <div>
            <Label htmlFor="fridgeId">ID Frigo</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="fridgeId"
                value={user?.fridgeId || ''}
                onChange={(e) => handleFridgeIdChange(e.target.value)}
                placeholder="Inserisci ID frigo"
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={copyFridgeId}
                className="px-3"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Condividi questo ID per sincronizzare il frigo con altri utenti
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={shareFridgeId}
            className="w-full"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Condividi ID Frigo
          </Button>
        </div>
      </Card>

      {/* App Info */}
      <Card className="p-4 bg-neutral-50 border-neutral-200">
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-neutral-800">Muffa</h3>
          <p className="text-sm text-neutral-600">
            Il tuo assistente digitale per il frigorifero
          </p>
          <p className="text-xs text-neutral-500">
            Versione 1.0.0
          </p>
        </div>
      </Card>
    </div>
  );
}