import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { useIsMobile } from '../../hooks/useIsMobile';
import MobileAdminMessages from '../../components/admin/MobileAdminMessages';

const AdminMessages = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [smsTemplate, setSmsTemplate] = useState('[다인이벤트] 고객님, 새로운 이벤트가 시작되었습니다! 지금 바로 "식당명"으로 오셔서 이벤트에 참여해보세요!');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'entries'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const now = Date.now();
      const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
      const validData = [];

      // 데이터를 불러오면서 24시간이 지난 내역은 자동으로 청소(삭제)합니다.
      for (const document of querySnapshot.docs) {
        const item = { id: document.id, ...document.data() };
        
        let entryTime = 0;
        if (item.timestamp && typeof item.timestamp.toMillis === 'function') {
          entryTime = item.timestamp.toMillis();
        } else if (item.timestamp) {
          entryTime = new Date(item.timestamp).getTime();
        }

        if (entryTime > 0 && (now - entryTime) > TWENTY_FOUR_HOURS) {
          // 24시간이 지났으면 클라우드에서 영구 삭제
          try {
            await deleteDoc(doc(db, 'entries', item.id));
          } catch (delErr) {
            console.error("자동 삭제 실패:", delErr);
          }
        } else {
          // 24시간 이내의 데이터만 화면에 표시
          validData.push(item);
        }
      }

      setEntries(validData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = async () => {
    if (window.confirm('클라우드의 모든 응모 내역을 삭제하시겠습니까?')) {
      try {
        for (const entry of entries) {
          await deleteDoc(doc(db, 'entries', entry.id));
        }
        setEntries([]);
        alert('삭제 완료');
      } catch (err) {
        alert('삭제 실패');
      }
    }
  };

  const generateMockEntries = async () => {
    setLoading(true);
    const prizes_list = ['🥇 1등: 다이슨 에어랩', '🥈 2등: 신세계 10만원권', '🥉 3등: 스타벅스 3만원권', '🍗 4등: BHC 후라이드+콜라 세트', '🍦 5등: 배스킨라빈스 파인트', '🍀 6등: 다음 기회에'];
    
    try {
      for (let i = 0; i < 100; i++) {
        const targetTime = new Date(Date.now() - (i * 60 * 1000)); // 1분 간격
        const dateStr = targetTime.toLocaleString('ko-KR', { 
          year: 'numeric', month: '2-digit', day: '2-digit', 
          hour: '2-digit', minute: '2-digit', second: '2-digit',
          hour12: false 
        });

        const mockEntry = {
          name: `테스터${String(i + 1).padStart(3, '0')}`,
          phone: `010-0000-${String(i + 1).padStart(4, '0')}`,
          prize: prizes_list[i % prizes_list.length],
          date: dateStr,
          timestamp: targetTime
        };
        await addDoc(collection(db, 'entries'), mockEntry);
      }
      alert('목업 데이터 100개 생성 완료!');
      fetchEntries();
    } catch (err) {
      console.error(err);
      alert('생성 실패: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const uniqueData = useMemo(() => {
    return Array.from(new Map(entries.map(item => [item.phone, item])).values());
  }, [entries]);

  const isMobile = useIsMobile(768);

  if (loading) return <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>내역 불러오는 중...</div>;

  if (isMobile) {
    return (
      <div className="admin-content-inner">
        <MobileAdminMessages 
          entries={entries}
          uniqueData={uniqueData}
          smsTemplate={smsTemplate}
          setSmsTemplate={setSmsTemplate}
          clearAll={clearAll}
        />
      </div>
    );
  }

  return (
    <div className="glass" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ color: 'var(--primary)' }}>📋 고객 응모 내역 (Cloud)</h3>
        <button onClick={generateMockEntries} className="premium-gold-button" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '8px' }}>
          ✨ 목업데이터 100개 생성
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
        <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>메세지 템플릿 수정</label>
        <textarea value={smsTemplate} onChange={(e) => setSmsTemplate(e.target.value)} style={{ width: '100%', height: '80px', background: '#000', border: '1px solid #333', padding: '1rem', color: '#fff', borderRadius: '12px' }} />
        <button 
          onClick={() => {
            const numbers = uniqueData.map(e => e.phone.replace(/[^0-9]/g, '')).join(',');
            window.location.href = `sms:${numbers}?body=${encodeURIComponent(smsTemplate)}`;
          }} 
          className="premium-gold-button"
          style={{ padding: '1.2rem', borderRadius: '15px' }}
        >
          💬 이벤트 참여 고객 문자 발송 ({uniqueData.length}명)
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #333', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>날짜</th>
              <th style={{ padding: '1rem' }}>이름</th>
              <th style={{ padding: '1rem' }}>연락처</th>
              <th style={{ padding: '1rem' }}>당첨결과</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '1rem' }}>{entry.date}</td>
                <td style={{ padding: '1rem' }}>{entry.name}</td>
                <td style={{ padding: '1rem' }}>{entry.phone}</td>
                <td style={{ padding: '1rem', color: 'var(--primary)' }}>{entry.prize}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMessages;
