import 'es-module-lexer';
import { at as defineMiddleware, bk as sequence } from './chunks/params-and-props_CTFkmYcw.mjs';
import 'piccolore';
import 'clsx';
import { S as SESSION_COOKIE_NAME, g as getSessionFromRequest } from './chunks/session_D98IRpda.mjs';

const PROTECTED_PREFIXES = ["/dashboard", "/workouts", "/nutrition", "/body", "/goals", "/settings"];
const onRequest$1 = defineMiddleware(async (context, next) => {
  const { url, cookies, locals, redirect } = context;
  const isProtected = PROTECTED_PREFIXES.some((p) => url.pathname === p || url.pathname.startsWith(p + "/"));
  if (!isProtected) return next();
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return redirect("/login");
  const session = await getSessionFromRequest(token);
  if (!session) return redirect("/login");
  locals.user = {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    imageUrl: session.user.imageUrl
  };
  return next();
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
