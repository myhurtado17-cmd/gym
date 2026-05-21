import { c as createComponent } from './astro-component_CT6Zo39r.mjs';
import 'piccolore';
import { bf as renderTemplate, bc as renderSlot, bb as renderHead, bp as unescapeHTML, aa as addAttribute } from './params-and-props_CTFkmYcw.mjs';
import 'clsx';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$AppLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$AppLayout;
  const { title = "Gym", description = "Track workouts, nutrition, and body metrics." } = Astro2.props;
  const themeInit = `(() => {
  try {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored === 'light' || stored === 'dark' ? stored : (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  } catch {
    // ignore
  }
})();`;
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="generator"', "><title>", '</title><meta name="description"', "><script>", "<\/script>", '</head> <body class="min-h-dvh bg-background text-foreground antialiased"> ', " </body></html>"])), addAttribute(Astro2.generator, "content"), title, addAttribute(description, "content"), unescapeHTML(themeInit), renderHead(), renderSlot($$result, $$slots["default"]));
}, "D:/Proyectos/gym/src/layouts/AppLayout.astro", void 0);

export { $$AppLayout as $ };
