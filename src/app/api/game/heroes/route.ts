import { NextRequest, NextResponse } from 'next/server';
import { getHeroes } from '@/lib/game';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
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

    // Ambil data heroes
    const heroes = await getHeroes();

    return NextResponse.json({
      success: true,
      data: heroes
    });

  } catch (error) {
    console.error('Error API heroes:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
