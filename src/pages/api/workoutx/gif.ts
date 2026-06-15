import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url, cookies }) => {
  const id = url.searchParams.get('id')?.trim();
  if (!id) {
    return new Response('Missing id', { status: 400 });
  }

  const embed = url.searchParams.get('embed') === '1';

  const key = process.env.WORKOUTX_API_KEY;
  if (!key) {
    return new Response('WORKOUTX_API_KEY not set', { status: 500 });
  }

  const gifUrl = `https://api.workoutxapp.com/v1/gifs/${id}.gif`;

  if (embed) {
    const html = `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;display:flex;align-items:center;justify-content:center;height:100vh;background:#000}img{max-width:100%;max-height:100%;object-fit:contain}</style></head><body><img src="${gifUrl}" alt="${id}" /></body></html>`;
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=86400'
      }
    });
  }

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
