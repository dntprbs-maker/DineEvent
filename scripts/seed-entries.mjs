/**
 * 500소갈비 매장 더미 응모 데이터 50개 삽입 스크립트
 * 실행: node scripts/seed-entries.mjs
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Firebase 설정 (환경변수 직접 하드코딩 — 개발용 스크립트)
const firebaseConfig = {
  apiKey: "AIzaSyBdVUrgAeSCbzBVCQVk0wnLRcKcywxp5bY",
  authDomain: "dineevent.firebaseapp.com",
  projectId: "dineevent",
  storageBucket: "dineevent.firebasestorage.app",
  messagingSenderId: "775751591653",
  appId: "1:775751591653:web:88a846761a8f8bba4e160c",
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
