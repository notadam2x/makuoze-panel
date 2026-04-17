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
    const transactions = db.collection('transactions');

    // 1. Total Volume Filter: Master sees all, Sub sees only their own payer name
    const queryMaster = { affiliate_name: affiliateName };
    const querySub = { payer_name: { $regex: new RegExp(`^${username}$`, 'i') } };
    const baseQuery = isMaster ? queryMaster : querySub;

    // 1. Total Volume Generated (Filtered)
    const totalResult = await transactions.aggregate([
      { $match: baseQuery },
      { $group: { _id: null, total: { $sum: '$total_sol' } } }
    ]).toArray();
    const totalVolume = totalResult[0]?.total || 0;

    // 2. Personal Earnings (Filtered)
    // Master gets wallet1 from 'affiliate_own'
    // Sub-Affiliate gets wallet1 from their 'sub_affiliate' records
    const peQueryMaster = { affiliate_name: affiliateName, payer_type: 'affiliate_own' };
    const peQuerySub = { payer_name: { $regex: new RegExp(`^${username}$`, 'i') } };
    const peQuery = isMaster ? peQueryMaster : peQuerySub;
    
    const personalEarningsResult = await transactions.aggregate([
      { $match: peQuery },
      { $group: { _id: null, total: { $sum: '$wallet1_sol' } } }
    ]).toArray();
    const personalEarnings = personalEarningsResult[0]?.total || 0;

    // 3. Sub-Affiliate Passive Earnings (Only for Masters)
    let subEarnings = 0;
    if (isMaster) {
      const subEarningsResult = await transactions.aggregate([
        { $match: { affiliate_name: affiliateName, payer_type: 'sub_affiliate' } },
        { $group: { _id: null, total: { $sum: '$wallet2_sol' } } }
      ]).toArray();
      subEarnings = subEarningsResult[0]?.total || 0;
    }

    // 4. Volume by Bot/Contract (Filtered)
    const volByContract = await transactions.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: '$payer_name',
          volume: { $sum: '$total_sol' },
          type: { $first: '$payer_type' }
        }
      },
      { $sort: { volume: -1 } }
    ]).toArray();

    return NextResponse.json({
      total_volume: Number(totalVolume.toFixed(4)),
      personal_earnings: Number(personalEarnings.toFixed(4)),
      sub_affiliate_earnings: Number(subEarnings.toFixed(4)),
      vol_by_contract: volByContract.map(c => ({
        name: c._id,
        volume: Number(c.volume.toFixed(4)),
        type: c.type
      }))
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json({ error: 'Error fetching data.' }, { status: 500 });
  }
}
