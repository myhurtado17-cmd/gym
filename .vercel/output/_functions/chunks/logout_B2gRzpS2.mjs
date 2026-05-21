import { S as SESSION_COOKIE_NAME, i as invalidateSession, c as clearSessionCookie } from './session_D98IRpda.mjs';

const POST = async ({ cookies, redirect }) => {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (token) await invalidateSession(token);
  clearSessionCookie(cookies);
  return redirect("/login");
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
