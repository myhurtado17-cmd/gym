import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url, cookies }) => {
  const id = url.searchParams.get('id')?.trim();
  if (!id) {
    return new Response('Missing id', { status: 400 });
  }

  const key = process.env.WORKOUTX_API_KEY;
  if (!key) {
    return new Response('WORKOUTX_API_KEY not set', { status: 500 });
  }

  const gifUrl = `https://api.workoutxapp.com/v1/gifs/${id}.gif`;

  try {
    const res = await fetch(gifUrl, {
      headers: { 'X-WorkoutX-Key': key }
    });

    if (!res.ok) {
      return new Response('GIF not found', { status: 404 });
    }

    const buffer = await res.arrayBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'public, max-age=86400'
      }
    });
  } catch {
    return new Response('Error fetching GIF', { status: 502 });
  }
};
