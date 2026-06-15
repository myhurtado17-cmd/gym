import * as React from 'react';
import { motion } from 'framer-motion';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ToasterProvider, useToast } from '@/components/ui/toaster';

const demoWeight = [
  { day: 'Lun', kg: 82.3 },
  { day: 'Mar', kg: 82.1 },
  { day: 'Mié', kg: 81.9 },
  { day: 'Jue', kg: 81.7 },
  { day: 'Vie', kg: 81.8 },
  { day: 'Sáb', kg: 81.4 },
  { day: 'Dom', kg: 81.2 }
];

function DemoInner() {
  const { toast } = useToast();
  const [weight, setWeight] = React.useState('81.2');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-violet-500/20 via-sky-500/20 to-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-48 right-[-120px] h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-indigo-500/15 via-cyan-500/15 to-lime-500/15 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-2"
        >
          <div className="inline-flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px] shadow-emerald-500/20" />
            <p className="text-sm text-muted-foreground">GymTracker</p>
          </div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Panel de control premium
          </h1>
          <p className="max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base">
            Tailwind v4 + React islands + Radix primitives + Framer Motion + Recharts.
          </p>
        </motion.div>

        <div className="mt-8 grid gap-4 md:grid-cols-12">
          <Card className="md:col-span-5">
            <CardHeader>
              <CardTitle>Registro rápido</CardTitle>
              <CardDescription>Validar componentes y estado.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="weight">Peso corporal (kg)</Label>
                <Input
                  id="weight"
                  inputMode="decimal"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() =>
                    toast({
                      title: 'Guardado',
                      description: `Peso registrado: ${weight} kg`
                    })
                  }
                >
                  Guardar
                </Button>
                <Button variant="secondary" onClick={() => setWeight('')}>
                  Limpiar
                </Button>
              </div>
              <Separator />
              <p className="text-sm text-muted-foreground">
                Próximas fases conectarán con Prisma + auth.
              </p>
            </CardContent>
          </Card>

          <Card className="md:col-span-7">
            <CardHeader>
              <CardTitle>Peso semanal</CardTitle>
              <CardDescription>Gráfico responsive (Recharts).</CardDescription>
            </CardHeader>
            <CardContent className="h-[260px]">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={demoWeight} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis
                      domain={['dataMin - 0.5', 'dataMax + 0.5']}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      width={36}
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 12
                      }}
                      labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="kg"
                      stroke="hsl(var(--ring))"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  Cargando gráfico...
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function DemoDashboard() {
  return (
    <ToasterProvider>
      <DemoInner />
    </ToasterProvider>
  );
}
