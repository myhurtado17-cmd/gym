import { z } from 'zod';
import { p as prisma } from './db_xR3SC8vL.mjs';
import { v as verifyPassword } from './password_CcmIrYPP.mjs';
import { a as createSession, s as setSessionCookie } from './session_D98IRpda.mjs';

const LoginSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(200)
});
const POST = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const parsed = LoginSchema.safeParse({
    email: formData.get("email")?.toString(),
    password: formData.get("password")?.toString()
  });
  if (!parsed.success) return redirect(`/login?error=${encodeURIComponent("Invalid email or password")}`);
  const email = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return redirect(`/login?error=${encodeURIComponent("Invalid email or password")}`);
  const ok = await verifyPassword(user.passwordHash, parsed.data.password);
  if (!ok) return redirect(`/login?error=${encodeURIComponent("Invalid email or password")}`);
  const session = await createSession(user.id);
  setSessionCookie(cookies, session.token, session.expiresAt);
  return redirect("/dashboard");
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
