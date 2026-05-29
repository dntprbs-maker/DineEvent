# 이벤트 룰렛 (Event Roulette)

식당 방문 고객을 위한 **이벤트 룰렛(추첨) 서비스**입니다. 손님이 스마트폰으로 매장의 QR 코드를 스캔하거나 전용 링크로 접속해 룰렛을 돌려 경품을 받을 수 있으며, 사장님은 관리자 페이지를 통해 이벤트 응모자와 당첨 내역을 관리할 수 있습니다. 

여러 식당(가맹점)을 하나의 시스템에서 운영할 수 있는 **멀티테넌트(Multi-tenant)** 구조로 설계되었습니다.

## 🚀 주요 기능

- **손님 (이벤트 참여자)**
  - 가맹점별 전용 이벤트 링크 접속
  - 직관적이고 화려한 룰렛 UI를 통한 이벤트 참여
  - 당첨 결과 실시간 확인
- **가맹점 사장님 (Admin)**
  - 매장 전용 관리자 페이지 제공
  - 이벤트 응모자 정보 및 당첨 내역 확인
  - 매장 전용 이벤트 QR 코드 발급 및 인쇄 기능
  - 고객 알림 문자 관리
- **전체 관리자 (Super Admin)**
  - 전체 시스템 및 가맹점(테넌트) 목록 관리

## 🛠 기술 스택

- **Frontend**: React 19, Vite, 순수 JavaScript
- **Routing**: React Router 7
- **Styling**: Tailwind CSS 4
- **Backend / DB**: Firebase (Firestore, Storage, Authentication 적용 예정)
- **Deployment**: Netlify

## 📂 주요 폴더 구조

- `src/pages/` — 서비스의 일반 페이지 및 가맹점별 페이지
- `src/pages/admin/` — 가맹점 사장님 전용 관리자 페이지
- `src/pages/SuperAdmin.jsx` — 전체 시스템을 관리하는 마스터 관리자 페이지
- `src/components/` — 공통으로 사용되는 UI 컴포넌트
- `src/context/TenantContext.jsx` — 멀티테넌트 데이터 격리를 담당하는 핵심 컨텍스트
- `src/firebase.js` — Firebase 연동 초기화 파일

## ⚙️ 로컬 실행 방법 (Getting Started)

1. 저장소를 복제하고 패키지를 설치합니다.
   ```bash
   npm install
   ```

2. 프로젝트 최상위 경로에 `.env` 파일을 생성하고 Firebase 환경 변수를 설정합니다. (보안상 `.env` 파일은 Git에 포함되지 않습니다.)
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. 로컬 개발 서버를 실행합니다.
   ```bash
   npm run dev
   ```

4. 빌드 및 배포
   ```bash
   npm run build
   ```
