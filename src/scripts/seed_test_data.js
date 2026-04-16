const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load .env from root
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const uri = process.env.MONGODB_URI;
const dbName = process.env.DATABASE_NAME;

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const users = db.collection('users');
    const affiliates = db.collection('config_affiliates');
    const payers = db.collection('config_payers');
    const transactions = db.collection('transactions');

    const masterName = "cryptoking";
    const subName = "dcchannel01";
    const targetPassiveTotal = 2.13;
    const numTxs = 7;

    console.log(`🚀 Seeding data for ${masterName} and ${subName}...`);

    // 1. Clean up existing test data
    await users.deleteMany({ username: { $in: [masterName.lower(), subName.lower()] } });
    await affiliates.deleteMany({ name: masterName });
    await payers.deleteMany({ name: subName });
    await transactions.deleteMany({ affiliate_name: masterName, payer_name: subName });

    // 2. Create Master User/Affiliate
    const hashedPassword = await bcrypt.hash("makuoze123", 10);
    const hashedAdmin = await bcrypt.hash("makuozeadmin", 10);
    
    await users.insertOne({
      username: masterName.toLowerCase(),
      password: hashedPassword,
      admin_password: hashedAdmin,
      affiliate_name: masterName,
      role: 'affiliate',
      created_at: new Date()
    });
    
    await affiliates.insertOne({
      name: masterName,
      links: {}
    });
    console.log(`✅ Created master user: ${masterName}`);

    // 3. Create Sub-Affiliate Payer & User
    const payerId = 'mock-payer-' + Math.random().toString(36).substring(7);
    await payers.insertOne({
      id: payerId,
      name: subName,
      secret_key: 'ENCRYPTED_MOCK_KEY',
      payer_type: 'sub_affiliate',
      affiliate_name: masterName,
      wallet1: 'SubAffiliateWalletAddressBase58',
      wallet2: 'PartnerWalletAddressBase58',
      wallet3: 'SystemWalletAddressBase58',
      sol_buffer: 0.01,
      split_percent_w1: 50,
      split_percent_w2: 25,
      split_percent_w3: 25,
      is_active: true,
      links: {}
    });
    
    await users.insertOne({
      username: subName.toLowerCase(),
      password: hashedPassword,
      admin_password: hashedAdmin,
      affiliate_name: masterName,
      role: 'affiliate',
      created_at: new Date()
    });
    console.log(`✅ Created sub-affiliate payer: ${subName}`);

    // 4. Generate 7 Transactions
    let passiveShares = [];
    let remaining = targetPassiveTotal;
    for (let i = 0; i < numTxs - 1; i++) {
      let share = parseFloat((Math.random() * (remaining / (numTxs - i))).toFixed(4));
      passiveShares.push(share);
      remaining -= share;
    }
    passiveShares.push(parseFloat(remaining.toFixed(4)));
    
    // Shuffle shares
    passiveShares = passiveShares.sort(() => Math.random() - 0.5);

    const txs = [];
    const now = new Date();
    
    for (let i = 0; i < numTxs; i++) {
      let totalSol = parseFloat((Math.random() * (7.0 - 0.5) + 0.5).toFixed(4));
      let pEarn = passiveShares[i]; // Partner's share

      if (totalSol < pEarn + 0.1) {
        totalSol = pEarn + parseFloat((Math.random() * 0.9 + 0.1).toFixed(4));
      }
            
      const remainingVol = totalSol - pEarn;
      const w1Sol = parseFloat((remainingVol * 0.66).toFixed(4));
      const w3Sol = parseFloat((remainingVol - w1Sol).toFixed(4));
      
      const timestamp = new Date(now.getTime() - (Math.random() * 2 * 24 * 60 * 60 * 1000));
      
      txs.push({
        timestamp: timestamp,
        payer_id: payerId,
        payer_name: subName,
        affiliate_name: masterName,
        payer_type: 'sub_affiliate',
        total_sol: parseFloat(totalSol),
        wallet1_sol: parseFloat(w1_sol),
        wallet2_sol: parseFloat(p_earn), // Master's Passive Income
        wallet3_sol: parseFloat(w3_sol),
        status: 'confirmed',
        signature: 'TEST_SIG_' + Math.random().toString(36).substring(7).toUpperCase()
      });
    }

    await transactions.insertMany(txs);
    console.log(`✅ Generated ${numTxs} transactions for ${masterName}`);
    console.log(`✨ Seeding complete!`);

  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await client.close();
  }
}

seed();
