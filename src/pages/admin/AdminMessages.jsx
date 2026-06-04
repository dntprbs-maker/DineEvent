import { useState, useEffect, useMemo } from 'react';
import { getDocs, deleteDoc, doc, addDoc, getDoc } from 'firebase/firestore';

import { useIsMobile } from '../../hooks/useIsMobile';
import MobileAdminMessages from '../../components/admin/MobileAdminMessages';
import { useTenant } from '../../context/TenantContext';

const AdminMessages = () => {
  const { getColRef, getDocRef, tenantId } = useTenant();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [smsTemplate, setSmsTemplate] = useState('[실제 매장이름] 고객님, 새로운 이벤트가 시작되었습니다! 지금 바로 매장에 방문하여 참여해보세요!');

  // ✅ 수정: fetchBrandName/fetchEntries를 useEffect보다 먼저 선언 (호이스팅 오류 방지)

  // 식당관리 정보에서 설정한 실제 매장명 불러오기
  const fetchBrandName = async () => {
    try {
      const homeDoc = await getDoc(getDocRef('settings', 'home'));
      if (homeDoc.exists() && homeDoc.data().brandName) {
        const name = homeDoc.data().brandName;
        setSmsTemplate(`[${name}] 고객님, 새로운 이벤트가 시작되었습니다! 지금 바로 매장에 방문하여 참여해보세요!`);
      }
    } catch (err) {
      console.error("매장명 불러오기 실패:", err);
    }
  };

  const fetchEntries = async () => {
    setLoading(true);
    try {
      // ✅ 수정: orderBy('timestamp')를 제거하고 전체 조회 후 JS에서 정렬
      // 이유: Firestore의 orderBy()는 해당 필드가 null이거나 없는 문서를 결과에서 제외함.
      // serverTimestamp()로 저장된 직후 클라이언트 캐시에서 읽으면 timestamp가 null일 수 있어
      // 실제 응모된 데이터가 관리자 화면에 표시되지 않는 버그가 있었음.
      const querySnapshot = await getDocs(getColRef('entries'));
      
      const now = Date.now();
      const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
      const validData = [];

      // 데이터를 불러오면서 24시간이 지난 내역은 자동으로 청소(삭제)합니다.
      for (const document of querySnapshot.docs) {
        const item = { id: document.id, ...document.data() };
        
        // timestamp 필드에서 시간(ms)을 추출합니다.
        // Firestore Timestamp 객체, JS Date 객체, 문자열 등 다양한 형태를 모두 처리합니다.
        let entryTime = 0;
        if (item.timestamp && typeof item.timestamp.toMillis === 'function') {
          // Firestore 서버 타임스탬프 (가장 일반적인 형태)
          entryTime = item.timestamp.toMillis();
        } else if (item.timestamp instanceof Date) {
          // JS Date 객체
          entryTime = item.timestamp.getTime();
        } else if (item.timestamp && typeof item.timestamp === 'string') {
          // 문자열 날짜
          entryTime = new Date(item.timestamp).getTime();
        } else if (item.timestamp && item.timestamp.seconds) {
          // Firestore Timestamp 직렬화 객체 ({seconds, nanoseconds})
          entryTime = item.timestamp.seconds * 1000;
        }
        // timestamp가 null/없는 경우: entryTime = 0 → 24시간 체크 통과하여 목록에 표시됨

        if (entryTime > 0 && (now - entryTime) > TWENTY_FOUR_HOURS) {
          // 24시간이 지났으면 클라우드에서 영구 삭제
          try {
            await deleteDoc(doc(getColRef('entries'), item.id));
          } catch (delErr) {
            console.error("자동 삭제 실패:", delErr);
          }
        } else {
          // 24시간 이내의 데이터(및 timestamp 없는 데이터)는 목록에 포함
          validData.push({ ...item, _entryTime: entryTime });
        }
      }

      // JS에서 직접 최신순 정렬 (timestamp 없는 항목은 맨 위로)
      validData.sort((a, b) => (b._entryTime || 0) - (a._entryTime || 0));

      setEntries(validData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
    fetchBrandName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);


  const clearAll = async () => {
    if (window.confirm('클라우드의 모든 응모 내역을 삭제하시겠습니까?')) {
      try {
        for (const entry of entries) {
          await deleteDoc(doc(getColRef('entries'), entry.id));
        }
        setEntries([]);
        alert('삭제 완료');
      } catch {
        // 삭제 실패 시 사용자 알림만 제공 (에러 상세는 개발 단계에서 확인)
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
        await addDoc(getColRef('entries'), mockEntry);
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
