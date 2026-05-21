import { c as createComponent } from './astro-component_CT6Zo39r.mjs';
import 'piccolore';
import { bf as renderTemplate, b0 as maybeRenderHead } from './params-and-props_CTFkmYcw.mjs';
import { r as renderComponent } from './entrypoint_DVi3_jVz.mjs';
import { $ as $$AppLayout } from './AppLayout_BhjjWg0B.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AppLayout", $$AppLayout, { "title": "Gym" }, { "default": ($$result2) => renderTemplate` <meta http-equiv="refresh" content="0; url=/dashboard"> ${maybeRenderHead()}<main class="mx-auto max-w-xl px-6 py-16"> <h1 class="text-2xl font-semibold">Redirecting...</h1> <p class="mt-2 text-sm text-muted-foreground">
If you are not redirected, open <a class="underline" href="/dashboard">/dashboard</a>.
</p> </main> ` })}`;
}, "D:/Proyectos/gym/src/pages/index.astro", void 0);

const $$file = "D:/Proyectos/gym/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
