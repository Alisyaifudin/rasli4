import seedrandom from "seedrandom";
import crypto from "crypto";

export function encryptString(
  stringToEncrypt: string,
  encryptionKey: string,
  seed: string
): string {
  const key = crypto.scryptSync(encryptionKey, "salt", 32);
  const ivBuffer = new Uint8Array(16);
  const ivRandom = seedrandom(seed);
  for (let i = 0; i < 16; i++) {
    ivBuffer[i] = Math.floor(ivRandom() * 256);
  }
  const cipher = crypto.createCipheriv("aes-256-cbc", key, ivBuffer);
  let encryptedString = cipher.update(stringToEncrypt, "utf8", "hex");
  encryptedString += cipher.final("hex");
  const encryptedStringWithIV = Buffer.concat([
    ivBuffer,
    Buffer.from(encryptedString, "hex"),
  ]);
  return encryptedStringWithIV.toString("hex");
}

export function decryptString(
  encryptedString: string,
  encryptionKey: string
): string {
  const encryptedBuffer = Buffer.from(encryptedString, "hex");
  const ivBuffer = encryptedBuffer.subarray(0, 16);
  const encryptedData = encryptedBuffer.subarray(16);
  const key = crypto.scryptSync(encryptionKey, "salt", 32);
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, ivBuffer);
  let decryptedString = decipher.update(encryptedData);
  decryptedString = Buffer.concat([decryptedString, decipher.final()]);
  return decryptedString.toString("utf8");
}
