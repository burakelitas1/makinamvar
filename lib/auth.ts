const COOKIE_NAME = 'admin_token'
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 gün

async function getKey(): Promise<CryptoKey> {
  const enc = new TextEncoder()
  return crypto.subtle.importKey(
    'raw',
    enc.encode(process.env.ADMIN_JWT_SECRET!),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

export async function createAdminToken(): Promise<string> {
  const payload = JSON.stringify({ exp: Date.now() + TOKEN_TTL_MS })
  const encoded = btoa(payload)
  const key = await getKey()
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(encoded))
  const sigB64 = btoa(String.fromCharCode(...Array.from(new Uint8Array(sig))))
  return `${encoded}.${sigB64}`
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const [encoded, sigB64] = token.split('.')
    if (!encoded || !sigB64) return false
    const key = await getKey()
    const sig = Uint8Array.from(atob(sigB64), (c) => c.charCodeAt(0))
    const valid = await crypto.subtle.verify(
      'HMAC', key, sig, new TextEncoder().encode(encoded)
    )
    if (!valid) return false
    const { exp } = JSON.parse(atob(encoded))
    return Date.now() < exp
  } catch {
    return false
  }
}

export { COOKIE_NAME }
