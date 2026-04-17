import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import clientPromise from '@/lib/db';

const uri = process.env.MONGODB_URI;
const dbName = process.env.DATABASE_NAME;

export async function GET(request) {
  const token = request.cookies.get('token')?.value;
  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
  }

  let links = {};
  
  // Fetch custom links based on role
  if (decoded.affiliate_name) {
    try {
      const client = await clientPromise;
      const db = client.db(dbName);

      const username = decoded.username.toLowerCase();
      const affiliateName = decoded.affiliate_name.toLowerCase();
      const isMaster = username === affiliateName;

      if (isMaster) {
        // Master: Fetch from config_affiliates
        const affiliate = await db.collection('config_affiliates').findOne({ name: decoded.affiliate_name });
        if (affiliate && affiliate.links) {
          links = affiliate.links;
        }
      } else {
        // Sub-Affiliate: Fetch from their OWN payer record
        const subPayer = await db.collection('config_payers').findOne({ 
          name: { $regex: new RegExp(`^${decoded.username}$`, 'i') } 
        });
        if (subPayer && subPayer.links) {
          links = subPayer.links;
        }
      }
    } catch (err) {
      console.error('Error fetching personalized links:', err);
    }
  }

  return NextResponse.json({
    username: decoded.username,
    affiliate_name: decoded.affiliate_name,
    role: decoded.role,
    links: links
  });
}
