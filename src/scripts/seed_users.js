const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env.local') });

const uri = process.env.MONGODB_URI;
const dbName = process.env.DATABASE_NAME;

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const users = db.collection('users');

    const affiliateName = 'CHILL-DUDE';
    const password = 'changeme123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const existing = await users.findOne({ username: 'chill_dude' });
    if (existing) {
      console.log('User chill_dude already exists.');
    } else {
      await users.insertOne({
        username: 'chill_dude',
        password: hashedPassword,
        affiliate_name: affiliateName,
        role: 'affiliate',
        created_at: new Date(),
      });
      console.log(`Created user chill_dude for affiliate ${affiliateName} with password: ${password}`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

seed();
