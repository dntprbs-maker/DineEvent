import { useState } from 'react';

const AdminDashboardV2 = () => {
  // 테스트용 목업 데이터
  const [mockEntries] = useState([
    { id: 1, date: '2026. 05. 16. 00:15:43', name: '김태희', phone: '010-1234-5678', prize: '🥇 1등: 다이슨 에어랩', status: 'winner1' },
    { id: 2, date: '2026. 05. 16. 00:12:21', name: '이병헌', phone: '010-9876-5432', prize: '🥈 2등: 신세계 10만원', status: 'winner2' },
    { id: 3, date: '2026. 05. 16. 00:08:10', name: '정우성', phone: '010-5555-4444', prize: '🥉 3등: 스타벅스 3만원', status: 'winner3' },
    { id: 4, date: '2026. 05. 16. 00:05:01', name: '전지현', phone: '010-1111-2222', prize: '🍦 5등: 베스킨라빈스', status: 'winner5' },
    { id: 5, date: '2026. 05. 15. 23:58:30', name: '원빈', phone: '010-3333-7777', prize: '🍀 다음 기회에', status: 'loss' },
    { id: 6, date: '2026. 05. 15. 23:55:12', name: '송혜교', phone: '010-8888-9999', prize: '🍀 다음 기회에', status: 'loss' },
  ]);

  const [smsTemplate, setSmsTemplate] = useState('[이벤트룰렛] 고객님, 새로운 이벤트가 시작되었습니다! 지금 바로 매장에 방문하여 참여해보세요!');

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      gap: '32px',
      padding: '40px',
      background: '#050505',
      minHeight: '100vh',
      color: '#fff',
      fontFamily: "'Outfit', sans-serif"
    },
    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '40px'
    },
    summaryRow: {
      display: 'flex',
      gap: '24px',
      overflowX: 'auto',
      paddingBottom: '10px'
    },
    summaryCard: {
      flex: 1,
      minWidth: '240px',
      background: 'linear-gradient(145deg, #111, #080808)',
      border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: '30px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
    },
    gridSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    gridHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      padding: '0 10px'
    },
    cardGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '24px'
    },
    entryCard: (status) => {
      let borderColor = 'rgba(255,255,255,0.05)';
      let shadowColor = 'rgba(0,0,0,0.5)';
      if (status === 'winner1') { borderColor = 'rgba(197,160,89,0.4)'; shadowColor = 'rgba(197,160,89,0.15)'; }
      if (status === 'winner2') { borderColor = 'rgba(200,200,200,0.2)'; }
      
      return {
        background: 'rgba(15,15,15,0.8)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${borderColor}`,
        borderRadius: '32px',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        boxShadow: `0 20px 50px ${shadowColor}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      };
    },
    sidebar: {
      width: '400px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    sidebarContent: {
      background: 'rgba(17,17,17,0.9)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: '40px',
      padding: '40px',
      position: 'sticky',
      top: '40px',
      boxShadow: '0 30px 100px rgba(0,0,0,0.8)'
    },
    badge: (status) => {
      let bg = 'rgba(255,255,255,0.05)';
      let color = '#888';
      let fontW = '400';
      if (status === 'winner1') { bg = 'linear-gradient(135deg, #fcd34d, #d97706)'; color = '#000'; fontW = '900'; }
      if (status === 'winner2') { bg = 'linear-gradient(135deg, #e5e7eb, #9ca3af)'; color = '#000'; fontW = '900'; }
      if (status === 'winner3') { bg = 'linear-gradient(135deg, #fb923c, #dc2626)'; color = '#fff'; fontW = '800'; }
      
      return {
        background: bg,
        color: color,
        fontWeight: fontW,
        padding: '10px 20px',
        borderRadius: '16px',
        fontSize: '13px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'fit-content'
      };
    }
  };

  return (
    <div style={styles.container}>
      
      {/* 메인 콘텐츠 영역 */}
      <div style={styles.main}>
        
        {/* 1. 상단 요약 바 */}
        <div style={styles.summaryRow}>
          <div style={styles.summaryCard}>
            <span style={{ fontSize: '24px' }}>👥</span>
            <span style={{ color: '#555', fontSize: '14px', fontWeight: '800' }}>총 응모 고객</span>
            <h2 style={{ fontSize: '32px', fontWeight: '900', margin: 0 }}>1,248</h2>
          </div>
          <div style={styles.summaryCard}>
            <span style={{ fontSize: '24px' }}>🔥</span>
            <span style={{ color: '#555', fontSize: '14px', fontWeight: '800' }}>오늘의 열기</span>
            <h2 style={{ fontSize: '32px', fontWeight: '900', margin: 0, color: '#c5a059' }}>+156</h2>
          </div>
          <div style={styles.summaryCard}>
            <span style={{ fontSize: '24px' }}>🏆</span>
            <span style={{ color: '#555', fontSize: '14px', fontWeight: '800' }}>실시간 당첨</span>
            <h2 style={{ fontSize: '32px', fontWeight: '900', margin: 0 }}>42</h2>
          </div>
        </div>

        {/* 2. 카드 그리드 섹션 */}
        <div style={styles.gridSection}>
          <div style={styles.gridHeader}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '900', margin: '0 0 8px 0' }}>실시간 응모 현황</h1>
              <p style={{ color: '#555', margin: 0 }}>고객들의 참여 내역을 카드 형태로 확인하세요.</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
               <div style={{ position: 'relative' }}>
                 <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }}>🔍</span>
                 <input 
                   type="text" 
                   placeholder="고객 이름 또는 연락처 검색" 
                   style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '14px 16px 14px 44px', color: '#fff', outline: 'none', width: '300px' }}
                 />
               </div>
               <select style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '14px 16px', color: '#888', outline: 'none', cursor: 'pointer' }}>
                 <option>전체 필터</option>
                 <option>당첨자만 보기</option>
               </select>
            </div>
          </div>

          <div style={styles.cardGrid}>
            {mockEntries.map((entry) => (
              <div key={entry.id} style={styles.entryCard(entry.status)} className="hover-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ color: '#444', fontSize: '12px', fontWeight: '800' }}>{entry.date}</span>
                  <span style={{ opacity: 0.2, fontSize: '24px' }}>✨</span>
                </div>
                
                <div>
                  <h3 style={{ fontSize: '22px', fontWeight: '900', margin: '0 0 4px 0' }}>{entry.name}</h3>
                  <p style={{ color: '#888', margin: 0, fontSize: '14px', fontFamily: 'monospace' }}>{entry.phone}</p>
                </div>

                <div style={styles.badge(entry.status)}>
                  {entry.prize}
                </div>

                {/* 장식용 배경 광채 */}
                <div style={{ 
                  position: 'absolute', top: '-50px', right: '-50px', 
                  width: '150px', height: '150px', 
                  background: entry.status.startsWith('winner') ? 'rgba(197,160,89,0.05)' : 'transparent',
                  filter: 'blur(50px)', borderRadius: '50%'
                }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 우측 사이드바 */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarContent}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '900', margin: 0 }}>메시지 매니저</h3>
            <div style={{ width: '10px', height: '10px', background: '#c5a059', borderRadius: '50%', boxShadow: '0 0 10px #c5a059' }} />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <p style={{ color: '#555', fontSize: '12px', fontWeight: '800', marginBottom: '12px', textTransform: 'uppercase' }}>전송 템플릿 설정</p>
            <textarea 
              value={smsTemplate}
              onChange={(e) => setSmsTemplate(e.target.value)}
              style={{ 
                width: '100%', height: '240px', background: '#000', 
                border: '1px solid #222', borderRadius: '24px', 
                padding: '24px', color: '#aaa', fontSize: '15px', 
                outline: 'none', resize: 'none', lineHeight: '1.7' 
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button className="premium-gold-button" style={{ width: '100%', height: '70px', borderRadius: '20px', fontSize: '17px' }}>
              💬 선택 고객 문자 발송
            </button>
            <p style={{ textAlign: 'center', color: '#444', fontSize: '12px', marginTop: '8px' }}>
              현재 필터링된 모든 고객({mockEntries.length}명)에게 발송됩니다.
            </p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hover-card:hover {
          transform: translateY(-10px) scale(1.02);
          background: rgba(255,255,255,0.02) !important;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .hover-card { animation: fadeIn 0.6s ease-out backwards; }
        .hover-card:nth-child(1) { animation-delay: 0.1s; }
        .hover-card:nth-child(2) { animation-delay: 0.2s; }
        .hover-card:nth-child(3) { animation-delay: 0.3s; }
        .hover-card:nth-child(4) { animation-delay: 0.4s; }
        .hover-card:nth-child(5) { animation-delay: 0.5s; }
        .hover-card:nth-child(6) { animation-delay: 0.6s; }
      `}} />
    </div>
  );
};

export default AdminDashboardV2;
