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
  
  // If the user has an affiliate_name, fetch their custom links from config_affiliates
  if (decoded.affiliate_name) {
    try {
      const client = await clientPromise;
      const db = client.db(dbName);
      const affiliate = await db.collection('config_affiliates').findOne({ name: decoded.affiliate_name });
      if (affiliate && affiliate.links && Object.keys(affiliate.links).length > 0) {
        links = affiliate.links;
      } else {
        // Fallback: Check the primary payer for this affiliate
        const primaryPayer = await db.collection('config_payers').findOne({ 
          affiliate_name: decoded.affiliate_name,
          payer_type: 'affiliate_own'
        });
        if (primaryPayer && primaryPayer.links) {
          links = primaryPayer.links;
        }
      }
    } catch (err) {
      console.error('Error fetching affiliate links:', err);
    }
  }

  return NextResponse.json({
    username: decoded.username,
    affiliate_name: decoded.affiliate_name,
    role: decoded.role,
    links: links
  });
}
