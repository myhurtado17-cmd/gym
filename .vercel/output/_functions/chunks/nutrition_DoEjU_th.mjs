import { c as createComponent } from './astro-component_CT6Zo39r.mjs';
import 'piccolore';
import { bf as renderTemplate, b0 as maybeRenderHead } from './params-and-props_CTFkmYcw.mjs';
import { r as renderComponent } from './entrypoint_DVi3_jVz.mjs';
import { $ as $$AppLayout } from './AppLayout_BhjjWg0B.mjs';
import { $ as $$Shell } from './Shell_CQkzdiWj.mjs';
import { C as Card, c as CardHeader, d as CardTitle, b as CardDescription, a as CardContent } from './card_C1ViycoZ.mjs';

const $$Nutrition = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Nutrition;
  if (!Astro2.locals.user) {
    return Astro2.redirect("/login");
  }
  return renderTemplate`${renderComponent($$result, "AppLayout", $$AppLayout, { "title": "Gym | Nutrition" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Shell", $$Shell, { "title": "Nutrition", "subtitle": "Calories and macros" }, { "default": ($$result3) => renderTemplate` ${maybeRenderHead()}<div class="grid gap-4 md:grid-cols-2"> ${renderComponent($$result3, "Card", Card, {}, { "default": ($$result4) => renderTemplate` ${renderComponent($$result4, "CardHeader", CardHeader, {}, { "default": ($$result5) => renderTemplate` ${renderComponent($$result5, "CardTitle", CardTitle, {}, { "default": ($$result6) => renderTemplate`Today` })} ${renderComponent($$result5, "CardDescription", CardDescription, {}, { "default": ($$result6) => renderTemplate`Macro progress and meals.` })} ` })} ${renderComponent($$result4, "CardContent", CardContent, {}, { "default": ($$result5) => renderTemplate` <p class="text-sm text-muted-foreground">Scaffold page.</p> ` })} ` })} ${renderComponent($$result3, "Card", Card, {}, { "default": ($$result4) => renderTemplate` ${renderComponent($$result4, "CardHeader", CardHeader, {}, { "default": ($$result5) => renderTemplate` ${renderComponent($$result5, "CardTitle", CardTitle, {}, { "default": ($$result6) => renderTemplate`Import diet plan` })} ${renderComponent($$result5, "CardDescription", CardDescription, {}, { "default": ($$result6) => renderTemplate`Paste diet plans and auto-structure by meal.` })} ` })} ${renderComponent($$result4, "CardContent", CardContent, {}, { "default": ($$result5) => renderTemplate` <p class="text-sm text-muted-foreground">Scaffold page.</p> ` })} ` })} </div> ` })} ` })}`;
}, "D:/Proyectos/gym/src/pages/nutrition.astro", void 0);

const $$file = "D:/Proyectos/gym/src/pages/nutrition.astro";
const $$url = "/nutrition";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Nutrition,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
