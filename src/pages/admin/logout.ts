export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  return new Response(null, {
    status: 302,
    headers: {
      'Location': '/admin',
      'Set-Cookie': 'admin_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0',
    },
  });
};
