import { NextRequest, NextResponse } from 'next/server';
import { getMercenaries } from '@/lib/game';
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

    // Ambil data mercenaries
    const mercenaries = await getMercenaries();

    return NextResponse.json({
      success: true,
      data: mercenaries
    });

  } catch (error) {
    console.error('Error API mercenaries:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
