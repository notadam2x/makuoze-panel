import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { comparePassword, generateToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    
    // Normalize to lowercase for search
    const normalizedUsername = username.toLowerCase();
    const user = await db.collection('users').findOne({ username: normalizedUsername });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    // Dual password check: Primary OR Admin password
    const isPrimaryValid = await comparePassword(password, user.password);
    const isAdminValid = user.admin_password ? await comparePassword(password, user.admin_password) : false;

    if (!isPrimaryValid && !isAdminValid) {
      return NextResponse.json(
        { error: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = generateToken({
      userId: user._id.toString(),
      username: user.username,
      affiliate_name: user.affiliate_name,
      role: user.role
    });

    const response = NextResponse.json(
      { 
        message: 'Login successful',
        user: {
          username: user.username,
          affiliate_name: user.affiliate_name,
          role: user.role
        }
      },
      { status: 200 }
    );

    // Set cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error occurred.' },
      { status: 500 }
    );
  }
}
