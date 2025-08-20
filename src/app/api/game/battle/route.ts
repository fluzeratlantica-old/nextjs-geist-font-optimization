import { NextRequest, NextResponse } from 'next/server';
import { getHeroById, getMercenaryById, startBattle, saveBattleResult } from '@/lib/game';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Verifikasi token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Token tidak valid' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Token tidak valid' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { heroId, mercenaryId } = body;

    // Validasi input
    if (!heroId || !mercenaryId) {
      return NextResponse.json(
        { success: false, message: 'Hero dan mercenary harus dipilih' },
        { status: 400 }
      );
    }

    // Ambil data hero dan mercenary
    const hero = await getHeroById(heroId);
    const mercenary = await getMercenaryById(mercenaryId);

    if (!hero) {
      return NextResponse.json(
        { success: false, message: 'Hero tidak ditemukan' },
        { status: 404 }
      );
    }

    if (!mercenary) {
      return NextResponse.json(
        { success: false, message: 'Mercenary tidak ditemukan' },
        { status: 404 }
      );
    }

    // Mulai battle
    const battleResult = startBattle(hero, mercenary);

    // Simpan hasil battle ke database
    const saved = await saveBattleResult(decoded.userId, heroId, mercenaryId, battleResult);

    return NextResponse.json({
      success: true,
      data: {
        hero: hero.name,
        mercenary: mercenary.name,
        result: battleResult,
        saved
      }
    });

  } catch (error) {
    console.error('Error API battle:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
