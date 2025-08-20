'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { clientAuth } from '@/lib/auth';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Jika sudah login, redirect ke game
    if (clientAuth.isAuthenticated()) {
      router.push('/game');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Atlantica Online
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Masuki dunia petualangan turn-based yang epik. Pilih hero dan mercenary terbaikmu, 
              lalu buktikan kehebatanmu dalam pertarungan strategis!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                  Mulai Petualangan
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3 text-lg">
                  Sudah Punya Akun
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Fitur Game
          </h2>
          <p className="text-slate-300 text-lg">
            Rasakan pengalaman bermain yang seru dan strategis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-xl">Turn-Based Combat</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-300">
                Sistem pertarungan bergiliran yang membutuhkan strategi dan perencanaan matang 
                untuk mengalahkan lawan.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-xl">Beragam Heroes</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-300">
                Pilih dari berbagai hero dengan kemampuan unik: Ksatria Pedang, Penyihir Api, 
                Pemanah Elven, dan Paladin Suci.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-xl">Mercenary System</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-300">
                Rekrut mercenary kuat seperti Assassin Bayangan, Berserker Orc, 
                Penyembuh Putih, dan Necromancer.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-xl">Real-time Database</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-300">
                Semua progress dan hasil battle tersimpan secara real-time 
                menggunakan SQL Server Microsoft.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-xl">Battle History</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-300">
                Lihat riwayat pertarunganmu dan analisis strategi untuk 
                meningkatkan kemampuan bermain.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-xl">Modern UI</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-300">
                Interface modern dan responsif yang memberikan pengalaman 
                bermain yang nyaman di semua perangkat.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How to Play Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Cara Bermain
          </h2>
          <p className="text-slate-300 text-lg">
            Ikuti langkah mudah ini untuk memulai petualanganmu
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-white text-lg font-semibold mb-2">Daftar Akun</h3>
            <p className="text-slate-300">
              Buat akun baru dengan username, email, dan password yang aman.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-white text-lg font-semibold mb-2">Pilih Hero</h3>
            <p className="text-slate-300">
              Pilih hero favoritmu berdasarkan stats HP, Attack, dan Defense.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-white text-lg font-semibold mb-2">Pilih Mercenary</h3>
            <p className="text-slate-300">
              Rekrut mercenary yang akan menjadi lawanmu dalam battle.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
              4
            </div>
            <h3 className="text-white text-lg font-semibold mb-2">Mulai Battle</h3>
            <p className="text-slate-300">
              Saksikan pertarungan seru dan lihat siapa yang akan menang!
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Siap Memulai Petualangan?
          </h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan pemain lain dan buktikan kehebatanmu 
            dalam dunia Atlantica Online yang penuh tantangan!
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-xl">
              Daftar Sekarang
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-400">
            <p>&copy; 2024 Atlantica Online. Dibuat dengan Next.js dan SQL Server.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
