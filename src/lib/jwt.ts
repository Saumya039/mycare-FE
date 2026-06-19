import { SignJWT, jwtVerify } from "jose"

const getJwtSecretKey = () => {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret || secret.length === 0) {
    throw new Error("The environment variable NEXTAUTH_SECRET is not set.")
  }
  return secret
}

export const signToken = async (
  payload: { sub: string; email: string; role: string; name: string; department?: string },
  options: { exp: string }
) => {
  try {
    const secret = new TextEncoder().encode(getJwtSecretKey())
    const alg = "HS256"
    return new SignJWT(payload)
      .setProtectedHeader({ alg })
      .setExpirationTime(options.exp)
      .setIssuedAt()
      .setSubject(payload.sub)
      .sign(secret)
  } catch (error) {
    throw error
  }
}

export const verifyToken = async <T>(token: string): Promise<T> => {
  try {
    const secret = new TextEncoder().encode(getJwtSecretKey())
    const { payload } = await jwtVerify(token, secret)
    return payload as T
  } catch (error) {
    throw new Error("Your token has expired or is invalid.")
  }
}
