/**
 * 500소갈비 매장 더미 응모 데이터 50개 삽입 스크립트
 * 실행: node scripts/seed-entries.mjs
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

const envVars = {};
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      envVars[match[1]] = match[2] ? match[2].replace(/^['"]?(.*?)['"]?$/, '$1') : '';
    }
  });
}

// Firebase 설정 (.env 파일 또는 process.env 사용)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || envVars.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || envVars.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || envVars.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || envVars.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || envVars.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID || envVars.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 상품 목록
const prizes = [
  '1등 샴페인 교환권',
  '2등 시그니처 머그',
  '3등 수제 케이크',
  '4등 아메리카노 1잔',
  '5등 프리미엄 초콜릿',
  '다음 기회에(꽝)',
  '다음 기회에(꽝)',  // 꽝 확률 높이기
  '다음 기회에(꽝)',
];

// 임의 전화번호 (010-5555-XXXX)
const randomPhone = () =>
  `010-5555-${String(Math.floor(1000 + Math.random() * 9000))}`;

// 최근 30일 내 임의 Firestore Timestamp 형태
const randomTs = () => {
  const now = Date.now();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  return {
    seconds: Math.floor((now - Math.random() * thirtyDays) / 1000),
    nanoseconds: 0,
  };
};

async function seedEntries() {
  const TENANT_ID = '500galbi';
  const COUNT = 50;
  const colRef = collection(db, 'tenants', TENANT_ID, 'entries');

  console.log(`\n🎲 [${TENANT_ID}] 매장에 더미 응모 데이터 ${COUNT}개 삽입 시작...\n`);

  for (let i = 1; i <= COUNT; i++) {
    const prize = prizes[Math.floor(Math.random() * prizes.length)];
    const phone = randomPhone();
    await addDoc(colRef, {
      phone,
      prize,
      prizeName: prize,
      createdAt: randomTs(),
    });
    process.stdout.write(`  [${String(i).padStart(2, '0')}/${COUNT}] ${phone}  →  ${prize}\n`);
  }

  console.log(`\n✅ 완료! Firestore tenants/${TENANT_ID}/entries 에 ${COUNT}개 문서가 추가되었습니다.\n`);
  process.exit(0);
}

seedEntries().catch((err) => {
  console.error('❌ 오류 발생:', err.message);
  process.exit(1);
});
