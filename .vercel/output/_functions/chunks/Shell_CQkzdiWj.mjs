import { c as createComponent } from './astro-component_CT6Zo39r.mjs';
import 'piccolore';
import { b0 as maybeRenderHead, aa as addAttribute, bf as renderTemplate, bc as renderSlot } from './params-and-props_CTFkmYcw.mjs';
import { r as renderComponent } from './entrypoint_DVi3_jVz.mjs';
import { LayoutDashboard, Dumbbell, Apple, Activity, ClipboardList, Settings, Sun, Moon, Menu } from 'lucide-react';
import { jsxs, jsx } from 'react/jsx-runtime';
import * as React from 'react';
import { B as Button } from './card_C1ViycoZ.mjs';

function LogoMark(props) {
  return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", ...props, children: [
    /* @__PURE__ */ jsx(
      "path",
      {
        d: "M7.2 7.3c.9-1.2 2.3-2 3.9-2 2.6 0 4.7 2.1 4.7 4.7v.5c0 2.6-2.1 4.7-4.7 4.7-1.6 0-3-.8-3.9-2",
        stroke: "currentColor",
        strokeWidth: "1.8",
        strokeLinecap: "round"
      }
    ),
    /* @__PURE__ */ jsx(
      "path",
      {
        d: "M6.2 12h3.1m5.4 0h3.1",
        stroke: "currentColor",
        strokeWidth: "1.8",
        strokeLinecap: "round"
      }
    ),
    /* @__PURE__ */ jsx(
      "path",
      {
        d: "M3.5 10.3V13.7M20.5 10.3V13.7",
        stroke: "currentColor",
        strokeWidth: "1.8",
        strokeLinecap: "round"
      }
    )
  ] });
}

const $$NavLink = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$NavLink;
  const { item } = Astro2.props;
  const pathname = Astro2.url.pathname;
  const active = pathname === item.href || item.href !== "/dashboard" && pathname.startsWith(item.href + "/");
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(item.href, "href")}${addAttribute([
    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
    active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
  ], "class:list")}> <span${addAttribute(["grid h-8 w-8 place-items-center rounded-md border", active ? "border-border bg-background/40" : "border-border/60 bg-background/20"], "class:list")}> ${renderComponent($$result, "item.icon", item.icon, { "className": "h-4 w-4" })} </span> <span class="font-medium">${item.label}</span> </a>`;
}, "D:/Proyectos/gym/src/components/nav/NavLink.astro", void 0);

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Workouts", href: "/workouts", icon: Dumbbell },
  { label: "Nutrition", href: "/nutrition", icon: Apple },
  { label: "Body", href: "/body", icon: Activity },
  { label: "Goals", href: "/goals", icon: ClipboardList },
  { label: "Settings", href: "/settings", icon: Settings }
];

function getInitialTheme() {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}
function ThemeToggle() {
  const [theme, setTheme] = React.useState(() => getInitialTheme());
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, [theme]);
  return /* @__PURE__ */ jsx(
    Button,
    {
      variant: "ghost",
      size: "icon",
      "aria-label": "Toggle theme",
      onClick: () => setTheme((t) => t === "dark" ? "light" : "dark"),
      children: theme === "dark" ? /* @__PURE__ */ jsx(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Moon, { className: "h-4 w-4" })
    }
  );
}

const $$Shell = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Shell;
  const { title, subtitle } = Astro2.props;
  const user = Astro2.locals.user;
  return renderTemplate`${maybeRenderHead()}<div class="min-h-dvh" data-astro-cid-xt7cr5id> <div class="mx-auto grid max-w-7xl grid-cols-1 gap-0 md:grid-cols-[260px_1fr]" data-astro-cid-xt7cr5id> <aside class="hidden md:sticky md:top-0 md:block md:h-dvh md:border-r md:border-border/60 md:bg-background/70 md:backdrop-blur" data-astro-cid-xt7cr5id> <div class="flex h-16 items-center gap-3 px-4" data-astro-cid-xt7cr5id> <div class="grid h-10 w-10 place-items-center rounded-xl border border-border/60 bg-card" data-astro-cid-xt7cr5id> ${renderComponent($$result, "LogoMark", LogoMark, { "className": "h-6 w-6", "data-astro-cid-xt7cr5id": true })} </div> <div class="leading-tight" data-astro-cid-xt7cr5id> <p class="text-sm font-semibold" data-astro-cid-xt7cr5id>Gym</p> <p class="text-xs text-muted-foreground" data-astro-cid-xt7cr5id>Progress OS</p> </div> </div> <nav class="grid gap-1 px-3" data-astro-cid-xt7cr5id> ${navItems.map((item) => renderTemplate`${renderComponent($$result, "NavLink", $$NavLink, { "item": item, "data-astro-cid-xt7cr5id": true })}`)} </nav> <div class="mt-auto p-4 text-xs text-muted-foreground" data-astro-cid-xt7cr5id> <p class="opacity-80" data-astro-cid-xt7cr5id>Built for speed, charts, and logs.</p> </div> </aside> <div class="min-w-0" data-astro-cid-xt7cr5id> <header class="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur" data-astro-cid-xt7cr5id> <div class="flex h-16 items-center gap-3 px-4 sm:px-6" data-astro-cid-xt7cr5id> <a href="#nav" class="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border/60 bg-background/40 text-foreground/90 md:hidden" aria-label="Open navigation" data-astro-cid-xt7cr5id> ${renderComponent($$result, "Menu", Menu, { "className": "h-5 w-5", "data-astro-cid-xt7cr5id": true })} </a> <div class="min-w-0 flex-1" data-astro-cid-xt7cr5id> ${title ? renderTemplate`<p class="truncate text-sm font-semibold" data-astro-cid-xt7cr5id>${title}</p>` : null} ${subtitle ? renderTemplate`<p class="truncate text-xs text-muted-foreground" data-astro-cid-xt7cr5id>${subtitle}</p>` : null} </div> ${user ? renderTemplate`<p class="hidden text-xs text-muted-foreground sm:block" data-astro-cid-xt7cr5id>${user.email}</p>` : null} ${renderComponent($$result, "ThemeToggle", ThemeToggle, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/theme/ThemeToggle", "client:component-export": "ThemeToggle", "data-astro-cid-xt7cr5id": true })} <form method="post" action="/api/auth/logout" data-astro-cid-xt7cr5id> ${renderComponent($$result, "Button", Button, { "type": "submit", "variant": "outline", "className": "hidden sm:inline-flex", "data-astro-cid-xt7cr5id": true }, { "default": ($$result2) => renderTemplate`
Logout
` })} </form> </div> </header> <div class="px-4 py-6 sm:px-6" data-astro-cid-xt7cr5id> ${renderSlot($$result, $$slots["default"])} </div> </div> </div> <!-- Mobile nav: simple anchor-target drawer --> <div id="nav" class="fixed inset-0 z-40 hidden" data-astro-cid-xt7cr5id> <a href="#" class="absolute inset-0 bg-black/50" aria-label="Close navigation" data-astro-cid-xt7cr5id></a> <div class="absolute left-0 top-0 h-full w-[78%] max-w-sm border-r border-border/60 bg-background/90 backdrop-blur" data-astro-cid-xt7cr5id> <div class="flex h-16 items-center gap-3 px-4" data-astro-cid-xt7cr5id> <div class="grid h-10 w-10 place-items-center rounded-xl border border-border/60 bg-card" data-astro-cid-xt7cr5id> ${renderComponent($$result, "LogoMark", LogoMark, { "className": "h-6 w-6", "data-astro-cid-xt7cr5id": true })} </div> <div class="leading-tight" data-astro-cid-xt7cr5id> <p class="text-sm font-semibold" data-astro-cid-xt7cr5id>Gym</p> <p class="text-xs text-muted-foreground" data-astro-cid-xt7cr5id>Progress OS</p> </div> </div> <nav class="grid gap-1 px-3" data-astro-cid-xt7cr5id> ${navItems.map((item) => renderTemplate`${renderComponent($$result, "NavLink", $$NavLink, { "item": item, "data-astro-cid-xt7cr5id": true })}`)} </nav> </div> </div> </div>`;
}, "D:/Proyectos/gym/src/components/shell/Shell.astro", void 0);

export { $$Shell as $ };
