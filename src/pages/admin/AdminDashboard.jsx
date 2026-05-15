import React, { useState } from 'react';

const AdminDashboard = () => {
  // 테스트용 목업 데이터
  const [mockEntries] = useState([
    { id: 1, date: '2026. 05. 16. 00:15:43', name: '김태희', phone: '010-1234-5678', prize: '🥇 1등: 다이슨 에어랩', status: 'winner1' },
    { id: 2, date: '2026. 05. 16. 00:12:21', name: '이병헌', phone: '010-9876-5432', prize: '🥈 2등: 신세계 10만원', status: 'winner2' },
    { id: 3, date: '2026. 05. 16. 00:08:10', name: '정우성', phone: '010-5555-4444', prize: '🥉 3등: 스타벅스 3만원', status: 'winner3' },
    { id: 4, date: '2026. 05. 16. 00:05:01', name: '전지현', phone: '010-1111-2222', prize: '🍦 5등: 베스킨라빈스', status: 'winner5' },
    { id: 5, date: '2026. 05. 15. 23:58:30', name: '원빈', phone: '010-3333-7777', prize: '🍀 다음 기회에', status: 'loss' },
    { id: 6, date: '2026. 05. 15. 23:55:12', name: '송혜교', phone: '010-8888-9999', prize: '🍀 다음 기회에', status: 'loss' },
  ]);

  const [smsTemplate, setSmsTemplate] = useState('[다인이벤트] 고객님, 새로운 이벤트가 시작되었습니다! 지금 바로 매장에 방문하여 참여해보세요!');

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      gap: '24px',
      padding: '32px',
      background: '#050505',
      minHeight: '100vh',
      color: '#e5e7eb',
      fontFamily: "'Outfit', sans-serif"
    },
    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '32px'
    },
    summaryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px'
    },
    summaryCard: {
      background: '#111',
      border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: '24px',
      padding: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
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
    tableSection: {
      background: '#0f0f0f',
      border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: '40px',
      padding: '32px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
    },
    headerRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px'
    },
    sidebar: {
      width: '380px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    sidebarContent: {
      background: '#111',
      border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: '40px',
      padding: '32px',
      position: 'sticky',
      top: '32px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
    },
    input: {
      width: '100%',
      background: 'rgba(0,0,0,0.5)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '16px',
      padding: '12px 16px',
      color: '#fff',
      fontSize: '14px',
      outline: 'none',
      transition: 'border 0.3s'
    }
  };

  return (
    <div style={styles.container}>
      
      {/* 메인 콘텐츠 영역 */}
      <div style={styles.main}>
        
        {/* 1. 데이터 요약 카드 */}
        <div style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <div style={styles.iconBox('linear-gradient(135deg, #fbbf24, #d97706)')}>👥</div>
            <div>
              <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>총 응모자</p>
              <h4 style={{ color: '#fff', fontSize: '24px', fontWeight: '900', margin: 0 }}>
                1,248 <span style={{ fontSize: '12px', color: '#d97706', fontWeight: '400' }}>명</span>
              </h4>
            </div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.iconBox('linear-gradient(135deg, #34d399, #059669)')}>🔥</div>
            <div>
              <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>오늘의 응모</p>
              <h4 style={{ color: '#fff', fontSize: '24px', fontWeight: '900', margin: 0 }}>
                156 <span style={{ fontSize: '12px', color: '#059669', fontWeight: '400' }}>명</span>
              </h4>
            </div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.iconBox('linear-gradient(135deg, #a78bfa, #4f46e5)')}>🏆</div>
            <div>
              <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>당첨 처리 현황</p>
              <h4 style={{ color: '#fff', fontSize: '24px', fontWeight: '900', margin: 0 }}>
                42 <span style={{ fontSize: '12px', color: '#4f46e5', fontWeight: '400' }}>명</span>
              </h4>
            </div>
          </div>
        </div>

        {/* 2. 리스트 헤더 및 필터 영역 */}
        <div style={styles.tableSection}>
          <div style={styles.headerRow}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#fff', margin: 0 }}>
                <span style={{ color: '#c5a059' }}>📋</span> 실시간 응모 리스트
              </h3>
              <p style={{ color: '#555', fontSize: '13px', margin: 0 }}>최근 24시간 이내 데이터입니다.</p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <input 
                type="text" 
                placeholder="이름, 연락처 검색..." 
                style={{ ...styles.input, width: '240px' }}
              />
              <select style={{ ...styles.input, width: '120px', cursor: 'pointer' }}>
                <option>전체 결과</option>
                <option>당첨자만</option>
                <option>꽝 제외</option>
              </select>
            </div>
          </div>

          {/* 3. 테이블 */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
              <thead>
                <tr style={{ color: '#555', fontSize: '12px', fontWeight: '800', textAlign: 'left', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0 24px' }}>응모 시각</th>
                  <th>고객명</th>
                  <th>연락처</th>
                  <th style={{ padding: '0 24px' }}>당첨 결과</th>
                </tr>
              </thead>
              <tbody>
                {mockEntries.map((entry) => (
                  <tr key={entry.id} style={{ transition: 'all 0.3s' }}>
                    <td style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px 0 0 16px', padding: '16px 24px' }}>
                      <p style={{ margin: 0, color: '#444', fontSize: '10px' }}>{entry.date.split(' ').slice(0, 3).join(' ')}</p>
                      <p style={{ margin: 0, color: '#fff', fontWeight: '800', fontSize: '14px' }}>{entry.date.split(' ').slice(-1)}</p>
                    </td>
                    <td style={{ background: 'rgba(255,255,255,0.02)', padding: '16px 0' }}>
                      <span style={{ color: '#fff', fontWeight: '900' }}>{entry.name}</span>
                    </td>
                    <td style={{ background: 'rgba(255,255,255,0.02)', padding: '16px 0' }}>
                      <span style={{ color: '#888', fontFamily: 'monospace' }}>{entry.phone}</span>
                    </td>
                    <td style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '0 16px 16px 0', padding: '16px 24px' }}>
                      <Badge prize={entry.prize} status={entry.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 우측 사이드바 */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarContent}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h4 style={{ fontSize: '18px', fontWeight: '900', color: '#fff', margin: 0 }}>
              <span style={{ color: '#c5a059' }}>💬</span> 메시지 템플릿
            </h4>
            <span style={{ fontSize: '10px', background: 'rgba(197,160,89,0.1)', color: '#c5a059', padding: '4px 8px', borderRadius: '50px', fontWeight: '800' }}>LIVE</span>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '11px', color: '#555', fontWeight: '800', marginBottom: '8px', display: 'block' }}>보낼 메시지 내용</label>
            <textarea 
              value={smsTemplate}
              onChange={(e) => setSmsTemplate(e.target.value)}
              style={{ 
                width: '100%', height: '180px', background: 'rgba(0,0,0,0.6)', 
                border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', 
                padding: '20px', color: '#ccc', fontSize: '14px', outline: 'none', 
                resize: 'none', lineHeight: '1.6' 
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="premium-gold-button" style={{ width: '100%', height: '60px', borderRadius: '16px' }}>
              🚀 참여 고객 문자 발송
            </button>
            <button style={{ 
              width: '100%', background: 'rgba(255,255,255,0.05)', border: 'none', 
              color: '#555', fontWeight: '800', padding: '12px', borderRadius: '16px', 
              fontSize: '13px', cursor: 'pointer' 
            }}>
              🗑️ 응모 내역 전체 삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 배지 컴포넌트
const Badge = ({ prize, status }) => {
  const getStyle = () => {
    switch (status) {
      case 'winner1': return { background: 'linear-gradient(135deg, #fcd34d, #d97706)', color: '#000', fontWeight: '900' };
      case 'winner2': return { background: 'linear-gradient(135deg, #e5e7eb, #9ca3af)', color: '#000', fontWeight: '900' };
      case 'winner3': return { background: 'linear-gradient(135deg, #fb923c, #dc2626)', color: '#fff', fontWeight: '800' };
      case 'winner5': return { background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.2)' };
      case 'loss': return { background: 'rgba(255,255,255,0.05)', color: '#444', filter: 'grayscale(1)' };
      default: return { background: 'rgba(255,255,255,0.05)', color: '#888' };
    }
  };

  return (
    <div style={{ 
      padding: '8px 16px', borderRadius: '12px', fontSize: '12px', 
      display: 'inline-block', ...getStyle() 
    }}>
      {prize}
    </div>
  );
};

export default AdminDashboard;
