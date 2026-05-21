import { c as createComponent } from './astro-component_CT6Zo39r.mjs';
import 'piccolore';
import { bf as renderTemplate, b0 as maybeRenderHead, aa as addAttribute } from './params-and-props_CTFkmYcw.mjs';
import { r as renderComponent } from './entrypoint_DVi3_jVz.mjs';
import { $ as $$AppLayout } from './AppLayout_BhjjWg0B.mjs';
import { $ as $$Shell } from './Shell_CQkzdiWj.mjs';
import { e as cn, C as Card, c as CardHeader, d as CardTitle, b as CardDescription, a as CardContent, B as Button } from './card_C1ViycoZ.mjs';
import { L as Label, I as Input } from './label_BguONccA.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Line } from 'recharts';
import { p as prisma } from './db_xR3SC8vL.mjs';
import { s as startOfDay, t as toISODate } from './date_BoxigCIO.mjs';
import { d as decimalToNumber, f as formatNumber } from './number_Dl1bppWz.mjs';

const Separator = React.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsx(
  SeparatorPrimitive.Root,
  {
    ref,
    decorative,
    orientation,
    "data-slot": "separator",
    className: cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
      className
    ),
    ...props
  }
));
Separator.displayName = SeparatorPrimitive.Root.displayName;

function BodyChart({ points }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) {
    return /* @__PURE__ */ jsx("div", { className: "flex h-full items-center justify-center text-sm text-muted-foreground", children: "Loading chart..." });
  }
  if (!points.length) {
    return /* @__PURE__ */ jsx("div", { className: "flex h-full items-center justify-center text-sm text-muted-foreground", children: "No weight data yet." });
  }
  return /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(LineChart, { data: points, margin: { top: 10, right: 10, left: 0, bottom: 0 }, children: [
    /* @__PURE__ */ jsx(XAxis, { dataKey: "label", stroke: "hsl(var(--muted-foreground))", fontSize: 12 }),
    /* @__PURE__ */ jsx(
      YAxis,
      {
        domain: ["dataMin - 0.5", "dataMax + 0.5"],
        stroke: "hsl(var(--muted-foreground))",
        fontSize: 12,
        width: 36
      }
    ),
    /* @__PURE__ */ jsx(
      Tooltip,
      {
        contentStyle: {
          background: "hsl(var(--popover))",
          border: "1px solid hsl(var(--border))",
          borderRadius: 12
        },
        labelStyle: { color: "hsl(var(--muted-foreground))" }
      }
    ),
    /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "kg", stroke: "hsl(var(--ring))", strokeWidth: 2, dot: false, activeDot: { r: 4 } })
  ] }) });
}

function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm) return null;
  const m = heightCm / 100;
  if (m <= 0) return null;
  const bmi = weightKg / (m * m);
  return Number.isFinite(bmi) ? bmi : null;
}

async function listBodyMetrics(userId, limit) {
  const rows = await prisma.bodyMetric.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: limit,
    select: {
      date: true,
      weightKg: true,
      bodyFatPct: true,
      armsCm: true,
      chestCm: true,
      waistCm: true,
      legsCm: true,
      notes: true
    }
  });
  return rows.map((r) => ({
    date: r.date,
    weightKg: decimalToNumber(r.weightKg),
    bodyFatPct: decimalToNumber(r.bodyFatPct),
    armsCm: decimalToNumber(r.armsCm),
    chestCm: decimalToNumber(r.chestCm),
    waistCm: decimalToNumber(r.waistCm),
    legsCm: decimalToNumber(r.legsCm),
    notes: r.notes ?? null
  }));
}
async function getBodyWeightSeries(userId, days) {
  const today = startOfDay(/* @__PURE__ */ new Date());
  const from = new Date(today);
  from.setUTCDate(from.getUTCDate() - (days - 1));
  const rows = await prisma.bodyMetric.findMany({
    where: {
      userId,
      date: { gte: from, lte: today },
      weightKg: { not: null }
    },
    orderBy: { date: "asc" },
    select: { date: true, weightKg: true }
  });
  return rows.map((r) => ({ date: r.date, weightKg: decimalToNumber(r.weightKg) }));
}

const $$Body = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Body;
  if (!Astro2.locals.user) {
    return Astro2.redirect("/login");
  }
  const user = Astro2.locals.user;
  const error = Astro2.url.searchParams.get("error");
  const profile = await prisma.userProfile.findUnique({
    where: { userId: user.id },
    select: { heightCm: true }
  }).catch(() => null);
  let metrics = [];
  let series = [];
  try {
    [metrics, series] = await Promise.all([listBodyMetrics(user.id, 30), getBodyWeightSeries(user.id, 30)]);
  } catch {
    metrics = [];
    series = [];
  }
  const today = startOfDay(/* @__PURE__ */ new Date());
  const latest = metrics[0] ?? null;
  const bmi = calculateBMI(latest?.weightKg ?? null, profile?.heightCm ?? null);
  const points = series.filter((p) => typeof p.weightKg === "number").map((p) => ({ label: toISODate(p.date).slice(5), kg: p.weightKg }));
  return renderTemplate`${renderComponent($$result, "AppLayout", $$AppLayout, { "title": "Gym | Body" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Shell", $$Shell, { "title": "Body", "subtitle": "Weight, measurements, and trends" }, { "default": async ($$result3) => renderTemplate` ${maybeRenderHead()}<div class="grid gap-4 lg:grid-cols-12"> ${renderComponent($$result3, "Card", Card, { "className": "glass lg:col-span-5" }, { "default": async ($$result4) => renderTemplate` ${renderComponent($$result4, "CardHeader", CardHeader, {}, { "default": async ($$result5) => renderTemplate` ${renderComponent($$result5, "CardTitle", CardTitle, {}, { "default": async ($$result6) => renderTemplate`Log metrics` })} ${renderComponent($$result5, "CardDescription", CardDescription, {}, { "default": async ($$result6) => renderTemplate`One entry per day (updates if it already exists).` })} ` })} ${renderComponent($$result4, "CardContent", CardContent, {}, { "default": async ($$result5) => renderTemplate`${error ? renderTemplate`<p class="mb-3 text-sm text-destructive">${error}</p>` : null}<form method="post" action="/api/body/upsert" class="grid gap-4"> <div class="grid gap-2"> ${renderComponent($$result5, "Label", Label, { "htmlFor": "date" }, { "default": async ($$result6) => renderTemplate`Date` })} ${renderComponent($$result5, "Input", Input, { "id": "date", "name": "date", "type": "date", "required": true, "defaultValue": toISODate(today) })} </div> <div class="grid grid-cols-2 gap-3"> <div class="grid gap-2"> ${renderComponent($$result5, "Label", Label, { "htmlFor": "weightKg" }, { "default": async ($$result6) => renderTemplate`Weight (kg)` })} ${renderComponent($$result5, "Input", Input, { "id": "weightKg", "name": "weightKg", "inputMode": "decimal", "placeholder": "81.2" })} </div> <div class="grid gap-2"> ${renderComponent($$result5, "Label", Label, { "htmlFor": "bodyFatPct" }, { "default": async ($$result6) => renderTemplate`Body fat (%)` })} ${renderComponent($$result5, "Input", Input, { "id": "bodyFatPct", "name": "bodyFatPct", "inputMode": "decimal", "placeholder": "18.5" })} </div> </div> ${renderComponent($$result5, "Separator", Separator, {})} <div class="grid grid-cols-2 gap-3"> <div class="grid gap-2"> ${renderComponent($$result5, "Label", Label, { "htmlFor": "armsCm" }, { "default": async ($$result6) => renderTemplate`Arms (cm)` })} ${renderComponent($$result5, "Input", Input, { "id": "armsCm", "name": "armsCm", "inputMode": "decimal" })} </div> <div class="grid gap-2"> ${renderComponent($$result5, "Label", Label, { "htmlFor": "chestCm" }, { "default": async ($$result6) => renderTemplate`Chest (cm)` })} ${renderComponent($$result5, "Input", Input, { "id": "chestCm", "name": "chestCm", "inputMode": "decimal" })} </div> <div class="grid gap-2"> ${renderComponent($$result5, "Label", Label, { "htmlFor": "waistCm" }, { "default": async ($$result6) => renderTemplate`Waist (cm)` })} ${renderComponent($$result5, "Input", Input, { "id": "waistCm", "name": "waistCm", "inputMode": "decimal" })} </div> <div class="grid gap-2"> ${renderComponent($$result5, "Label", Label, { "htmlFor": "legsCm" }, { "default": async ($$result6) => renderTemplate`Legs (cm)` })} ${renderComponent($$result5, "Input", Input, { "id": "legsCm", "name": "legsCm", "inputMode": "decimal" })} </div> </div> <div class="grid gap-2"> ${renderComponent($$result5, "Label", Label, { "htmlFor": "notes" }, { "default": async ($$result6) => renderTemplate`Notes` })} ${renderComponent($$result5, "Input", Input, { "id": "notes", "name": "notes", "type": "text", "placeholder": "Optional" })} </div> ${renderComponent($$result5, "Button", Button, { "type": "submit" }, { "default": async ($$result6) => renderTemplate`Save` })} </form> ` })} ` })} ${renderComponent($$result3, "Card", Card, { "className": "glass lg:col-span-7" }, { "default": async ($$result4) => renderTemplate` ${renderComponent($$result4, "CardHeader", CardHeader, {}, { "default": async ($$result5) => renderTemplate` ${renderComponent($$result5, "CardTitle", CardTitle, {}, { "default": async ($$result6) => renderTemplate`Trends` })} ${renderComponent($$result5, "CardDescription", CardDescription, {}, { "default": async ($$result6) => renderTemplate`Last 30 days` })} ` })} ${renderComponent($$result4, "CardContent", CardContent, { "className": "h-[280px]" }, { "default": async ($$result5) => renderTemplate` ${renderComponent($$result5, "BodyChart", BodyChart, { "client:load": true, "points": points, "client:component-hydration": "load", "client:component-path": "@/components/body/BodyChart", "client:component-export": "BodyChart" })} ` })} ` })} </div> <div class="mt-4 grid gap-4 lg:grid-cols-12"> ${renderComponent($$result3, "Card", Card, { "className": "glass lg:col-span-4" }, { "default": async ($$result4) => renderTemplate` ${renderComponent($$result4, "CardHeader", CardHeader, {}, { "default": async ($$result5) => renderTemplate` ${renderComponent($$result5, "CardTitle", CardTitle, {}, { "default": async ($$result6) => renderTemplate`Latest` })} ${renderComponent($$result5, "CardDescription", CardDescription, {}, { "default": async ($$result6) => renderTemplate`Your most recent entry` })} ` })} ${renderComponent($$result4, "CardContent", CardContent, {}, { "default": async ($$result5) => renderTemplate`${latest ? renderTemplate`<div class="grid gap-2 text-sm"> <p class="text-muted-foreground">${toISODate(latest.date)}</p> <p> <span class="text-muted-foreground">Weight:</span> ${latest.weightKg != null ? `${formatNumber(latest.weightKg, { maximumFractionDigits: 1 })} kg` : "—"} </p> <p> <span class="text-muted-foreground">Body fat:</span> ${latest.bodyFatPct != null ? `${formatNumber(latest.bodyFatPct, { maximumFractionDigits: 1 })}%` : "—"} </p> <p> <span class="text-muted-foreground">BMI:</span> ${bmi != null ? formatNumber(bmi, { maximumFractionDigits: 1 }) : "—"} <span class="text-xs text-muted-foreground"> (height will be added in Settings)</span> </p> </div>` : renderTemplate`<p class="text-sm text-muted-foreground">No metrics yet.</p>`}` })} ` })} ${renderComponent($$result3, "Card", Card, { "className": "glass lg:col-span-8" }, { "default": async ($$result4) => renderTemplate` ${renderComponent($$result4, "CardHeader", CardHeader, {}, { "default": async ($$result5) => renderTemplate` ${renderComponent($$result5, "CardTitle", CardTitle, {}, { "default": async ($$result6) => renderTemplate`History` })} ${renderComponent($$result5, "CardDescription", CardDescription, {}, { "default": async ($$result6) => renderTemplate`Most recent 30 entries` })} ` })} ${renderComponent($$result4, "CardContent", CardContent, {}, { "default": async ($$result5) => renderTemplate`${metrics.length ? renderTemplate`<div class="grid gap-2"> ${metrics.map((m) => renderTemplate`<div class="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/30 px-3 py-2"> <div class="min-w-0"> <p class="text-sm font-medium">${toISODate(m.date)}</p> <p class="text-xs text-muted-foreground"> ${m.weightKg != null ? `${formatNumber(m.weightKg, { maximumFractionDigits: 1 })} kg` : "—"} ${m.bodyFatPct != null ? ` • ${formatNumber(m.bodyFatPct, { maximumFractionDigits: 1 })}%` : ""} </p> </div> <form method="post" action="/api/body/delete"> <input type="hidden" name="date"${addAttribute(toISODate(m.date), "value")}> ${renderComponent($$result5, "Button", Button, { "type": "submit", "variant": "ghost" }, { "default": async ($$result6) => renderTemplate`Delete` })} </form> </div>`)} </div>` : renderTemplate`<p class="text-sm text-muted-foreground">No history yet.</p>`}` })} ` })} </div> ` })} ` })}`;
}, "D:/Proyectos/gym/src/pages/body.astro", void 0);

const $$file = "D:/Proyectos/gym/src/pages/body.astro";
const $$url = "/body";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Body,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
