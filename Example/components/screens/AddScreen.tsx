'use client';

import { Camera, Image as ImageIcon, Calendar, Plus, Check, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FoodItem } from '@/types/food';
import { useToast } from '@/hooks/use-toast';
import ImageCapture from '@/components/ImageCapture';

interface AddScreenProps {
  onAddItem: (item: Omit<FoodItem, 'id' | 'addedAt' | 'addedBy'>) => void;
  onTabChange: (tab: 'home' | 'fridge') => void;
}

interface RecognizedFood {
  name: string;
  category: string;
  confidence: number;
  suggested_expiry_days: number;
}

const suggestedFoods = [
  { name: 'Latte', category: 'Latticini' },
  { name: 'Parmigiano', category: 'Formaggi' },
  { name: 'Pomodori', category: 'Verdure' },
  { name: 'Mele', category: 'Frutta' },
  { name: 'Yogurt', category: 'Latticini' },
  { name: 'Pane', category: 'Panetteria' },
];

export default function AddScreen({ onAddItem, onTabChange }: AddScreenProps) {
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showImageCapture, setShowImageCapture] = useState(false);
  const [recognizedFoods, setRecognizedFoods] = useState<RecognizedFood[]>([]);
  const { toast } = useToast();

  console.log('AddScreen rendered');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!foodName.trim()) {
      console.log('Food name is required');
      toast({
        title: "Errore",
        description: "Il nome dell'alimento è obbligatorio",
        variant: "destructive",
      });
      return;
    }

    console.log('Adding food item:', { foodName, category, expiryDate });
    setIsLoading(true);

    try {
      const finalExpiryDate = expiryDate || '2099-12-31';
      
      onAddItem({
        name: foodName.trim(),
        category: category.trim() || undefined,
        expiryDate: finalExpiryDate,
      });

      console.log('Food item added successfully');
      
      toast({
        title: "Alimento aggiunto!",
        description: `${foodName} è stato aggiunto al tuo frigo`,
      });

      // Reset form
      setFoodName('');
      setCategory('');
      setExpiryDate('');
      
      // Navigate to fridge
      onTabChange('fridge');
      
    } catch (error) {
      console.error('Error adding food item:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiunta",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedFood = (food: typeof suggestedFoods[0]) => {
    console.log('Selected suggested food:', food);
    setFoodName(food.name);
    setCategory(food.category);
  };

  const openImageCapture = () => {
    console.log('Opening image capture...');
    setShowImageCapture(true);
  };

  const handleImageAnalyzed = (foods: RecognizedFood[]) => {
    console.log('Image analyzed, foods found:', foods);
    setRecognizedFoods(foods);
    setShowImageCapture(false);
    
    // Auto-select the first food with highest confidence
    if (foods.length > 0) {
      const bestFood = foods.reduce((prev, current) => 
        current.confidence > prev.confidence ? current : prev
      );
      setFoodName(bestFood.name);
      setCategory(bestFood.category);
      
      // Set suggested expiry date
      const suggestedDate = new Date();
      suggestedDate.setDate(suggestedDate.getDate() + bestFood.suggested_expiry_days);
      setExpiryDate(suggestedDate.toISOString().split('T')[0]);
    }
  };

  const selectRecognizedFood = (food: RecognizedFood) => {
    console.log('Selected recognized food:', food);
    setFoodName(food.name);
    setCategory(food.category);
    
    // Set suggested expiry date
    const suggestedDate = new Date();
    suggestedDate.setDate(suggestedDate.getDate() + food.suggested_expiry_days);
    setExpiryDate(suggestedDate.toISOString().split('T')[0]);
    
    // Clear recognized foods
    setRecognizedFoods([]);
  };

  const clearRecognizedFoods = () => {
    setRecognizedFoods([]);
  };

  return (
    <div className="p-6 pb-24 space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-800 mb-2">
          Aggiungi alimento
        </h1>
        <p className="text-neutral-600">
          Scatta una foto o inserisci manualmente
        </p>
      </div>

      {/* Photo Capture Options */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={openImageCapture}
          disabled={isLoading}
          className="h-20 flex flex-col gap-2 hover:animate-bounce-subtle"
        >
          <Camera className="w-6 h-6" />
          <span className="text-sm">Scatta foto</span>
        </Button>
        <Button
          variant="outline"
          onClick={openImageCapture}
          disabled={isLoading}
          className="h-20 flex flex-col gap-2 hover:animate-bounce-subtle"
        >
          <ImageIcon className="w-6 h-6" />
          <span className="text-sm">Dalla galleria</span>
        </Button>
      </div>

      {/* Recognized Foods */}
      {recognizedFoods.length > 0 && (
        <Card className="p-4 space-y-3 bg-fresh-50 border-fresh-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-fresh-700">Alimenti riconosciuti</h3>
            <Button variant="ghost" size="sm" onClick={clearRecognizedFoods}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {recognizedFoods.map((food, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white rounded-lg border hover:border-fresh-300 cursor-pointer transition-colors"
                onClick={() => selectRecognizedFood(food)}
              >
                <div className="flex-1">
                  <div className="font-medium text-neutral-800">{food.name}</div>
                  <div className="text-sm text-neutral-600">{food.category}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {Math.round(food.confidence * 100)}%
                  </Badge>
                  <Button size="sm" variant="ghost" className="p-1 h-auto">
                    <Check className="w-4 h-4 text-fresh-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Manual Entry Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="foodName">Nome alimento *</Label>
            <Input
              id="foodName"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="Es. Latte intero"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Categoria (opzionale)</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Es. Latticini"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="expiryDate">Data di scadenza</Label>
            <Input
              id="expiryDate"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-neutral-500 mt-1">
              Se vuota, verrà impostata al 31/12/2099
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !foodName.trim()}
            className="w-full bg-fresh-gradient hover:opacity-90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Aggiungi al frigo
          </Button>
        </form>
      </Card>

      {/* Quick Add Suggestions */}
      <div className="space-y-3">
        <h3 className="font-semibold text-neutral-800">Aggiungi velocemente</h3>
        <div className="grid grid-cols-2 gap-2">
          {suggestedFoods.map((food, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleSuggestedFood(food)}
              className="justify-start text-left hover:bg-fresh-50 hover:border-fresh-200"
            >
              <Plus className="w-3 h-3 mr-2" />
              <div>
                <div className="font-medium">{food.name}</div>
                <div className="text-xs text-neutral-500">{food.category}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Image Capture Modal */}
      {showImageCapture && (
        <ImageCapture
          onImageAnalyzed={handleImageAnalyzed}
          onClose={() => setShowImageCapture(false)}
        />
      )}
    </div>
  );
}