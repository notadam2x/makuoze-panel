import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { verifyToken, hashPassword, comparePassword } from '@/lib/auth';

export async function POST(request) {
  const token = request.cookies.get('token')?.value;
  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
  }

  const { action, currentPassword, newPassword, payerId, newWalletAddress } = await request.json();

  try {
    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);

    // 1. Password Update Action
    if (action === 'update_password') {
      if (!currentPassword || !newPassword) {
        return NextResponse.json({ error: 'Current and new password are required.' }, { status: 400 });
      }

      const user = await db.collection('users').findOne({ username: decoded.username });
      if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

      const isMatch = await comparePassword(currentPassword, user.password);
      if (!isMatch) return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 });

      const hashedBuffer = await hashPassword(newPassword);
      await db.collection('users').updateOne(
        { username: decoded.username },
        { $set: { password: hashedBuffer } }
      );

      return NextResponse.json({ message: 'Password updated successfully.' });
    }

    // 2. Wallet Update Action
    if (action === 'update_wallet') {
      if (!payerId || !newWalletAddress) {
        return NextResponse.json({ error: 'Missing data.' }, { status: 400 });
      }

      const payer = await db.collection('config_payers').findOne({ id: payerId });
      if (!payer) return NextResponse.json({ error: 'Bot record not found.' }, { status: 404 });

      // Security Check: Only if the payer belongs to the logged-in affiliate
      if (payer.affiliate_name !== decoded.affiliate_name) {
        return NextResponse.json({ error: 'Unauthorized for this bot.' }, { status: 403 });
      }

      let updateField = '';
      if (payer.payer_type === 'affiliate_own') {
        updateField = 'wallet1';
      } else if (payer.payer_type === 'sub_affiliate') {
        updateField = 'wallet2';
      } else {
        return NextResponse.json({ error: 'This bot type wallet cannot be modified.' }, { status: 400 });
      }

      await db.collection('config_payers').updateOne(
        { id: payerId },
        { $set: { [updateField]: newWalletAddress } }
      );

      return NextResponse.json({ 
        message: 'Wallet address updated successfully.',
        field: updateField,
        address: newWalletAddress
      });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });

  } catch (error) {
    console.error('Settings API error:', error);
    return NextResponse.json({ error: 'Operation failed.' }, { status: 500 });
  }
}
