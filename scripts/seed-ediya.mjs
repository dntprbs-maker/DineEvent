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

const names = ['김민수', '이지은', '박지호', '최수아', '정우진', '강하은', '조현우', '윤서연', '장민준', '임서윤'];
const prizes = ['1등 아메리카노 1잔', '2등 카페라떼 1잔', '3등 쿠키 1개', '4등 500원 할인권', '5등 다음 기회에'];

async function seedEntries() {
  const TENANT_ID = 'ediya-mock';
  const colRef = collection(db, 'tenants', TENANT_ID, 'entries');

  console.log(`\n🎲 [${TENANT_ID}] 매장에 더미 응모 데이터 10개 삽입 시작...\n`);

  for (let i = 0; i < 10; i++) {
    const targetTime = new Date(Date.now() - (i * 60 * 1000));
    const dateStr = targetTime.toLocaleString('ko-KR', { 
      year: 'numeric', month: '2-digit', day: '2-digit', 
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false 
    });

    const mockEntry = {
      name: names[i],
      phone: `010-${String(Math.floor(1000 + Math.random() * 9000))}-${String(Math.floor(1000 + Math.random() * 9000))}`,
      prize: prizes[Math.floor(Math.random() * prizes.length)],
      date: dateStr,
      timestamp: targetTime
    };

    await addDoc(colRef, mockEntry);
    process.stdout.write(`  [${String(i+1).padStart(2, '0')}/10] ${mockEntry.name} (${mockEntry.phone}) → ${mockEntry.prize}\n`);
  }

  console.log(`\n✅ 완료!\n`);
  process.exit(0);
}

seedEntries().catch((err) => {
  console.error('❌ 오류 발생:', err);
  process.exit(1);
});
