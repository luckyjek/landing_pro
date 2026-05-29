export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const { name, phone, source } = await request.json() as {
    name: string;
    phone: string;
    source?: string;
  };

  const notionToken = import.meta.env.NOTION_TOKEN         ?? process.env.NOTION_TOKEN         ?? '';
  const notionDbId  = import.meta.env.NOTION_DATABASE_ID   ?? process.env.NOTION_DATABASE_ID   ?? '';

  const notionPayload = {
    parent: { database_id: notionDbId },
    properties: {
      '이름': {
        title: [{ text: { content: name || '(미입력)' } }],
      },
      '전화번호': { phone_number: phone || null },
      '신청일시': {
        date: { start: new Date().toISOString() },
      },
      '상태': { select: { name: '신청완료' } },
      '경로구분': { select: { name: source || '직접' } },
    },
  };

  const notionRes = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${notionToken}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify(notionPayload),
  });

  if (!notionRes.ok) {
    console.error('Notion save error:', await notionRes.text());
    return new Response(JSON.stringify({ ok: false }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
