# 📋 작업 현황 (DineEvent)

## 🔴 미해결

- [ ] 네임서버 전파 완료 확인 — 변경 직후라 아직 반영 안 됨
- [ ] SSL 자동 발급 확인
- [ ] `www.event-roulette.co.kr`에서 실기능(로그인 등) 재검증
- [ ] Netlify 사이트(dien-event-main) 해지 — 클린메니저 컷오버까지 끝난 뒤 한 번에 진행 예정
- [ ] (선택) GitHub Actions로 Firebase 자동배포 설정 — 클린메니저는 이미 설정함, 같은 방식 적용 가능
- [ ] 룰렛 재고 차감(`tenants/{t}/content/prizes` 공개 쓰기)을 Cloud Function으로 이전
- [ ] `entries` 공개 create에 필드 검증 추가 (`firestore.rules` TODO 참고)
- [ ] README를 실제 프로젝트 설명으로 교체 (현재 Vite 기본 템플릿)
- [ ] **기존 tenant 문서들에 남아있는 평문 `adminPasscode` 필드 데이터 정리**
- [ ] 기존 15개 가맹점은 Auth 계정이 없음 — 데모 외 매장 관리자 로그인하려면 계정 발급 필요
- [ ] Netlify 환경변수 값이 로컬 `.env`에 다 있는지 최종 확인 (`VITE_SUPER_ADMIN_EMAIL` 포함, 로컬엔 이미 있음)

## ✅ 완료 로그

- [x] 관리자 임시 비밀번호를 코드에서 제거 → Firebase Authentication 도입 — 완료: 2026-07-08
- [x] Firestore 보안 규칙 설정, Auth 기반 규칙 배포 — 완료: 2026-07-08
- [x] 계정 시딩 (슈퍼관리자 + 데모 관리자) — 완료: 2026-07-08
- [x] Firebase Hosting 배포 (dineevent.web.app) — 완료: 2026-07-08
- [x] 가비아 DNS에 레코드 등록 (A, TXT, CNAME) — 완료: 2026-07-08
- [x] 가비아 네임서버를 가비아 기본값으로 변경 — 완료: 2026-07-08
