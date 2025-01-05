import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!; // Your key from environment variable
const IV_LENGTH = 16; // AES block size (CBC mode)

const ensureKeyLength = (key: string) => {
  const bufferKey = Buffer.from(key, 'utf-8');
  if (bufferKey.length === 32) {
    return bufferKey;
  } else if (bufferKey.length > 32) {
    return bufferKey.slice(0, 32); // Truncate to 32 bytes
  } else {
    const paddedKey = Buffer.concat([bufferKey, Buffer.alloc(32 - bufferKey.length, 0)]); // Pad with zeros
    return paddedKey;
  }
};

export const encryptToken = (token: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH); // 16 bytes IV for AES-CBC
  const key = ensureKeyLength(ENCRYPTION_KEY); // Ensure key is 32 bytes long
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return `${iv.toString('hex')}:${encrypted}`;
};

export const decryptToken = (encryptedToken: string): string => {
  const [iv, encrypted] = encryptedToken.split(':');
  const key = ensureKeyLength(ENCRYPTION_KEY); // Ensure key is 32 bytes long
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};
