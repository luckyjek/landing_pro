# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

월 3,000만원 수익 대표님의 프리미엄 랜딩페이지 + 월말특강 상세페이지. Astro 기반으로 제작.

## Commands

```bash
npm run dev       # 개발 서버 (localhost:4321)
npm run build     # 프로덕션 빌드
npm run preview   # 빌드 결과 미리보기
```

## Layout Rules

- **최대 너비**: `max-width: 1140px` — 항상 가운데 정렬 (`margin: 0 auto`)
- **분할 화면**: 왼쪽(상세 콘텐츠) + 오른쪽(신청 패널) 2컬럼 구조
  - `grid-template-columns: 1fr 420px`
  - 각 패널이 `height: 100vh; overflow-y: auto`로 독립 스크롤
  - `html, body { height: 100%; overflow: hidden; }` 필수
- **반응형**: 768px 이하에서 단일 컬럼 전환, 오른쪽 패널 숨김 + 하단 고정 CTA 바 표시

## Design System

- **레이아웃**: `LightLayout.astro` (화이트+골드, 상세페이지용)
- **색상**: 배경 `#FFFFFF` / 크림 `#FEFCF6` / 골드 `#C9A84C`, `#8B6914`, `#F0D080`
- **1140px 밖 양옆 배경**: `#F0EDE6` (body 배경 — 따뜻한 크림)
- **폰트**: Playfair Display (헤딩) + Noto Sans KR (본문)
- **네비게이션 없음**: 상세페이지에는 상단 메뉴바 미사용

## Page Structure

| 페이지 | 경로 | 레이아웃 |
|---|---|---|
| 메인 랜딩 | `/` | `Layout.astro` (다크 테마) |
| 월말특강 상세 | `/titan-class` | `LightLayout.astro` (화이트+골드) |

### 타이탄클래스 상세페이지 9섹션

1. 히어로 (이벤트 날짜 + 핵심 타이틀)
2. 페인 포인트 (공감 카드)
3. 변화 약속 (Before/After)
4. 커리큘럼 (매력/심리/브랜딩/인간관계/부의마인드)
5. 강사 소개
6. 사회적 증명 (수치 + 후기)
7. 포함 내역
8. FAQ
9. 파이널 CTA (다크 배경)

## KakaoTalk Integration

- 카카오 채널 링크 플레이스홀더: `https://pf.kakao.com/_xoxxxxxx`
- 채팅 링크: `https://pf.kakao.com/_xoxxxxxx/chat`
- 오른쪽 패널 메인 CTA + 섹션별 보조 버튼으로 노출
