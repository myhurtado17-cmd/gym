import { c as createComponent } from './astro-component_CT6Zo39r.mjs';
import 'piccolore';
import { bf as renderTemplate, b0 as maybeRenderHead } from './params-and-props_CTFkmYcw.mjs';
import { r as renderComponent } from './entrypoint_DVi3_jVz.mjs';
import { $ as $$AppLayout } from './AppLayout_BhjjWg0B.mjs';
import { C as Card, c as CardHeader, d as CardTitle, b as CardDescription, a as CardContent, B as Button } from './card_C1ViycoZ.mjs';
import { L as Label, I as Input } from './label_BguONccA.mjs';

const $$Login = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Login;
  const error = Astro2.url.searchParams.get("error");
  return renderTemplate`${renderComponent($$result, "AppLayout", $$AppLayout, { "title": "Gym | Login" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="relative"> <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden"> <div class="absolute -top-48 left-1/2 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-fuchsia-500/20 via-sky-500/20 to-emerald-500/20 blur-3xl"></div> </div> <div class="mx-auto grid min-h-dvh max-w-md place-items-center px-4 py-10"> ${renderComponent($$result2, "Card", Card, { "className": "glass w-full" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, {}, { "default": ($$result4) => renderTemplate` ${renderComponent($$result4, "CardTitle", CardTitle, {}, { "default": ($$result5) => renderTemplate`Welcome back` })} ${renderComponent($$result4, "CardDescription", CardDescription, {}, { "default": ($$result5) => renderTemplate`Sign in to your dashboard.` })} ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": ($$result4) => renderTemplate`${error ? renderTemplate`<p class="mb-4 text-sm text-destructive">${error}</p>` : null}<form method="post" action="/api/auth/login" class="grid gap-4"> <div class="grid gap-2"> ${renderComponent($$result4, "Label", Label, { "htmlFor": "email" }, { "default": ($$result5) => renderTemplate`Email` })} ${renderComponent($$result4, "Input", Input, { "id": "email", "name": "email", "type": "email", "autoComplete": "email", "required": true })} </div> <div class="grid gap-2"> ${renderComponent($$result4, "Label", Label, { "htmlFor": "password" }, { "default": ($$result5) => renderTemplate`Password` })} ${renderComponent($$result4, "Input", Input, { "id": "password", "name": "password", "type": "password", "autoComplete": "current-password", "required": true })} </div> ${renderComponent($$result4, "Button", Button, { "type": "submit" }, { "default": ($$result5) => renderTemplate`Sign in` })} <p class="text-sm text-muted-foreground">
No account?${" "} <a class="underline underline-offset-4 hover:text-foreground" href="/register">Create one</a> </p> </form> ` })} ` })} </div> </main> ` })}`;
}, "D:/Proyectos/gym/src/pages/login.astro", void 0);

const $$file = "D:/Proyectos/gym/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
