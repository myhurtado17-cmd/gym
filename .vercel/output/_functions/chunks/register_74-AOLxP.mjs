import { z } from 'zod';
import { p as prisma } from './db_xR3SC8vL.mjs';
import { h as hashPassword } from './password_CcmIrYPP.mjs';
import { a as createSession, s as setSessionCookie } from './session_D98IRpda.mjs';

const RegisterSchema = z.object({
  name: z.string().trim().min(1).max(80).optional().or(z.literal("")),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(200)
});
const POST = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const parsed = RegisterSchema.safeParse({
    name: formData.get("name")?.toString(),
    email: formData.get("email")?.toString(),
    password: formData.get("password")?.toString()
  });
  if (!parsed.success) return redirect(`/register?error=${encodeURIComponent("Invalid input")}`);
  const email = parsed.data.email.toLowerCase();
  const name = parsed.data.name?.trim() ? parsed.data.name.trim() : null;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return redirect(`/register?error=${encodeURIComponent("Email already in use")}`);
  const passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      profile: { create: {} }
    }
  });
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
