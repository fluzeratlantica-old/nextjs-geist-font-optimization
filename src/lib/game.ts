import sql from 'mssql';
import { getConnection } from './database';

export interface Character {
  id: number;
  name: string;
  hp: number;
  attack: number;
  defense: number;
  description: string;
  image_url?: string;
}

export interface BattleLog {
  round: number;
  attacker: string;
  defender: string;
  damage: number;
  remainingHp: number;
  message: string;
}

export interface BattleResult {
  winner: 'hero' | 'mercenary' | 'draw';
  battleLog: BattleLog[];
  totalRounds: number;
}

// Ambil semua heroes dari database
export async function getHeroes(): Promise<Character[]> {
  try {
    const connection = await getConnection();
    
    const result = await connection.request().query(`
      SELECT id, name, hp, attack, defense, description, image_url
      FROM heroes
      ORDER BY name
    `);

    return result.recordset.map(hero => ({
      id: hero.id,
      name: hero.name,
      hp: hero.hp,
      attack: hero.attack,
      defense: hero.defense,
      description: hero.description,
      image_url: hero.image_url
    }));

  } catch (error) {
    console.error('Error mengambil heroes:', error);
    return [];
  }
}

// Ambil semua mercenaries dari database
export async function getMercenaries(): Promise<Character[]> {
  try {
    const connection = await getConnection();
    
    const result = await connection.request().query(`
      SELECT id, name, hp, attack, defense, description, image_url
      FROM mercenaries
      ORDER BY name
    `);

    return result.recordset.map(mercenary => ({
      id: mercenary.id,
      name: mercenary.name,
      hp: mercenary.hp,
      attack: mercenary.attack,
      defense: mercenary.defense,
      description: mercenary.description,
      image_url: mercenary.image_url
    }));

  } catch (error) {
    console.error('Error mengambil mercenaries:', error);
    return [];
  }
}

// Ambil hero berdasarkan ID
export async function getHeroById(heroId: number): Promise<Character | null> {
  try {
    const connection = await getConnection();
    
    const result = await connection.request()
      .input('heroId', sql.Int, heroId)
      .query(`
        SELECT id, name, hp, attack, defense, description, image_url
        FROM heroes
        WHERE id = @heroId
      `);

    if (result.recordset.length === 0) {
      return null;
    }

    const hero = result.recordset[0];
    return {
      id: hero.id,
      name: hero.name,
      hp: hero.hp,
      attack: hero.attack,
      defense: hero.defense,
      description: hero.description,
      image_url: hero.image_url
    };

  } catch (error) {
    console.error('Error mengambil hero:', error);
    return null;
  }
}

// Ambil mercenary berdasarkan ID
export async function getMercenaryById(mercenaryId: number): Promise<Character | null> {
  try {
    const connection = await getConnection();
    
    const result = await connection.request()
      .input('mercenaryId', sql.Int, mercenaryId)
      .query(`
        SELECT id, name, hp, attack, defense, description, image_url
        FROM mercenaries
        WHERE id = @mercenaryId
      `);

    if (result.recordset.length === 0) {
      return null;
    }

    const mercenary = result.recordset[0];
    return {
      id: mercenary.id,
      name: mercenary.name,
      hp: mercenary.hp,
      attack: mercenary.attack,
      defense: mercenary.defense,
      description: mercenary.description,
      image_url: mercenary.image_url
    };

  } catch (error) {
    console.error('Error mengambil mercenary:', error);
    return null;
  }
}

// Hitung damage berdasarkan attack dan defense
function calculateDamage(attackPower: number, defense: number): number {
  // Formula damage: attack - (defense / 2) + random(1-5)
  const baseDamage = attackPower - Math.floor(defense / 2);
  const randomBonus = Math.floor(Math.random() * 5) + 1;
  const finalDamage = Math.max(1, baseDamage + randomBonus); // Minimal damage 1
  
  return finalDamage;
}

// Simulasi battle turn-based
export function startBattle(hero: Character, mercenary: Character): BattleResult {
  try {
    // Validasi input
    if (!hero || !mercenary) {
      throw new Error('Hero dan mercenary harus dipilih');
    }

    const battleLog: BattleLog[] = [];
    let heroHp = hero.hp;
    let mercenaryHp = mercenary.hp;
    let round = 1;
    const maxRounds = 20; // Batas maksimal round untuk menghindari infinite loop

    // Battle loop
    while (heroHp > 0 && mercenaryHp > 0 && round <= maxRounds) {
      // Hero menyerang terlebih dahulu
      if (heroHp > 0) {
        const damage = calculateDamage(hero.attack, mercenary.defense);
        mercenaryHp = Math.max(0, mercenaryHp - damage);
        
        battleLog.push({
          round,
          attacker: hero.name,
          defender: mercenary.name,
          damage,
          remainingHp: mercenaryHp,
          message: `${hero.name} menyerang ${mercenary.name} dengan damage ${damage}. HP ${mercenary.name}: ${mercenaryHp}`
        });

        // Cek apakah mercenary kalah
        if (mercenaryHp <= 0) {
          battleLog.push({
            round,
            attacker: '',
            defender: '',
            damage: 0,
            remainingHp: 0,
            message: `${mercenary.name} telah dikalahkan! ${hero.name} menang!`
          });
          break;
        }
      }

      // Mercenary menyerang balik
      if (mercenaryHp > 0) {
        const damage = calculateDamage(mercenary.attack, hero.defense);
        heroHp = Math.max(0, heroHp - damage);
        
        battleLog.push({
          round,
          attacker: mercenary.name,
          defender: hero.name,
          damage,
          remainingHp: heroHp,
          message: `${mercenary.name} menyerang balik ${hero.name} dengan damage ${damage}. HP ${hero.name}: ${heroHp}`
        });

        // Cek apakah hero kalah
        if (heroHp <= 0) {
          battleLog.push({
            round,
            attacker: '',
            defender: '',
            damage: 0,
            remainingHp: 0,
            message: `${hero.name} telah dikalahkan! ${mercenary.name} menang!`
          });
          break;
        }
      }

      round++;
    }

    // Tentukan pemenang
    let winner: 'hero' | 'mercenary' | 'draw';
    if (heroHp > 0 && mercenaryHp <= 0) {
      winner = 'hero';
    } else if (mercenaryHp > 0 && heroHp <= 0) {
      winner = 'mercenary';
    } else {
      winner = 'draw';
      battleLog.push({
        round: round - 1,
        attacker: '',
        defender: '',
        damage: 0,
        remainingHp: 0,
        message: 'Pertarungan berakhir seri! Kedua pejuang masih berdiri.'
      });
    }

    return {
      winner,
      battleLog,
      totalRounds: round - 1
    };

  } catch (error) {
    console.error('Error dalam battle:', error);
    return {
      winner: 'draw',
      battleLog: [{
        round: 0,
        attacker: '',
        defender: '',
        damage: 0,
        remainingHp: 0,
        message: 'Terjadi kesalahan dalam pertarungan'
      }],
      totalRounds: 0
    };
  }
}

// Simpan hasil battle ke database
export async function saveBattleResult(
  userId: number,
  heroId: number,
  mercenaryId: number,
  battleResult: BattleResult
): Promise<boolean> {
  try {
    const connection = await getConnection();
    
    await connection.request()
      .input('userId', sql.Int, userId)
      .input('heroId', sql.Int, heroId)
      .input('mercenaryId', sql.Int, mercenaryId)
      .input('battleResult', sql.NVarChar, JSON.stringify(battleResult))
      .query(`
        INSERT INTO game_sessions (user_id, hero_id, mercenary_id, battle_result)
        VALUES (@userId, @heroId, @mercenaryId, @battleResult)
      `);

    return true;

  } catch (error) {
    console.error('Error menyimpan battle result:', error);
    return false;
  }
}

// Ambil riwayat battle user
export async function getUserBattleHistory(userId: number): Promise<any[]> {
  try {
    const connection = await getConnection();
    
    const result = await connection.request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT 
          gs.id,
          gs.created_at,
          gs.battle_result,
          h.name as hero_name,
          m.name as mercenary_name
        FROM game_sessions gs
        JOIN heroes h ON gs.hero_id = h.id
        JOIN mercenaries m ON gs.mercenary_id = m.id
        WHERE gs.user_id = @userId
        ORDER BY gs.created_at DESC
      `);

    return result.recordset.map(session => ({
      id: session.id,
      created_at: session.created_at,
      hero_name: session.hero_name,
      mercenary_name: session.mercenary_name,
      battle_result: JSON.parse(session.battle_result)
    }));

  } catch (error) {
    console.error('Error mengambil riwayat battle:', error);
    return [];
  }
}
