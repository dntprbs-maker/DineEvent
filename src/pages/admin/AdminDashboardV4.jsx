import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useIsMobile } from '../../hooks/useIsMobile';
import MobileAdminMessages from '../../components/admin/MobileAdminMessages';

const AdminDashboardV4 = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [smsTemplate, setSmsTemplate] = useState('[이벤트룰렛] 고객님, 새로운 이벤트가 시작되었습니다! 지금 바로 매장에 방문하여 참여해보세요!');

  const isMobile = useIsMobile(768);

  const uniqueData = useMemo(() => {
    return Array.from(new Map(entries.map(item => [item.phone, item])).values());
  }, [entries]);

  // 데이터 불러오기
  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'entries'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const now = Date.now();
      const ONE_YEAR = 365 * 24 * 60 * 60 * 1000; // 1년 (주인님 요청사항 반영)
      const validData = [];

      for (const document of querySnapshot.docs) {
        const item = { id: document.id, ...document.data() };
        
        let entryTime = 0;
        if (item.timestamp && typeof item.timestamp.toMillis === 'function') {
          entryTime = item.timestamp.toMillis();
        } else if (item.timestamp) {
          entryTime = new Date(item.timestamp).getTime();
        }

        if (entryTime > 0 && (now - entryTime) > ONE_YEAR) {
          try {
            await deleteDoc(doc(db, 'entries', item.id));
          } catch (delErr) {
            console.error("자동 삭제 실패:", delErr);
          }
        } else {
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

  // 기간 프리셋 설정 함수
  const setPresetRange = (days) => {
    const end = new Date();
    const start = new Date();
    if (days !== 'all') {
      start.setDate(start.getDate() - days);
      setDateRange({
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
      });
    } else {
      setDateRange({ start: '', end: '' });
    }
  };

  // 통계 계산
  const stats = useMemo(() => {
    const total = entries.length;
    
    // 오늘 응모자 (오늘 00:00:00 이후)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEntries = entries.filter(e => {
      const t = e.timestamp?.toMillis ? e.timestamp.toMillis() : new Date(e.timestamp).getTime();
      return t >= todayStart.getTime();
    }).length;

    // 당첨자 (꽝/다음기회에 제외)
    const winners = entries.filter(e => e.prize && !e.prize.includes('다음 기회에') && !e.prize.includes('꽝')).length;

    return { total, todayEntries, winners };
  }, [entries]);

  // 검색 및 기간 필터링 통합 로직
  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      // 1. 이름/연락처 검색
      const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.phone.includes(searchTerm);
      
      // 2. 기간 필터
      let matchesDate = true;
      if (dateRange.start || dateRange.end) {
        const entryDate = e.timestamp?.toMillis ? e.timestamp.toMillis() : new Date(e.timestamp).getTime();
        if (dateRange.start) {
          const start = new Date(dateRange.start);
          start.setHours(0, 0, 0, 0);
          if (entryDate < start.getTime()) matchesDate = false;
        }
        if (dateRange.end) {
          const end = new Date(dateRange.end);
          end.setHours(23, 59, 59, 999);
          if (entryDate > end.getTime()) matchesDate = false;
        }
      }

      return matchesSearch && matchesDate;
    });
  }, [entries, searchTerm, dateRange]);

  // 문자 발송
  const handleSendSMS = () => {
    const uniqueNumbers = Array.from(new Set(filteredEntries.map(e => e.phone.replace(/[^0-9]/g, '')))).join(',');
    if (!uniqueNumbers) return alert('발송할 대상이 없습니다.');
    window.location.href = `sms:${uniqueNumbers}?body=${encodeURIComponent(smsTemplate)}`;
  };

  // 전체 삭제
  const clearAll = async () => {
    if (window.confirm('모든 응모 내역을 삭제하시겠습니까?')) {
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

  const styles = {
    container: {
      background: '#050505',
      height: '100vh',
      padding: '40px',
      color: '#fff',
      fontFamily: "'Outfit', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      gap: '30px',
      overflow: 'hidden'
    },
    summaryRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px',
      flexShrink: 0
    },
    summaryCard: {
      background: '#111',
      borderRadius: '16px',
      padding: '12px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
      border: '1px solid rgba(255,255,255,0.03)'
    },
    label: {
      margin: 0,
      fontSize: '13px',
      color: '#ff8e53', // 따뜻한 오렌지/코랄 톤으로 변경
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    iconBox: (gradient) => ({
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      background: gradient,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.25)'
    }),
    mainLayout: {
      display: 'flex',
      gap: '30px',
      alignItems: 'flex-start',
      flex: 1,
      overflow: 'hidden'
    },
    listSection: {
      flex: 1,
      height: '100%',
      background: '#0f0f0f',
      borderRadius: '40px',
      padding: '40px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
      border: '1px solid rgba(255,255,255,0.02)',
      overflowY: 'auto'
    },
    sidebar: {
      width: '400px',
      height: '100%',
      background: '#0f0f0f',
      borderRadius: '40px',
      padding: '40px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
      border: '1px solid rgba(255,255,255,0.02)',
      flexShrink: 0
    },
    headerRow: {
      display: 'grid', 
      gridTemplateColumns: '1.2fr 1fr 1fr 1.5fr', 
      padding: '0 24px 15px 24px', 
      fontSize: '13px', 
      color: '#ff8e53', // 헤더도 동일한 오렌지 톤 적용
      fontWeight: '900', 
      textTransform: 'uppercase',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      marginBottom: '10px',
      letterSpacing: '0.1em'
    },
    input: {
      background: '#000',
      border: '1px solid #222',
      borderRadius: '16px',
      padding: '12px 16px',
      color: '#fff',
      fontSize: '14px',
      outline: 'none'
    }
  };

  if (loading && entries.length === 0) return <div style={{ color: '#fff', padding: '100px', textAlign: 'center' }}>데이터 로딩 중...</div>;

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
    <div style={styles.container}>
      
      {/* 1. 요약 카드 행 (컬러 테마 반영) */}
      <div style={styles.summaryRow}>
        <div style={styles.summaryCard}>
          <div style={styles.iconBox('linear-gradient(135deg, #fbbf24, #d97706)')}>👥</div>
          <div>
            <p style={styles.label}>총 응모자</p>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#fff' }}>
              {stats.total.toLocaleString()} <span style={{ fontSize: '11px', color: '#ff8e53', fontWeight: '400' }}>명</span>
            </h2>
          </div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.iconBox('linear-gradient(135deg, #34d399, #059669)')}>🔥</div>
          <div>
            <p style={styles.label}>오늘의 응모</p>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#fff' }}>
              {stats.todayEntries > 0 ? `+${stats.todayEntries}` : stats.todayEntries} <span style={{ fontSize: '11px', color: '#ff8e53', fontWeight: '400' }}>명</span>
            </h2>
          </div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.iconBox('linear-gradient(135deg, #a78bfa, #4f46e5)')}>🏆</div>
          <div>
            <p style={styles.label}>당첨 처리 현황</p>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#fff' }}>
              {stats.winners} <span style={{ fontSize: '11px', color: '#ff8e53', fontWeight: '400' }}>명</span>
            </h2>
          </div>
        </div>
      </div>

      {/* 2. 하단 메인 레이아웃 */}
      <div style={styles.mainLayout}>
        
        <div style={styles.listSection}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h3 style={{ fontSize: '26px', fontWeight: '900', margin: 0, color: '#fff', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '15px', filter: 'sepia(1) saturate(5) hue-rotate(-30deg)' }}>📋</span> 이벤트 응모 리스트
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* 필터 토글 버튼 */}
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                style={{
                  background: isFilterOpen ? '#ff8e53' : 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  width: '46px',
                  height: '46px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  color: isFilterOpen ? '#000' : '#888'
                }}
              >
                📅
              </button>
              
              <input 
                type="text" 
                placeholder="이름, 연락처 검색" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ ...styles.input, width: '220px', height: '46px' }}
              />
            </div>
          </div>

          {/* 확장 필터 영역 */}
          {isFilterOpen && (
            <div style={{ 
              background: 'rgba(255,255,255,0.03)', 
              borderRadius: '24px', 
              padding: '24px', 
              marginBottom: '30px',
              border: '1px solid rgba(255,255,255,0.05)',
              animation: 'fadeIn 0.3s ease-out',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '12px', fontWeight: '900', color: '#ff8e53', textTransform: 'uppercase', width: '60px' }}>간편 설정</span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap' }}>
                  {[
                    { label: '최근 1개월', val: 30 },
                    { label: '최근 2개월', val: 60 },
                    { label: '최근 3개월', val: 90 },
                    { label: '최근 4개월', val: 120 }
                  ].map(p => (
                    <button 
                      key={p.label}
                      onClick={() => setPresetRange(p.val)}
                      style={{
                        padding: '8px 16px', borderRadius: '12px', border: '1px solid #222',
                        background: '#000', color: '#666', fontSize: '12px', fontWeight: '700', cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '12px', fontWeight: '900', color: '#ff8e53', textTransform: 'uppercase', width: '60px' }}>직접 선택</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input 
                    type="date" 
                    value={dateRange.start}
                    onClick={(e) => e.target.showPicker?.()}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    style={{ ...styles.input, padding: '8px 12px' }} 
                  />
                  <span style={{ color: '#444' }}>~</span>
                  <input 
                    type="date" 
                    value={dateRange.end}
                    onClick={(e) => e.target.showPicker?.()}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    style={{ ...styles.input, padding: '8px 12px' }} 
                  />
                  {(dateRange.start || dateRange.end) && (
                    <button 
                      onClick={() => setDateRange({ start: '', end: '' })}
                      style={{ background: 'none', border: 'none', color: '#ff4b2b', fontSize: '11px', fontWeight: '800', cursor: 'pointer', marginLeft: '10px' }}
                    >
                      초기화
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={styles.headerRow}>
              <span>응모 시각</span>
              <span>고객명</span>
              <span>연락처</span>
              <span>당첨 결과</span>
            </div>

            {filteredEntries.map((entry) => (
              <div key={entry.id} style={{ 
                display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1.5fr', 
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.03)', 
                borderRadius: '24px', padding: '20px 24px', alignItems: 'center',
                animation: 'fadeIn 0.5s ease-out'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '11px', color: '#ff8e53', fontWeight: '700', letterSpacing: '0.05em', opacity: 0.8 }}>
                    {entry.date?.split(' ').slice(0, 3).join(' ')}
                  </span>
                  <span style={{ fontSize: '15px', fontWeight: '900', color: '#fff', letterSpacing: '0.02em' }}>
                    {entry.date?.split(' ').slice(-1)}
                  </span>
                </div>
                <span style={{ fontWeight: '900', fontSize: '16px', color: '#fff' }}>{entry.name}</span>
                <span style={{ color: '#888', fontFamily: 'monospace' }}>{entry.phone}</span>
                <Badge prize={entry.prize} status={getPrizeStatus(entry.prize)} />
              </div>
            ))}

            {filteredEntries.length === 0 && (
              <div style={{ textAlign: 'center', padding: '50px', color: '#444' }}>검색 결과가 없습니다.</div>
            )}
          </div>
        </div>

        <div style={styles.sidebar}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '900', margin: 0 }}>
              <span style={{ marginRight: '10px' }}>💬</span> 메시지 템플릿
            </h3>
            <span style={{ fontSize: '10px', background: 'rgba(197,160,89,0.1)', color: '#c5a059', padding: '4px 10px', borderRadius: '50px', fontWeight: '900' }}>LIVE</span>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '11px', color: '#444', fontWeight: '800', marginBottom: '10px', textTransform: 'uppercase' }}>보낼 메시지 내용</p>
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

          <button 
            onClick={handleSendSMS}
            className="premium-gold-button" 
            style={{ width: '100%', height: '64px', borderRadius: '20px', fontSize: '16px' }}
          >
            🚀 이벤트 응모 고객에게 문자 발송
          </button>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}} />
    </div>
  );
};

// 당첨 상태 판별 유틸
const getPrizeStatus = (prize) => {
  if (prize.includes('1등')) return 'winner1';
  if (prize.includes('2등')) return 'winner2';
  if (prize.includes('3등')) return 'winner3';
  if (prize.includes('4등') || prize.includes('5등')) return 'winner5';
  if (prize.includes('다음 기회에') || prize.includes('꽝')) return 'loss';
  // 그 외 모든 경품(콜라, 사이다 등)은 기본 'winner_default'로 처리
  return 'winner_default';
};

const Badge = ({ prize, status }) => {
  const getStyle = () => {
    switch (status) {
      case 'winner1': return { background: 'linear-gradient(135deg, #fcd34d, #d97706)', color: '#000', fontWeight: '900', boxShadow: '0 4px 15px rgba(217, 119, 6, 0.3)' };
      case 'winner2': return { background: 'linear-gradient(135deg, #e5e7eb, #9ca3af)', color: '#000', fontWeight: '900' };
      case 'winner3': return { background: 'linear-gradient(135deg, #fb923c, #dc2626)', color: '#fff', fontWeight: '800' };
      case 'winner5': return { background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.2)' };
      case 'winner_default': return { background: 'rgba(197, 160, 89, 0.15)', color: '#c5a059', border: '1px solid rgba(197, 160, 89, 0.3)', fontWeight: '700' };
      case 'loss': return { background: 'rgba(255,255,255,0.05)', color: '#444' };
      default: return { background: 'rgba(255,255,255,0.05)', color: '#888' };
    }
  };

  const getIcon = () => {
    // 문자열에 이미 이모지가 포함되어 있는지 확인 (간단한 체크)
    const hasEmoji = /[\uD800-\uDBFF][\uDC00-\uDFFF]/.test(prize);
    if (hasEmoji) return '';

    switch (status) {
      case 'winner1': return '🥇 ';
      case 'winner2': return '🥈 ';
      case 'winner3': return '🥉 ';
      case 'winner5': return '🎁 ';
      case 'winner_default': return '✨ ';
      case 'loss': return '🍀 ';
      default: return '';
    }
  };

  return (
    <div style={{ 
      padding: '10px 20px', borderRadius: '14px', fontSize: '12px', 
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...getStyle() 
    }}>
      {getIcon()}{prize}
    </div>
  );
};

export default AdminDashboardV4;
