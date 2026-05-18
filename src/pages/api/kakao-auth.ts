export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ redirect }) => {
  const params = new URLSearchParams({
    client_id: import.meta.env.KAKAO_REST_API_KEY,
    redirect_uri: import.meta.env.KAKAO_REDIRECT_URI,
    response_type: 'code',
    // 5가지 필수 동의 항목
    scope: 'profile_nickname,profile_image,name,account_email,phone_number',
  });

  return redirect(
    `https://kauth.kakao.com/oauth/authorize?${params.toString()}`
  );
};
