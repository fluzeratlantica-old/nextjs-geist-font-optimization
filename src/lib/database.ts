import sql from 'mssql';

const config: sql.config = {
  server: '192.168.100.100',
  database: 'ATWEBGAMING',
  user: 'sa',
  password: 'passwordanda',
  port: 1433,
  options: {
    encrypt: false, // Untuk development lokal
    trustServerCertificate: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool: sql.ConnectionPool | null = null;

export async function getConnection(): Promise<sql.ConnectionPool> {
  try {
    if (!pool) {
      pool = new sql.ConnectionPool(config);
      await pool.connect();
      console.log('Terhubung ke SQL Server');
    }
    return pool;
  } catch (error) {
    console.error('Error koneksi database:', error);
    throw error;
  }
}

export async function closeConnection(): Promise<void> {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log('Koneksi database ditutup');
    }
  } catch (error) {
    console.error('Error menutup koneksi:', error);
  }
}

// Inisialisasi tabel database
export async function initializeDatabase(): Promise<void> {
  try {
    const connection = await getConnection();
    
    // Tabel Users
    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
      CREATE TABLE users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        username NVARCHAR(50) UNIQUE NOT NULL,
        email NVARCHAR(100) UNIQUE NOT NULL,
        password NVARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
      )
    `);

    // Tabel Heroes
    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='heroes' AND xtype='U')
      CREATE TABLE heroes (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(50) NOT NULL,
        hp INT NOT NULL,
        attack INT NOT NULL,
        defense INT NOT NULL,
        description NVARCHAR(255),
        image_url NVARCHAR(255),
        created_at DATETIME DEFAULT GETDATE()
      )
    `);

    // Tabel Mercenaries
    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='mercenaries' AND xtype='U')
      CREATE TABLE mercenaries (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(50) NOT NULL,
        hp INT NOT NULL,
        attack INT NOT NULL,
        defense INT NOT NULL,
        description NVARCHAR(255),
        image_url NVARCHAR(255),
        created_at DATETIME DEFAULT GETDATE()
      )
    `);

    // Tabel Game Sessions
    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='game_sessions' AND xtype='U')
      CREATE TABLE game_sessions (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL,
        hero_id INT NOT NULL,
        mercenary_id INT NOT NULL,
        battle_result NVARCHAR(MAX),
        created_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (hero_id) REFERENCES heroes(id),
        FOREIGN KEY (mercenary_id) REFERENCES mercenaries(id)
      )
    `);

    console.log('Database berhasil diinisialisasi');
    
    // Insert data awal heroes jika belum ada
    const heroCount = await connection.request().query('SELECT COUNT(*) as count FROM heroes');
    if (heroCount.recordset[0].count === 0) {
      await insertInitialData(connection);
    }

  } catch (error) {
    console.error('Error inisialisasi database:', error);
    throw error;
  }
}

// Insert data awal
async function insertInitialData(connection: sql.ConnectionPool): Promise<void> {
  // Data Heroes
  const heroes = [
    { name: 'Ksatria Pedang', hp: 120, attack: 25, defense: 15, description: 'Pejuang tangguh dengan pedang legendaris' },
    { name: 'Penyihir Api', hp: 80, attack: 35, defense: 8, description: 'Master sihir api yang menghancurkan' },
    { name: 'Pemanah Elven', hp: 90, attack: 30, defense: 12, description: 'Pemanah akurat dari hutan elven' },
    { name: 'Paladin Suci', hp: 140, attack: 20, defense: 20, description: 'Pelindung suci dengan kekuatan cahaya' }
  ];

  // Data Mercenaries
  const mercenaries = [
    { name: 'Assassin Bayangan', hp: 70, attack: 40, defense: 5, description: 'Pembunuh cepat dari kegelapan' },
    { name: 'Berserker Orc', hp: 110, attack: 28, defense: 10, description: 'Pejuang brutal yang tak kenal takut' },
    { name: 'Penyembuh Putih', hp: 60, attack: 15, defense: 18, description: 'Penyembuh dengan kekuatan restorasi' },
    { name: 'Necromancer', hp: 75, attack: 32, defense: 8, description: 'Penguasa kematian dan arwah gelap' }
  ];

  // Insert heroes
  for (const hero of heroes) {
    await connection.request()
      .input('name', sql.NVarChar, hero.name)
      .input('hp', sql.Int, hero.hp)
      .input('attack', sql.Int, hero.attack)
      .input('defense', sql.Int, hero.defense)
      .input('description', sql.NVarChar, hero.description)
      .query(`
        INSERT INTO heroes (name, hp, attack, defense, description)
        VALUES (@name, @hp, @attack, @defense, @description)
      `);
  }

  // Insert mercenaries
  for (const mercenary of mercenaries) {
    await connection.request()
      .input('name', sql.NVarChar, mercenary.name)
      .input('hp', sql.Int, mercenary.hp)
      .input('attack', sql.Int, mercenary.attack)
      .input('defense', sql.Int, mercenary.defense)
      .input('description', sql.NVarChar, mercenary.description)
      .query(`
        INSERT INTO mercenaries (name, hp, attack, defense, description)
        VALUES (@name, @hp, @attack, @defense, @description)
      `);
  }

  console.log('Data awal berhasil dimasukkan');
}
