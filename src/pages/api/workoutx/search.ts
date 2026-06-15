import type { APIRoute } from 'astro';
import { searchByName } from '@/lib/workoutx/client';

export const GET: APIRoute = async ({ url, cookies }) => {
  const name = url.searchParams.get('name')?.trim();
  if (!name) {
    return new Response(JSON.stringify({ error: 'Se requiere el parámetro "name"' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const token = cookies.get('session')?.value;
  if (!token) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const results = await searchByName(name);
    return new Response(JSON.stringify(results), {
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
