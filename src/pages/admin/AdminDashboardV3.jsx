import React, { useState } from 'react';

const AdminDashboardV3 = () => {
  // 테스트용 목업 데이터 (기존 데이터와 동일한 형식)
  const [mockEntries] = useState([
    { id: 'm1', date: '2026. 05. 16. 00:15:43', name: '김태희', phone: '010-1234-5678', prize: '🥇 1등: 다이슨 에어랩' },
    { id: 'm2', date: '2026. 05. 16. 00:12:21', name: '이병헌', phone: '010-9876-5432', prize: '🥈 2등: 신세계 10만원' },
    { id: 'm3', date: '2026. 05. 16. 00:08:10', name: '정우성', phone: '010-5555-4444', prize: '🥉 3등: 스타벅스 3만원' },
    { id: 'm4', date: '2026. 05. 16. 00:05:01', name: '전지현', phone: '010-1111-2222', prize: '🍦 5등: 베스킨라빈스' },
    { id: 'm5', date: '2026. 05. 15. 23:58:30', name: '원빈', phone: '010-3333-7777', prize: '🍀 다음 기회에' },
  ]);

  const [smsTemplate, setSmsTemplate] = useState('[다인이벤트] 고객님, 새로운 이벤트가 시작되었습니다! 지금 바로 매장에 방문하여 참여해보세요!');

  const styles = {
    container: {
      display: 'flex',
      gap: '2rem',
      padding: '2rem',
      background: '#0a0a0a',
      minHeight: '100vh',
      color: '#fff'
    },
    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    },
    summaryRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1.5rem'
    },
    summaryCard: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '24px',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '1.2rem'
    },
    iconBox: (gradient) => ({
      width: '56px',
      height: '56px',
      borderRadius: '16px',
      background: gradient,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
    }),
    tableWrapper: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      padding: '2rem'
    },
    sidebar: {
      width: '380px',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    sidebarContent: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      padding: '2rem',
      position: 'sticky',
      top: '2rem'
    }
  };

  return (
    <div style={styles.container}>
      
      {/* 메인 리스트 영역 */}
      <div style={styles.main}>
        
        {/* 요약 카드 (기존 스타일 유지) */}
        <div style={styles.summaryRow}>
          <div style={styles.summaryCard}>
            <div style={styles.iconBox('linear-gradient(135deg, #fbbf24, #d97706)')}>👥</div>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#666', fontWeight: '800' }}>총 응모자</p>
              <h4 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '900' }}>
                1,248 <span style={{ fontSize: '12px', color: '#d97706', fontWeight: '400' }}>명</span>
              </h4>
            </div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.iconBox('linear-gradient(135deg, #34d399, #059669)')}>🔥</div>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#666', fontWeight: '800' }}>오늘의 응모</p>
              <h4 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '900', color: '#c5a059' }}>
                156 <span style={{ fontSize: '12px', color: '#059669', fontWeight: '400' }}>명</span>
              </h4>
            </div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.iconBox('linear-gradient(135deg, #a78bfa, #4f46e5)')}>🏆</div>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#666', fontWeight: '800' }}>당첨 인원</p>
              <h4 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '900' }}>
                42 <span style={{ fontSize: '12px', color: '#4f46e5', fontWeight: '400' }}>명</span>
              </h4>
            </div>
          </div>
        </div>

        {/* 기존 테이블 디자인 그대로 유지 */}
        <div style={styles.tableWrapper}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ color: 'var(--primary)', margin: 0 }}>📋 고객 응모 내역</h3>
            {/* 검색창 추가 */}
            <input 
              type="text" 
              placeholder="🔍 이름, 연락처 검색..." 
              style={{ 
                background: '#000', border: '1px solid #333', borderRadius: '8px', 
                padding: '0.6rem 1rem', color: '#fff', fontSize: '0.85rem', width: '250px' 
              }}
            />
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
                {mockEntries.map((entry) => (
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
      </div>

      {/* 우측 사이드바 (메시지 설정 영역) */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarContent}>
          <h4 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>💬 메시지 템플릿 설정</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            <label style={{ fontSize: '0.85rem', color: '#a0a0a0' }}>내용 수정</label>
            <textarea 
              value={smsTemplate} 
              onChange={(e) => setSmsTemplate(e.target.value)} 
              style={{ 
                width: '100%', height: '200px', background: '#000', border: '1px solid #333', 
                padding: '1rem', color: '#fff', borderRadius: '12px', fontSize: '0.9rem', 
                resize: 'none', outline: 'none' 
              }} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button className="premium-gold-button" style={{ padding: '1.2rem', borderRadius: '15px', width: '100%' }}>
              💬 문자 발송하기
            </button>
            <button style={{ 
              background: 'transparent', border: '1px solid #333', color: '#666', 
              padding: '0.8rem', borderRadius: '10px', fontSize: '0.8rem', cursor: 'pointer' 
            }}>
              🗑️ 전체 내역 삭제
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboardV3;
