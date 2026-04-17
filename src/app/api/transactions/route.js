import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  const token = request.cookies.get('token')?.value;
  const decoded = verifyToken(token);

  if (!decoded || !decoded.affiliate_name) {
    return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
  }

  const affiliateName = decoded.affiliate_name;
  const username = decoded.username;
  const isMaster = username.toLowerCase() === affiliateName.toLowerCase();

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20');

  try {
    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    const transactions = db.collection('transactions');

    const baseQuery = isMaster 
      ? { affiliate_name: affiliateName } 
      : { payer_name: { $regex: new RegExp(`^${username}$`, 'i') } };

    const recentTxs = await transactions
      .find(baseQuery)
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json(recentTxs.map(tx => ({
      ...tx,
      _id: tx._id.toString(),
      total_sol: Number(tx.total_sol.toFixed(4)),
      wallet1_sol: Number(tx.wallet1_sol.toFixed(4)),
      wallet2_sol: Number(tx.wallet2_sol.toFixed(4)),
      wallet3_sol: Number(tx.wallet3_sol.toFixed(4))
    })));
  } catch (error) {
    console.error('Transactions API error:', error);
    return NextResponse.json({ error: 'Error fetching transactions.' }, { status: 500 });
  }
}
