'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { clientAuth } from '@/lib/auth';

interface Character {
  id: number;
  name: string;
  hp: number;
  attack: number;
  defense: number;
  description: string;
}

interface BattleLog {
  round: number;
  attacker: string;
  defender: string;
  damage: number;
  remainingHp: number;
  message: string;
}

interface BattleResult {
  winner: 'hero' | 'mercenary' | 'draw';
  battleLog: BattleLog[];
  totalRounds: number;
}

export default function GamePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [heroes, setHeroes] = useState<Character[]>([]);
  const [mercenaries, setMercenaries] = useState<Character[]>([]);
  const [selectedHero, setSelectedHero] = useState<Character | null>(null);
  const [selectedMercenary, setSelectedMercenary] = useState<Character | null>(null);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [battleLoading, setBattleLoading] = useState(false);

  useEffect(() => {
    // Cek autentikasi
    const currentUser = clientAuth.getUser();
    const token = clientAuth.getToken();

    if (!currentUser || !token) {
      router.push('/auth/login');
      return;
    }

    setUser(currentUser);
    loadGameData(token);
  }, [router]);

  const loadGameData = async (token: string) => {
    setLoading(true);
    try {
      // Load heroes
      const heroesResponse = await fetch('/api/game/heroes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const heroesData = await heroesResponse.json();

      // Load mercenaries
      const mercenariesResponse = await fetch('/api/game/mercenaries', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const mercenariesData = await mercenariesResponse.json();

      if (heroesData.success) {
        setHeroes(heroesData.data);
      }

      if (mercenariesData.success) {
        setMercenaries(mercenariesData.data);
      }

    } catch (error) {
      console.error('Error loading game data:', error);
      setError('Gagal memuat data game');
    } finally {
      setLoading(false);
    }
  };

  const handleBattle = async () => {
    if (!selectedHero || !selectedMercenary) {
      setError('Pilih hero dan mercenary terlebih dahulu');
      return;
    }

    setBattleLoading(true);
    setError('');
    setBattleResult(null);

    try {
      const token = clientAuth.getToken();
      const response = await fetch('/api/game/battle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          heroId: selectedHero.id,
          mercenaryId: selectedMercenary.id
        })
      });

      const data = await response.json();

      if (data.success) {
        setBattleResult(data.data.result);
      } else {
        setError(data.message || 'Gagal memulai battle');
      }

    } catch (error) {
      console.error('Error battle:', error);
      setError('Terjadi kesalahan saat battle');
    } finally {
      setBattleLoading(false);
    }
  };

  const handleLogout = () => {
    clientAuth.removeToken();
    router.push('/auth/login');
  };

  const resetBattle = () => {
    setBattleResult(null);
    setSelectedHero(null);
    setSelectedMercenary(null);
    setError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-white text-xl">Memuat game...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Atlantica Online</h1>
            <p className="text-slate-300">Selamat datang, {user?.username}!</p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Keluar
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {!battleResult ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Heroes Section */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Pilih Hero</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {heroes.map((hero) => (
                  <Card 
                    key={hero.id}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      selectedHero?.id === hero.id 
                        ? 'ring-2 ring-blue-500 bg-blue-50' 
                        : 'bg-white/95'
                    }`}
                    onClick={() => setSelectedHero(hero)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{hero.name}</CardTitle>
                      <CardDescription>{hero.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="secondary">HP: {hero.hp}</Badge>
                        <Badge variant="destructive">ATK: {hero.attack}</Badge>
                        <Badge variant="outline">DEF: {hero.defense}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Mercenaries Section */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Pilih Mercenary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mercenaries.map((mercenary) => (
                  <Card 
                    key={mercenary.id}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      selectedMercenary?.id === mercenary.id 
                        ? 'ring-2 ring-red-500 bg-red-50' 
                        : 'bg-white/95'
                    }`}
                    onClick={() => setSelectedMercenary(mercenary)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{mercenary.name}</CardTitle>
                      <CardDescription>{mercenary.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="secondary">HP: {mercenary.hp}</Badge>
                        <Badge variant="destructive">ATK: {mercenary.attack}</Badge>
                        <Badge variant="outline">DEF: {mercenary.defense}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Battle Result */
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/95">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  Hasil Pertarungan
                </CardTitle>
                <CardDescription>
                  {selectedHero?.name} vs {selectedMercenary?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <Badge 
                    variant={battleResult.winner === 'hero' ? 'default' : battleResult.winner === 'mercenary' ? 'destructive' : 'secondary'}
                    className="text-lg px-4 py-2"
                  >
                    {battleResult.winner === 'hero' && `${selectedHero?.name} Menang!`}
                    {battleResult.winner === 'mercenary' && `${selectedMercenary?.name} Menang!`}
                    {battleResult.winner === 'draw' && 'Seri!'}
                  </Badge>
                  <p className="text-slate-600 mt-2">
                    Total {battleResult.totalRounds} round
                  </p>
                </div>

                <Separator className="my-4" />

                <div className="max-h-96 overflow-y-auto space-y-2">
                  <h3 className="font-semibold mb-2">Log Pertarungan:</h3>
                  {battleResult.battleLog.map((log, index) => (
                    <div key={index} className="text-sm p-2 bg-slate-50 rounded">
                      {log.message}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Battle Controls */}
        <div className="mt-8 text-center">
          {!battleResult ? (
            <Button
              onClick={handleBattle}
              disabled={!selectedHero || !selectedMercenary || battleLoading}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
            >
              {battleLoading ? 'Memulai Battle...' : 'Mulai Battle!'}
            </Button>
          ) : (
            <Button
              onClick={resetBattle}
              className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-3 text-lg"
            >
              Battle Lagi
            </Button>
          )}
        </div>

        {/* Selected Characters Display */}
        {(selectedHero || selectedMercenary) && !battleResult && (
          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Pilihan Saat Ini:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-white">
                <h4 className="font-semibold">Hero:</h4>
                {selectedHero ? (
                  <p>{selectedHero.name} (HP: {selectedHero.hp}, ATK: {selectedHero.attack}, DEF: {selectedHero.defense})</p>
                ) : (
                  <p className="text-slate-400">Belum dipilih</p>
                )}
              </div>
              <div className="text-white">
                <h4 className="font-semibold">Mercenary:</h4>
                {selectedMercenary ? (
                  <p>{selectedMercenary.name} (HP: {selectedMercenary.hp}, ATK: {selectedMercenary.attack}, DEF: {selectedMercenary.defense})</p>
                ) : (
                  <p className="text-slate-400">Belum dipilih</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
