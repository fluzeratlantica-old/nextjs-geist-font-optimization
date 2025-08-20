import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sql from 'mssql';
import { getConnection } from './database';

const JWT_SECRET = process.env.JWT_SECRET || 'atlantica-game-secret-key';

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: Date;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

// Registrasi user baru
export async function registerUser(
  username: string, 
  email: string, 
  password: string
): Promise<AuthResponse> {
  try {
    const connection = await getConnection();
    
    // Cek apakah username atau email sudah ada
    const existingUser = await connection.request()
      .input('username', sql.NVarChar, username)
      .input('email', sql.NVarChar, email)
      .query(`
        SELECT id FROM users 
        WHERE username = @username OR email = @email
      `);

    if (existingUser.recordset.length > 0) {
      return {
        success: false,
        message: 'Username atau email sudah terdaftar'
      };
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user baru
    const result = await connection.request()
      .input('username', sql.NVarChar, username)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, hashedPassword)
      .query(`
        INSERT INTO users (username, email, password)
        OUTPUT INSERTED.id, INSERTED.username, INSERTED.email, INSERTED.created_at
        VALUES (@username, @email, @password)
      `);

    const newUser = result.recordset[0];
    
    return {
      success: true,
      message: 'Registrasi berhasil',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        created_at: newUser.created_at
      }
    };

  } catch (error) {
    console.error('Error registrasi:', error);
    return {
      success: false,
      message: 'Terjadi kesalahan saat registrasi'
    };
  }
}

// Login user
export async function loginUser(
  username: string, 
  password: string
): Promise<AuthResponse> {
  try {
    const connection = await getConnection();
    
    // Cari user berdasarkan username
    const result = await connection.request()
      .input('username', sql.NVarChar, username)
      .query(`
        SELECT id, username, email, password, created_at 
        FROM users 
        WHERE username = @username
      `);

    if (result.recordset.length === 0) {
      return {
        success: false,
        message: 'Username atau password salah'
      };
    }

    const user = result.recordset[0];
    
    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Username atau password salah'
      };
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      success: true,
      message: 'Login berhasil',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at
      },
      token
    };

  } catch (error) {
    console.error('Error login:', error);
    return {
      success: false,
      message: 'Terjadi kesalahan saat login'
    };
  }
}

// Verifikasi token JWT
export function verifyToken(token: string): { userId: number; username: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      userId: decoded.userId,
      username: decoded.username
    };
  } catch (error) {
    console.error('Error verifikasi token:', error);
    return null;
  }
}

// Get user by ID
export async function getUserById(userId: number): Promise<User | null> {
  try {
    const connection = await getConnection();
    
    const result = await connection.request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT id, username, email, created_at 
        FROM users 
        WHERE id = @userId
      `);

    if (result.recordset.length === 0) {
      return null;
    }

    const user = result.recordset[0];
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at
    };

  } catch (error) {
    console.error('Error get user:', error);
    return null;
  }
}

// Client-side helper functions untuk localStorage
export const clientAuth = {
  // Simpan token ke localStorage
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  },

  // Ambil token dari localStorage
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },

  // Hapus token dari localStorage
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');
    }
  },

  // Simpan data user ke localStorage
  setUser: (user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('current_user', JSON.stringify(user));
    }
  },

  // Ambil data user dari localStorage
  getUser: (): User | null => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('current_user');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  },

  // Cek apakah user sudah login
  isAuthenticated: (): boolean => {
    const token = clientAuth.getToken();
    const user = clientAuth.getUser();
    return !!(token && user);
  }
};
