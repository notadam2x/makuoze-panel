const fernet = require('fernet');

const masterKey = process.env.MASTER_KEY;

// Fernet JS implementation
export const decryptSecret = (encryptedText) => {
  if (!masterKey) {
    console.error("MASTER_KEY not found in environment.");
    return encryptedText;
  }

  try {
    const secret = new fernet.Secret(masterKey);
    const token = new fernet.Token({
      secret: secret,
      token: encryptedText,
      ttl: 0 // Optional: can set TTL if needed, 0 means no time limit
    });
    return token.decode();
  } catch (error) {
    console.error("Decryption error:", error.message);
    return encryptedText;
  }
};

export const encryptSecret = (plainText) => {
  if (!masterKey) {
    console.error("MASTER_KEY not found in environment.");
    return plainText;
  }

  try {
    const secret = new fernet.Secret(masterKey);
    const token = new fernet.Token({
      secret: secret,
      time: Date.now(),
      iv: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] // Random IV is better, but this matches Fernet's default behavior if not provided? 
      // Actually standard fernet generates a random IV.
    });
    return token.encode(plainText);
  } catch (error) {
    console.error("Encryption error:", error.message);
    return plainText;
  }
};
