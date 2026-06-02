/**
 * ediya-mock 테넌트의 응모 내역 조회 스크립트
 * 실행: node scripts/read-ediya-entries.mjs
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

// .env 파일 수동 파싱
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

const firebaseConfig = {
  apiKey:            envVars.VITE_FIREBASE_API_KEY,
  authDomain:        envVars.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         envVars.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     envVars.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: envVars.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             envVars.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

async function readEntries() {
  const TENANT_ID = 'ediya-mock';
  const colRef = collection(db, 'tenants', TENANT_ID, 'entries');
  const snap   = await getDocs(colRef);

  if (snap.empty) {
    console.log('\n⚠️  응모 내역이 없습니다.\n');
    process.exit(0);
  }

  // timestamp 기준 최신순 정렬
  const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  docs.sort((a, b) => {
    const getMs = t =>
      t?.toMillis?.() ?? (t?.seconds ? t.seconds * 1000 : new Date(t ?? 0).getTime());
    return getMs(b.timestamp) - getMs(a.timestamp);
  });

  console.log(`\n📋 [${TENANT_ID}] 응모 고객 리스트 (총 ${docs.length}명)\n`);
  console.log('No. | 응모시각                      | 이름       | 연락처          | 당첨 결과');
  console.log('----+-------------------------------+------------+-----------------+---------------------');

  docs.forEach((item, i) => {
    const getMs = t =>
      t?.toMillis?.() ?? (t?.seconds ? t.seconds * 1000 : new Date(t ?? 0).getTime());
    const ms   = getMs(item.timestamp);
    const date = ms ? new Date(ms).toLocaleString('ko-KR', { hour12: false }) : item.date ?? '-';
    const no   = String(i + 1).padStart(3, ' ');
    const name = (item.name ?? '-').padEnd(10, ' ');
    const phone = (item.phone ?? '-').padEnd(15, ' ');
    console.log(`${no} | ${date.padEnd(29)} | ${name} | ${phone} | ${item.prize ?? '-'}`);
  });

  console.log('\n');
  process.exit(0);
}

readEntries().catch(err => {
  console.error('❌ 오류:', err.message);
  process.exit(1);
});
