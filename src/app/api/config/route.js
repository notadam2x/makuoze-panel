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

  try {
    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    const payers = db.collection('config_payers');

    const query = isMaster 
      ? { affiliate_name: affiliateName } 
      : { name: { $regex: new RegExp(`^${username}$`, 'i') } };

    const affiliateBots = await payers
      .find(query)
      .toArray();

    return NextResponse.json(affiliateBots.map(bot => ({
      id: bot.id,
      name: bot.name,
      payer_type: bot.payer_type,
      wallet1: bot.wallet1,
      wallet2: bot.wallet2,
      wallet3: bot.wallet3,
      split_percent_w1: bot.split_percent_w1,
      split_percent_w2: bot.split_percent_w2,
      split_percent_w3: bot.split_percent_w3,
      is_active: bot.is_active
    })));
  } catch (error) {
    console.error('Config API error:', error);
    return NextResponse.json({ error: 'Error fetching bot configurations.' }, { status: 500 });
  }
}
