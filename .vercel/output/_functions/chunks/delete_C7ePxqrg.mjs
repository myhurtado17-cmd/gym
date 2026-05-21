import { z } from 'zod';
import { p as prisma } from './db_xR3SC8vL.mjs';
import { S as SESSION_COOKIE_NAME, g as getSessionFromRequest } from './session_D98IRpda.mjs';
import { p as parseISODate } from './date_BoxigCIO.mjs';

const schema = z.object({
  date: z.string().min(10).max(10)
});
const POST = async ({ request, cookies, redirect }) => {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return redirect("/login");
  const session = await getSessionFromRequest(token);
  if (!session) return redirect("/login");
  const formData = await request.formData();
  const parsed = schema.safeParse({ date: formData.get("date")?.toString() });
  if (!parsed.success) return redirect("/body");
  const date = parseISODate(parsed.data.date);
  if (!date) return redirect("/body");
  await prisma.bodyMetric.delete({ where: { userId_date: { userId: session.userId, date } } }).catch(() => {
  });
  return redirect("/body");
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
