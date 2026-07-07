// ============================================================
// DineEvent — 관리자 계정 부트스트랩 시딩 스크립트 (1회성)
//
// 하는 일:
//   1. Firebase Auth에 슈퍼관리자 계정 생성 (이메일/비밀번호)
//   2. 데모 매장(dine-event) 관리자 계정 생성
//   3. 각 계정의 admins/{uid} 권한 문서를 Firestore에 기록
//
// 실행 전 준비:
//   - Firebase 콘솔에서 Authentication 이메일/비밀번호 제공자 활성화
//   - 부트스트랩 규칙 배포 상태 (admins 자기 문서 create 허용)
//
// 사용법 (PowerShell):
//   $env:SUPER_ADMIN_PASSWORD='...'; $env:DEMO_ADMIN_PASSWORD='...'; node scripts/seed-auth-admins.mjs
// ============================================================
import { readFileSync } from 'node:fs';

// .env에서 Firebase 설정 로드
const env = Object.fromEntries(
  readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.includes('='))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
);

const API_KEY = env.VITE_FIREBASE_API_KEY;
const PROJECT = env.VITE_FIREBASE_PROJECT_ID;
const SUPER_EMAIL = env.VITE_SUPER_ADMIN_EMAIL;
const DEMO_TENANT = 'dine-event';
const DEMO_EMAIL = `${DEMO_TENANT}@admin.dineevent.app`;

const SUPER_PASSWORD = process.env.SUPER_ADMIN_PASSWORD;
const DEMO_PASSWORD = process.env.DEMO_ADMIN_PASSWORD;
if (!SUPER_PASSWORD || !DEMO_PASSWORD) {
  console.error('SUPER_ADMIN_PASSWORD / DEMO_ADMIN_PASSWORD 환경변수를 설정하세요.');
  process.exit(1);
}

// 계정 생성 (이미 있으면 로그인으로 폴백)
async function signUpOrIn(email, password) {
  const call = async (endpoint) => {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:${endpoint}?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      }
    );
    return { ok: res.ok, json: await res.json() };
  };

  let { ok, json } = await call('signUp');
  if (!ok && json.error?.message?.startsWith('EMAIL_EXISTS')) {
    console.log(`  이미 존재하는 계정 → 로그인 시도: ${email}`);
    ({ ok, json } = await call('signInWithPassword'));
  }
  if (!ok) throw new Error(`${email} 처리 실패: ${JSON.stringify(json.error)}`);
  return { uid: json.localId, idToken: json.idToken };
}

// admins/{uid} 문서 기록 (Firestore REST, 본인 idToken 사용)
async function writeAdminDoc(uid, idToken, fields) {
  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/admins/${uid}`,
    {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${idToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
    }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(`admins/${uid} 기록 실패: ${JSON.stringify(json.error)}`);
}

console.log('1) 슈퍼관리자 계정 생성:', SUPER_EMAIL);
const superUser = await signUpOrIn(SUPER_EMAIL, SUPER_PASSWORD);
await writeAdminDoc(superUser.uid, superUser.idToken, {
  role: { stringValue: 'super' },
  createdAt: { timestampValue: new Date().toISOString() },
});
console.log('   ✅ admins/' + superUser.uid, '{ role: super }');

console.log('2) 데모 매장 관리자 계정 생성:', DEMO_EMAIL);
const demoUser = await signUpOrIn(DEMO_EMAIL, DEMO_PASSWORD);
await writeAdminDoc(demoUser.uid, demoUser.idToken, {
  role: { stringValue: 'tenant' },
  tenantId: { stringValue: DEMO_TENANT },
  createdAt: { timestampValue: new Date().toISOString() },
});
console.log('   ✅ admins/' + demoUser.uid, `{ role: tenant, tenantId: ${DEMO_TENANT} }`);

console.log('\n🎉 시딩 완료 — 이제 최종 보안 규칙을 배포하세요.');
