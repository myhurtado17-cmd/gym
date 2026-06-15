import * as React from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type Point = { label: string; kg: number };

export function WeightChart({ points }: { points: Point[] }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Cargando gráfico...</div>;
  }

  if (!points.length) {
    return <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Sin datos aún.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={points} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} />
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
        <Line type="monotone" dataKey="kg" stroke="hsl(var(--ring))" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
