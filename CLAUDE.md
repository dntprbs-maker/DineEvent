# DineEvent 프로젝트 안내

> 이 파일은 AI 코딩 도구(클로드 코드 / 안티그래비티 등)가 프로젝트를 빠르게 이해하도록 돕는 안내서입니다.
> 작업하다 규칙이 생기면 한 줄씩 자유롭게 추가하세요.

## 이 프로젝트가 뭔가요

식당용 **이벤트 룰렛(추첨) 서비스**입니다. 손님이 룰렛을 돌려 경품을 받고,
사장님은 관리자 페이지에서 응모자와 문자를 관리합니다.
여러 식당을 한 시스템에서 운영하는 **멀티테넌트** 구조이며, 전체를 관리하는 **마스터 관리자**가 있습니다.

## 기술 스택

- React 19 + Vite (순수 JavaScript, TypeScript 미사용)
- React Router 7 (라우팅)
- Firebase — Firestore(DB) + Storage(이미지)
- Tailwind CSS 4
- 배포: Firebase Hosting (구 Netlify, 2026-07-08 이전 진행 중 — 상세는 TODO.md)

## 폴더 구조 (핵심만)

- `src/pages/` — 일반 페이지 + `admin/`(사장님 관리자) 하위 폴더
- `src/pages/SuperAdmin.jsx` — 마스터(전체) 관리자
- `src/components/` — 공통 컴포넌트 + `admin/`(모바일 관리자)
- `src/context/TenantContext.jsx` — 멀티테넌트 핵심. 가맹점별 데이터 격리 담당
- `src/firebase.js` — Firebase 초기화

## 멀티테넌트 규칙 (중요)

- 주소는 `/가맹점ID/...` 형태로 가맹점이 구분됩니다.
- 데이터는 가맹점별로 격리됩니다. Firestore 경로를 직접 쓰지 말고,
  `TenantContext.jsx`의 헬퍼(`getDocRef`, `getColRef`, `fetchDocWithFallback`)를 사용하세요.

## 꼭 지켜야 할 것

- **비밀 정보는 환경변수로 관리합니다.** Firebase 키 등은 `.env`에 두고 `VITE_` 접두사를 씁니다.
  API 키·비밀번호를 코드에 직접 적지 마세요. (`.env`는 깃에 올리지 않습니다.)
- **`.bak`, `.backup` 파일은 지우지 마세요.** 의도적으로 보관 중인 백업입니다.
- **프로젝트 이름은 당분간 바꾸지 마세요.** 저장소명 `DineEvent`로 통일하려다 보류한 상태입니다.
  Firebase 등 연동이 꼬일 수 있어, 이름 정리는 나중에 별도로 진행합니다.

## 인증 체계 (2026-07-08 Firebase Auth 도입)

- 관리자 권한은 Firestore `admins/{uid}` 문서로 판별
  (`{ role: 'super' }` 또는 `{ role: 'tenant', tenantId: '가맹점ID' }`)
- 사장님 로그인: 가맹점 ID 기반 가상 이메일 `{tenantId}@admin.dineevent.app` + 비밀코드(6자리 이상)
  → UI는 `src/components/admin/AdminGate.jsx`, 로직은 `src/context/AuthContext.jsx`
- 슈퍼관리자 로그인: `VITE_SUPER_ADMIN_EMAIL` 계정 (`/master-admin`)
- 가맹점 신규 발급 시 SuperAdmin이 관리자 계정 + admins 문서를 자동 생성
- 보안 규칙은 `firestore.rules` — 배포: `npx firebase-tools deploy --only firestore:rules`

## 할 일

> 할 일 목록은 `TODO.md`에서 관리합니다.

## 자주 쓰는 명령어

- 개발 서버 실행: `npm run dev`
- 빌드: `npm run build`
- 코드 검사: `npm run lint`
