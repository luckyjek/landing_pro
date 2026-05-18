export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url, redirect }) => {
  const code  = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error || !code) {
    return redirect('/titan-class?status=cancelled');
  }

  // ① 인가 코드 → 액세스 토큰 교환
  const tokenBody = new URLSearchParams({
    grant_type:   'authorization_code',
    client_id:    import.meta.env.KAKAO_REST_API_KEY,
    redirect_uri: import.meta.env.KAKAO_REDIRECT_URI,
    code,
  });
  if (import.meta.env.KAKAO_CLIENT_SECRET) {
    tokenBody.set('client_secret', import.meta.env.KAKAO_CLIENT_SECRET);
  }

  const tokenRes = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
    body: tokenBody,
  });

  if (!tokenRes.ok) {
    console.error('Kakao token error:', await tokenRes.text());
    return redirect('/titan-class?status=error');
  }

  const { access_token } = await tokenRes.json() as { access_token: string };

  // ② 사용자 정보 조회 (5개 필드 요청)
  const userRes = await fetch('https://kapi.kakao.com/v2/user/me', {
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  });

  if (!userRes.ok) {
    console.error('Kakao userinfo error:', await userRes.text());
    return redirect('/titan-class?status=error');
  }

  const user = await userRes.json() as KakaoUser;
  const account = user.kakao_account ?? {};
  const profile = account.profile ?? {};

  const name        = account.name                 ?? '';
  const nickname    = profile.nickname              ?? '';
  const email       = account.email                ?? '';
  const phone       = account.phone_number         ?? '';
  const profileImg  = profile.profile_image_url
                   ?? profile.thumbnail_image_url  ?? '';
  const kakaoId     = String(user.id);

  // ③ Notion DB에 저장
  const notionPayload = {
    parent: { database_id: import.meta.env.NOTION_DATABASE_ID },
    properties: {
      '이름': {
        title: [{ text: { content: name || nickname || '(미입력)' } }],
      },
      '닉네임': {
        rich_text: [{ text: { content: nickname } }],
      },
      '이메일': { email: email || null },
      '전화번호': { phone_number: phone || null },
      '프로필사진': { url: profileImg || null },
      '카카오ID': {
        rich_text: [{ text: { content: kakaoId } }],
      },
      '신청일시': {
        date: { start: new Date().toISOString() },
      },
      '상태': { select: { name: '신청완료' } },
    },
  };

  const notionRes = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify(notionPayload),
  });

  if (!notionRes.ok) {
    console.error('Notion save error:', await notionRes.text());
    // 저장 실패해도 사용자는 성공 페이지로 (별도 알림 확인 필요)
  }

  return redirect('/apply-success');
};

// ── 카카오 응답 타입 ──────────────────────────────────────────────────────────
interface KakaoUser {
  id: number;
  kakao_account?: {
    profile?: {
      nickname?: string;
      profile_image_url?: string;
      thumbnail_image_url?: string;
    };
    name?: string;
    email?: string;
    phone_number?: string;
  };
}
