'use client';

import { User as UserIcon, LogIn, LogOut, Edit } from 'lucide-react';
import { useState } from 'react';
import { User } from '@/types/food';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

interface AccountScreenProps {
  user: User | null;
  onUpdateUser: (userData: Partial<User>) => void;
}

export default function AccountScreen({ user, onUpdateUser }: AccountScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [isGoogleLogin, setIsGoogleLogin] = useState(false);
  const { toast } = useToast();

  console.log('AccountScreen rendered with user:', user);

  const handleSaveName = () => {
    if (!newName.trim()) {
      toast({
        title: "Errore",
        description: "Il nome non può essere vuoto",
        variant: "destructive",
      });
      return;
    }

    console.log('Updating user name to:', newName);
    onUpdateUser({ name: newName.trim() });
    setIsEditing(false);
    
    toast({
      title: "Nome aggiornato!",
      description: "Il tuo nome è stato aggiornato con successo",
    });
  };

  const simulateGoogleLogin = () => {
    console.log('Simulating Google login...');
    setIsGoogleLogin(true);
    
    setTimeout(() => {
      const googleUser = {
        name: 'Mario Rossi',
        email: 'mario.rossi@gmail.com',
        id: 'google_' + Math.random().toString(36).substr(2, 9),
      };
      
      onUpdateUser(googleUser);
      setIsGoogleLogin(false);
      setNewName(googleUser.name);
      
      toast({
        title: "Login effettuato!",
        description: `Benvenuto, ${googleUser.name}!`,
      });
    }, 2000);
  };

  const handleLogout = () => {
    console.log('Logging out user');
    onUpdateUser({
      name: 'Utente',
      email: undefined,
      id: 'user_' + Math.random().toString(36).substr(2, 9),
    });
    setNewName('Utente');
    
    toast({
      title: "Logout effettuato",
      description: "Sei stato disconnesso con successo",
    });
  };

  const isLoggedIn = user?.email != null;

  return (
    <div className="p-6 pb-24 space-y-6 animate-fade-in">
      <div className="text-center">
        <UserIcon className="w-12 h-12 text-fresh-500 mx-auto mb-3" />
        <h1 className="text-2xl font-bold text-neutral-800 mb-2">
          Account
        </h1>
        <p className="text-neutral-600">
          Gestisci il tuo profilo e le tue preferenze
        </p>
      </div>

      {/* User Profile Card */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-fresh-gradient text-white text-lg font-semibold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Il tuo nome"
                  className="font-semibold"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveName}>
                    Salva
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      setNewName(user?.name || '');
                    }}
                  >
                    Annulla
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-neutral-800">
                    {user?.name || 'Utente'}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="p-1 h-auto"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
                {user?.email && (
                  <p className="text-sm text-neutral-600">{user.email}</p>
                )}
                <p className="text-xs text-neutral-500 mt-1">
                  ID: {user?.id}
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Authentication */}
      <Card className="p-4 space-y-4">
        <h3 className="font-semibold text-neutral-800 flex items-center gap-2">
          <LogIn className="w-5 h-5" />
          Autenticazione
        </h3>
        
        {isLoggedIn ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-fresh-50 border border-fresh-200 rounded-lg">
              <div>
                <p className="font-medium text-fresh-600">Connesso con Google</p>
                <p className="text-sm text-fresh-600/80">I tuoi dati sono sincronizzati nel cloud</p>
              </div>
              <div className="w-8 h-8 bg-fresh-500 rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Disconnetti
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
              <p className="font-medium text-neutral-800">Modalità offline</p>
              <p className="text-sm text-neutral-600">I dati sono salvati solo localmente</p>
            </div>
            
            <Button
              onClick={simulateGoogleLogin}
              disabled={isGoogleLogin}
              className="w-full bg-fresh-gradient hover:opacity-90 text-white"
            >
              {isGoogleLogin ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Connessione in corso...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Accedi con Google
                </>
              )}
            </Button>
          </div>
        )}
      </Card>

      {/* Statistics */}
      <Card className="p-4 space-y-3">
        <h3 className="font-semibold text-neutral-800">Statistiche</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-neutral-50 rounded-lg">
            <div className="text-2xl font-bold text-neutral-800">0</div>
            <div className="text-xs text-neutral-600">Alimenti salvati</div>
          </div>
          <div className="p-3 bg-neutral-50 rounded-lg">
            <div className="text-2xl font-bold text-neutral-800">0</div>
            <div className="text-xs text-neutral-600">Sprechi evitati</div>
          </div>
        </div>
      </Card>

      {/* Privacy & Data */}
      <Card className="p-4 bg-neutral-50 border-neutral-200">
        <h3 className="font-semibold text-neutral-800 mb-3">Privacy e Dati</h3>
        <div className="space-y-2 text-sm text-neutral-600">
          <p>🔒 I tuoi dati sono crittografati e sicuri</p>
          <p>📱 Le informazioni rimangono private sul tuo dispositivo</p>
          <p>🌱 Contribuisci a ridurre lo spreco alimentare</p>
        </div>
      </Card>
    </div>
  );
}