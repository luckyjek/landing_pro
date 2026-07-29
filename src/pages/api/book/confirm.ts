export const prerender = false;

const EXPECTED_AMOUNT = 5500;

export async function POST({ request }: { request: Request }) {
  let body: { paymentKey?: string; orderId?: string; amount?: number };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: '잘못된 요청입니다.' }), { status: 400 });
  }

  const { paymentKey, orderId, amount } = body;

  if (!paymentKey || !orderId || !amount) {
    return new Response(JSON.stringify({ error: '필수 파라미터가 누락됐습니다.' }), { status: 400 });
  }

  if (amount !== EXPECTED_AMOUNT) {
    return new Response(JSON.stringify({ error: '결제 금액이 올바르지 않습니다.' }), { status: 400 });
  }

  const secretKey = import.meta.env.TOSS_SECRET_KEY;
  const encoded = Buffer.from(secretKey + ':').toString('base64');

  const res = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encoded}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  const data = await res.json();

  if (!res.ok) {
    return new Response(JSON.stringify({ error: data.message || '결제 승인 실패' }), {
      status: res.status,
    });
  }

  return new Response(JSON.stringify({ success: true, payment: data }), { status: 200 });
}
