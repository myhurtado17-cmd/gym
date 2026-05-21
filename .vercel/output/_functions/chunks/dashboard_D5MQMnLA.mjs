import { c as createComponent } from './astro-component_CT6Zo39r.mjs';
import 'piccolore';
import { bf as renderTemplate, b0 as maybeRenderHead } from './params-and-props_CTFkmYcw.mjs';
import { r as renderComponent } from './entrypoint_DVi3_jVz.mjs';
import { $ as $$AppLayout } from './AppLayout_BhjjWg0B.mjs';
import { $ as $$Shell } from './Shell_CQkzdiWj.mjs';
import { C as Card, c as CardHeader, b as CardDescription, d as CardTitle, a as CardContent, B as Button } from './card_C1ViycoZ.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import * as React from 'react';
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Line } from 'recharts';
import { d as decimalToNumber, f as formatNumber } from './number_Dl1bppWz.mjs';
import { p as prisma } from './db_xR3SC8vL.mjs';
import { s as startOfDay, t as toISODate } from './date_BoxigCIO.mjs';

const $$StatCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$StatCard;
  const { title, value, hint } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Card", Card, { "className": "glass" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CardHeader", CardHeader, { "className": "pb-3" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "CardDescription", CardDescription, {}, { "default": ($$result4) => renderTemplate`${title}` })} ${renderComponent($$result3, "CardTitle", CardTitle, { "className": "text-2xl" }, { "default": ($$result4) => renderTemplate`${value}` })} ` })} ${hint ? renderTemplate`${renderComponent($$result2, "CardContent", CardContent, {}, { "default": ($$result3) => renderTemplate` ${maybeRenderHead()}<p class="text-xs text-muted-foreground">${hint}</p> ` })}` : null}` })}`;
}, "D:/Proyectos/gym/src/components/dashboard/StatCard.astro", void 0);

function WeightChart({ points }) {
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

async function getLatestWeight(userId) {
  const latest = await prisma.bodyMetric.findFirst({
    where: { userId, weightKg: { not: null } },
    orderBy: { date: "desc" },
    select: { date: true, weightKg: true }
  });
  return latest ? {
    date: latest.date,
    weightKg: decimalToNumber(latest.weightKg)
  } : null;
}
async function getWeightSeries(userId, days) {
  const today = startOfDay(/* @__PURE__ */ new Date());
  const from = new Date(today);
  from.setDate(from.getDate() - (days - 1));
  const rows = await prisma.bodyMetric.findMany({
    where: {
      userId,
      date: { gte: from, lte: today },
      weightKg: { not: null }
    },
    orderBy: { date: "asc" },
    select: { date: true, weightKg: true }
  });
  return rows.map((r) => ({
    date: r.date,
    weightKg: decimalToNumber(r.weightKg)
  }));
}
async function getTodayNutrition(userId) {
  const today = startOfDay(/* @__PURE__ */ new Date());
  const day = await prisma.nutritionDay.findUnique({
    where: { userId_date: { userId, date: today } },
    select: { calories: true, proteinG: true, carbsG: true, fatG: true }
  });
  return day ?? {
    calories: 0,
    proteinG: 0,
    carbsG: 0,
    fatG: 0
  };
}
async function getRecentWorkouts(userId, limit) {
  const sessions = await prisma.workoutSession.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: limit,
    select: {
      id: true,
      date: true,
      notes: true,
      routine: { select: { name: true } },
      day: { select: { name: true } },
      _count: { select: { setLogs: true } }
    }
  });
  return sessions.map((s) => ({
    id: s.id,
    date: s.date,
    routineName: s.routine?.name ?? null,
    dayName: s.day?.name ?? null,
    setCount: s._count.setLogs,
    notes: s.notes ?? null
  }));
}
async function getActiveGoals(userId, limit) {
  const today = startOfDay(/* @__PURE__ */ new Date());
  const goals = await prisma.goal.findMany({
    where: {
      userId,
      startsAt: { lte: today },
      OR: [{ endsAt: null }, { endsAt: { gte: today } }]
    },
    orderBy: { startsAt: "desc" },
    take: limit,
    select: { id: true, type: true, title: true, targetValue: true, unit: true, endsAt: true }
  });
  return goals.map((g) => ({
    id: g.id,
    type: g.type,
    title: g.title,
    targetValue: decimalToNumber(g.targetValue),
    unit: g.unit ?? null,
    endsAt: g.endsAt
  }));
}

const $$Dashboard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Dashboard;
  if (!Astro2.locals.user) {
    return Astro2.redirect("/login");
  }
  const user = Astro2.locals.user;
  const [latestWeight, weightSeries, todayNutrition, recentWorkouts, activeGoals] = await Promise.all([
    getLatestWeight(user.id),
    getWeightSeries(user.id, 14),
    getTodayNutrition(user.id),
    getRecentWorkouts(user.id, 5),
    getActiveGoals(user.id, 3)
  ]);
  const weightPoints = weightSeries.filter((p) => typeof p.weightKg === "number").map((p) => ({
    label: toISODate(p.date).slice(5),
    kg: p.weightKg
  }));
  const weightDelta = weightPoints.length >= 2 ? weightPoints[weightPoints.length - 1].kg - weightPoints[0].kg : null;
  return renderTemplate`${renderComponent($$result, "AppLayout", $$AppLayout, { "title": "Gym | Dashboard" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Shell", $$Shell, { "title": "Dashboard", "subtitle": "Your week at a glance" }, { "default": async ($$result3) => renderTemplate` ${maybeRenderHead()}<div class="grid gap-4"> <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"> ${renderComponent($$result3, "StatCard", $$StatCard, { "title": "Current weight", "value": latestWeight?.weightKg != null ? `${formatNumber(latestWeight.weightKg, { maximumFractionDigits: 1 })} kg` : "—", "hint": latestWeight ? `Last updated ${toISODate(latestWeight.date)}` : "Add your first weigh-in" })} ${renderComponent($$result3, "StatCard", $$StatCard, { "title": "14-day change", "value": weightDelta != null ? `${weightDelta > 0 ? "+" : ""}${formatNumber(weightDelta, { maximumFractionDigits: 1 })} kg` : "—", "hint": "Based on logged weigh-ins" })} ${renderComponent($$result3, "StatCard", $$StatCard, { "title": "Calories today", "value": formatNumber(todayNutrition.calories), "hint": "Auto-updates from meal logs" })} ${renderComponent($$result3, "StatCard", $$StatCard, { "title": "Macros today", "value": `${todayNutrition.proteinG}P ${todayNutrition.carbsG}C ${todayNutrition.fatG}F`, "hint": "grams" })} </div> <div class="grid gap-4 lg:grid-cols-12"> ${renderComponent($$result3, "Card", Card, { "className": "glass lg:col-span-7" }, { "default": async ($$result4) => renderTemplate` ${renderComponent($$result4, "CardHeader", CardHeader, {}, { "default": async ($$result5) => renderTemplate` ${renderComponent($$result5, "CardTitle", CardTitle, {}, { "default": async ($$result6) => renderTemplate`Weight trend` })} ${renderComponent($$result5, "CardDescription", CardDescription, {}, { "default": async ($$result6) => renderTemplate`Last 14 days` })} ` })} ${renderComponent($$result4, "CardContent", CardContent, { "className": "h-[280px]" }, { "default": async ($$result5) => renderTemplate` ${renderComponent($$result5, "WeightChart", WeightChart, { "client:load": true, "points": weightPoints, "client:component-hydration": "load", "client:component-path": "@/components/dashboard/WeightChart", "client:component-export": "WeightChart" })} ` })} ` })} ${renderComponent($$result3, "Card", Card, { "className": "glass lg:col-span-5" }, { "default": async ($$result4) => renderTemplate` ${renderComponent($$result4, "CardHeader", CardHeader, {}, { "default": async ($$result5) => renderTemplate` ${renderComponent($$result5, "CardTitle", CardTitle, {}, { "default": async ($$result6) => renderTemplate`Recent workouts` })} ${renderComponent($$result5, "CardDescription", CardDescription, {}, { "default": async ($$result6) => renderTemplate`Your last sessions` })} ` })} ${renderComponent($$result4, "CardContent", CardContent, {}, { "default": async ($$result5) => renderTemplate`${recentWorkouts.length ? renderTemplate`<div class="grid gap-3"> ${recentWorkouts.map((w) => renderTemplate`<div class="flex items-start justify-between gap-3"> <div class="min-w-0"> <p class="truncate text-sm font-medium"> ${w.routineName ?? "Workout"} ${w.dayName ? ` • ${w.dayName}` : ""} </p> <p class="text-xs text-muted-foreground">${toISODate(w.date)} • ${w.setCount} sets</p> </div> </div>`)} </div>` : renderTemplate`<p class="text-sm text-muted-foreground">No workouts logged yet.</p>`}<div class="mt-4"> <a href="/workouts"> ${renderComponent($$result5, "Button", Button, { "variant": "outline" }, { "default": async ($$result6) => renderTemplate`Go to Workouts` })} </a> </div> ` })} ` })} </div> ${renderComponent($$result3, "Card", Card, { "className": "glass" }, { "default": async ($$result4) => renderTemplate` ${renderComponent($$result4, "CardHeader", CardHeader, {}, { "default": async ($$result5) => renderTemplate` ${renderComponent($$result5, "CardTitle", CardTitle, {}, { "default": async ($$result6) => renderTemplate`Active goals` })} ${renderComponent($$result5, "CardDescription", CardDescription, {}, { "default": async ($$result6) => renderTemplate`What you’re working toward right now` })} ` })} ${renderComponent($$result4, "CardContent", CardContent, {}, { "default": async ($$result5) => renderTemplate`${activeGoals.length ? renderTemplate`<div class="grid gap-3 md:grid-cols-3"> ${activeGoals.map((g) => renderTemplate`<div class="rounded-lg border border-border/60 bg-background/30 p-4"> <p class="text-sm font-medium">${g.title}</p> <p class="mt-1 text-xs text-muted-foreground">
Target: ${g.targetValue != null ? formatNumber(g.targetValue, { maximumFractionDigits: 1 }) : "—"} ${g.unit ?? ""} ${g.endsAt ? ` • until ${toISODate(g.endsAt)}` : ""} </p> </div>`)} </div>` : renderTemplate`<p class="text-sm text-muted-foreground">No active goals yet.</p>`}<div class="mt-4"> <a href="/goals"> ${renderComponent($$result5, "Button", Button, { "variant": "outline" }, { "default": async ($$result6) => renderTemplate`Manage goals` })} </a> </div> ` })} ` })} </div> ` })} ` })}`;
}, "D:/Proyectos/gym/src/pages/dashboard.astro", void 0);

const $$file = "D:/Proyectos/gym/src/pages/dashboard.astro";
const $$url = "/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Dashboard,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
