import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBdVUrgAeSCbzBVCQVk0wnLRcKcywxp5bY",
  authDomain: "dineevent.firebaseapp.com",
  projectId: "dineevent",
  storageBucket: "dineevent.firebasestorage.app",
  messagingSenderId: "775751591653",
  appId: "1:775751591653:web:88a846761a8f8bba4e160c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log("Cleaning up existing entries...");
  const q = await getDocs(collection(db, "entries"));
  for (const d of q.docs) {
    await deleteDoc(doc(db, "entries", d.id));
  }
  console.log(`Deleted ${q.docs.length} entries.`);

  const mockData = [
    { name: "김태희", phone: "010-1111-2222", prize: "프리미엄 사케 세트" },
    { name: "이병헌", phone: "010-3333-4444", prize: "꽝" },
    { name: "송혜교", phone: "010-5555-6666", prize: "사이드 메뉴 서비스" },
    { name: "공유", phone: "010-7777-8888", prize: "프리미엄 사케 세트" },
    { name: "수지", phone: "010-9999-0000", prize: "꽝" },
    { name: "정해인", phone: "010-1234-1234", prize: "음료수 1캔" },
    { name: "아이유", phone: "010-5678-5678", prize: "꽝" },
    { name: "박보검", phone: "010-1357-2468", prize: "프리미엄 사케 세트" },
    { name: "전지현", phone: "010-2468-1357", prize: "꽝" },
    { name: "현빈", phone: "010-9876-5432", prize: "사이드 메뉴 서비스" }
  ];

  console.log("Seeding 10 mock entries...");
  const now = new Date();
  for (const item of mockData) {
    await addDoc(collection(db, "entries"), {
      ...item,
      date: now.toLocaleString('ko-KR'),
      timestamp: serverTimestamp()
    });
  }
  console.log("Successfully seeded 10 entries!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Error during seeding:", err);
  process.exit(1);
});
