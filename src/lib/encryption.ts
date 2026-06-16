import crypto from "crypto"

const algorithm = "aes-256-cbc"

/**
 * Encrypt sensitive data using AES-256-CBC
 * Returns base64 encoded string with iv:encrypted format
 */
export function encrypt(text: string, encryptionKey?: string): string {
  const key = encryptionKey || process.env.ENCRYPTION_KEY
  if (!key) {
    console.warn("ENCRYPTION_KEY not set, returning plaintext")
    return text
  }

  try {
    const hash = crypto.createHash("sha256").update(key).digest()
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(algorithm, hash, iv)

    let encrypted = cipher.update(text, "utf8", "hex")
    encrypted += cipher.final("hex")

    return `${iv.toString("hex")}:${encrypted}`
  } catch (error) {
    console.error("Encryption error:", error)
    return text
  }
}

/**
 * Decrypt AES-256-CBC encrypted data
 * Expects base64 encoded string with iv:encrypted format
 */
export function decrypt(encryptedText: string, encryptionKey?: string): string {
  const key = encryptionKey || process.env.ENCRYPTION_KEY
  if (!key) {
    console.warn("ENCRYPTION_KEY not set, returning as-is")
    return encryptedText
  }

  try {
    const parts = encryptedText.split(":")
    if (parts.length !== 2) {
      return encryptedText
    }

    const hash = crypto.createHash("sha256").update(key).digest()
    const iv = Buffer.from(parts[0], "hex")
    const encrypted = parts[1]

    const decipher = crypto.createDecipheriv(algorithm, hash, iv)
    let decrypted = decipher.update(encrypted, "hex", "utf8")
    decrypted += decipher.final("utf8")

    return decrypted
  } catch (error) {
    console.error("Decryption error:", error)
    return encryptedText
  }
}

/**
 * Hash password using bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import("bcryptjs")
  return bcrypt.hash(password, 10)
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = await import("bcryptjs")
  return bcrypt.compare(password, hash)
}

/**
 * Generate random PIN
 */
export function generatePin(length: number = 6): string {
  const digits = "0123456789"
  let pin = ""
  for (let i = 0; i < length; i++) {
    pin += digits[Math.floor(Math.random() * digits.length)]
  }
  return pin
}
