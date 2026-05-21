import { randomBytes } from 'node:crypto';
import { p as prisma } from './db_xR3SC8vL.mjs';

const SESSION_COOKIE_NAME = "gym_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

function base64Url(buf) {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function createSessionToken() {
  return base64Url(randomBytes(32));
}
async function createSession(userId) {
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1e3);
  await prisma.session.create({
    data: { userId, token, expiresAt }
  });
  return { token, expiresAt };
}
async function invalidateSession(token) {
  await prisma.session.delete({ where: { token } }).catch(() => {
  });
}
async function getSessionFromRequest(token) {
  const now = /* @__PURE__ */ new Date();
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: { include: { profile: true } } }
  });
  if (!session) return null;
  if (session.expiresAt <= now) {
    await prisma.session.delete({ where: { token } }).catch(() => {
    });
    return null;
  }
  return session;
}
function setSessionCookie(cookies, token, expiresAt) {
  cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    expires: expiresAt
  });
}
function clearSessionCookie(cookies) {
  cookies.delete(SESSION_COOKIE_NAME, { path: "/" });
}

export { SESSION_COOKIE_NAME as S, createSession as a, clearSessionCookie as c, getSessionFromRequest as g, invalidateSession as i, setSessionCookie as s };
