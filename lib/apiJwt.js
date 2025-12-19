import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.API_JWT_SECRET;
if (!secretKey) {
  throw new Error('API_JWT_SECRET manquant dans .env');
}
const secret = new TextEncoder().encode(secretKey);

const ROLE_ORDER = {
  USER: 1,
  EDITOR: 2,
  ADMIN: 3,
};

export function hasMinRole(userRole, minRole) {
  if (!ROLE_ORDER[userRole] || !ROLE_ORDER[minRole]) return false;
  return ROLE_ORDER[userRole] >= ROLE_ORDER[minRole];
}

export async function signApiJwt(user) {
  return new SignJWT({
    sub: String(user.id),
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(secret);
}

export async function verifyApiJwt(token) {
  const { payload } = await jwtVerify(token, secret);
  return payload;
}
