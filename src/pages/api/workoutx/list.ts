import type { APIRoute } from 'astro';
import { listExercises } from '@/lib/workoutx/client';
import { requireApiSession } from '@/lib/auth/api';

export const GET: APIRoute = async ({ url, cookies }) => {
  const session = await requireApiSession(cookies);
  if (!session) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const offset = Math.max(0, parseInt(url.searchParams.get('offset') || '0', 10) || 0);
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '10', 10) || 10));

  try {
    const result = await listExercises(offset, limit);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error desconocido';
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
