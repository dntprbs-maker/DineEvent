import React, { useState, useMemo, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, query, orderBy, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

const MobileAdminMessages = ({ 
  entries, uniqueData, smsTemplate, setSmsTemplate, clearAll 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSmsEditor, setShowSmsEditor] = useState(false);
  const [showEmptyAlert, setShowEmptyAlert] = useState(false);

  // 문자 템플릿 관리용 상태 추가
  const [templates, setTemplates] = useState([]);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [deleteTemplateId, setDeleteTemplateId] = useState(null);

  useEffect(() => {
    if (showSmsEditor) {
      fetchTemplates();
    }
  }, [showSmsEditor]);

  const fetchTemplates = async () => {
    setTemplateLoading(true);
    try {
      const q = query(collection(db, 'smsTemplates'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setTemplates(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('Template fetch error:', err);
    } finally {
      setTemplateLoading(false);
    }
  };

  const loadTemplate = (templateContent) => {
    setSmsTemplate(templateContent);
    setShowTemplates(false);
  };

  const saveTemplate = async () => {
    if (!smsTemplate.trim()) {
      alert('저장할 문자 내용을 먼저 입력해주세요.');
      return;
    }
    setSavingTemplate(true);
    try {
      await addDoc(collection(db, 'smsTemplates'), {
        content: smsTemplate.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      await fetchTemplates();
      setShowTemplates(true); // 저장 후 목록 열기
      alert('템플릿으로 저장되었습니다!');
    } catch (err) {
      console.error('Template save error:', err);
      alert('템플릿 저장 실패: ' + err.message);
    } finally {
      setSavingTemplate(false);
    }
  };

  const confirmDeleteTemplate = async () => {
    if (!deleteTemplateId) return;
    try {
      await deleteDoc(doc(db, 'smsTemplates', deleteTemplateId));
      setDeleteTemplateId(null);
      await fetchTemplates();
      alert('템플릿이 삭제되었습니다.');
    } catch (err) {
      console.error('Template delete error:', err);
      alert('삭제 실패: ' + err.message);
      setDeleteTemplateId(null);
    }
  };

  // 기간 프리셋 설정
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

  // 실시간 검색 및 기간 필터링
  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      // 1. 검색어 필터
      const lowerSearch = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || e.name.toLowerCase().includes(lowerSearch) || 
                            e.phone.includes(searchTerm) || e.prize.toLowerCase().includes(lowerSearch);
      
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

  // 실제 문자 발송 대상자 (필터링된 결과 내에서 중복 번호 제거)
  const targetNumbers = useMemo(() => {
    const uniquePhones = new Set();
    filteredEntries.forEach(e => {
      const cleaned = e.phone.replace(/[^0-9]/g, '');
      if (cleaned) uniquePhones.add(cleaned);
    });
    return Array.from(uniquePhones);
  }, [filteredEntries]);

  return (
    <div className="mobile-admin-container" style={{ padding: '0 0.8rem 180px 0.8rem', animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* ── 템플릿 삭제 확인 다이얼로그 ── */}
      {deleteTemplateId && (
        <div
          onClick={() => setDeleteTemplateId(null)}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
            zIndex: 9999999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#141414', borderRadius: '20px',
              border: '1px solid rgba(255, 77, 77, 0.4)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
              padding: '2rem', textAlign: 'center',
              width: '100%', maxWidth: '300px',
              animation: 'popupFadeIn 0.2s ease-out'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>🗑️</div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: '900', marginBottom: '0.4rem' }}>
              템플릿 삭제
            </h4>
            <p style={{ color: '#aaa', fontSize: '0.82rem', marginBottom: '1.2rem', lineHeight: 1.5 }}>
              이 템플릿을 삭제하시겠습니까?
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setDeleteTemplateId(null)}
                style={{ flex: 1, padding: '0.7rem', borderRadius: '10px', background: '#222', border: '1px solid #333', color: '#aaa', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                취소
              </button>
              <button
                onClick={confirmDeleteTemplate}
                style={{ flex: 1, padding: '0.7rem', borderRadius: '10px', background: 'linear-gradient(135deg, #ff4d4d, #cc0000)', border: '1px solid #ff6b6b', color: '#fff', fontWeight: '900', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                삭제
              </button>
            </div>
          </div>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes popupFadeIn {
              from { opacity: 0; transform: scale(0.92) translateY(10px); }
              to   { opacity: 1; transform: scale(1)    translateY(0); }
            }
          `}} />
        </div>
      )}

      {/* 문자 템플릿 편집기 - 화면 중앙 팝업 모달 */}
      {showSmsEditor && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
          zIndex: 1000000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '2rem'
        }}>
          <div style={{ 
            background: '#111', border: '1px solid var(--primary)',
            borderRadius: '24px', padding: '2rem 1.5rem',
            width: '100%', maxWidth: '420px',
            boxShadow: '0 30px 80px rgba(0,0,0,0.8)'
          }}>
            {/* 모달 헤더 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <label style={{ fontSize: '1rem', color: 'var(--primary)', fontWeight: '800' }}>
                💬 이벤트 문자 템플릿
              </label>
              {/* 닫기 버튼 */}
              <button 
                onClick={() => setShowSmsEditor(false)}
                style={{ background: 'none', border: 'none', color: '#666', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}
              >×</button>
            </div>
            {/* 문자 내용 입력 */}
            <textarea 
              value={smsTemplate} 
              onChange={(e) => setSmsTemplate(e.target.value)} 
              placeholder="전송할 문자 내용을 입력하세요..."
              style={{ 
                width: '100%', height: '120px', background: '#000',
                border: '1px solid #333', borderRadius: '12px',
                padding: '1rem', color: '#fff', fontSize: '0.9rem',
                outline: 'none', resize: 'none'
              }}
            />

            {/* 템플릿 버튼 행 */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', width: '100%' }}>
              {/* 현재 내용을 템플릿으로 저장 */}
              <button
                onClick={saveTemplate}
                disabled={savingTemplate}
                style={{
                  flex: 1, padding: '0.4rem 0.6rem',
                  background: 'rgba(197, 160, 89, 0.12)', border: '1px solid rgba(197, 160, 89, 0.4)',
                  color: 'var(--primary)', borderRadius: '8px', fontSize: '0.78rem',
                  fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                }}
              >
                {savingTemplate ? (
                  <span>⏳ 저장 중...</span>
                ) : (
                  <><span>📌</span><span>템플릿 저장</span></>
                )}
              </button>
              {/* 저장된 템플릿 불러오기 토글 */}
              <button
                onClick={() => setShowTemplates(v => !v)}
                style={{
                  flex: 1, padding: '0.4rem 0.6rem',
                  background: showTemplates ? 'rgba(197, 160, 89, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(197, 160, 89, 0.4)',
                  color: '#fff', borderRadius: '8px', fontSize: '0.78rem',
                  fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                }}
              >
                <span>📂</span><span>{showTemplates ? '목록 닫기' : '템플릿 목록'}</span>
              </button>
            </div>

            {/* 템플릿 목록 패널 */}
            {showTemplates && (
              <div style={{
                marginTop: '8px', border: '1px solid rgba(197, 160, 89, 0.25)',
                borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)',
                padding: '10px', maxHeight: '220px', overflowY: 'auto'
              }}>
                <p style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: '800', marginBottom: '8px', textAlign: 'left' }}>📋 저장된 템플릿 — 클릭하면 내용이 채워집니다</p>
                {templateLoading ? (
                  <p style={{ color: '#666', fontSize: '0.75rem', textAlign: 'center' }}>불러오는 중...</p>
                ) : templates.length === 0 ? (
                  <p style={{ color: '#555', fontSize: '0.75rem', textAlign: 'center', padding: '1rem 0' }}>저장된 템플릿이 없습니다.<br/>위의 '📌 템플릿 저장' 버튼으로 추가하세요.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {templates.map(t => (
                      <div
                        key={t.id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          background: 'rgba(255,255,255,0.04)', borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.07)', padding: '8px 10px',
                        }}
                      >
                        {/* 내용 클릭 → 불러오기 */}
                        <p
                          onClick={() => loadTemplate(t.content)}
                          style={{
                            flex: 1, color: '#ddd', fontSize: '0.8rem',
                            lineHeight: 1.4, cursor: 'pointer', margin: 0,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-all',
                            textAlign: 'left'
                          }}
                          title="클릭하면 문자내용에 불러옵니다"
                        >
                          {t.content}
                        </p>
                        {/* 템플릿 삭제 버튼 */}
                        <button
                          onClick={() => setDeleteTemplateId(t.id)}
                          style={{
                            flexShrink: 0, background: 'rgba(255,77,77,0.15)',
                            border: '1px solid rgba(255,77,77,0.3)', color: '#ff6b6b',
                            borderRadius: '6px', padding: '3px 8px',
                            fontSize: '0.7rem', cursor: 'pointer', fontWeight: '700'
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <p style={{ color: '#555', fontSize: '0.75rem', marginTop: '0.6rem' }}>
              ※ 현재 필터링된 {targetNumbers.length}명의 고객에게 발송됩니다.
            </p>
            {/* 확인 버튼 */}
            <button
              onClick={() => setShowSmsEditor(false)}
              className="premium-gold-button"
              style={{ width: '50%', marginTop: '1rem', padding: '0.8rem', display: 'block', margin: '1rem auto 0' }}
            >
              적용
            </button>
          </div>
        </div>
      )}

      {/* 스마트 검색창 + 기간 필터 토글 (entry-search-wrapper 내부에 통합) */}
      <div className="entry-search-wrapper">
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          style={{
            background: isFilterOpen ? '#ff8e53' : 'transparent',
            border: 'none',
            borderRadius: '8px', padding: '4px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.3s', color: isFilterOpen ? '#000' : '#888',
            flexShrink: 0, fontSize: '1.2rem'
          }}
        >
          📅
        </button>
        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
        <span style={{ fontSize: '1.1rem', opacity: 0.5 }}>🔍</span>
        <input 
          type="text" 
          placeholder="이름, 연락처 검색" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', outline: 'none' }}
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', color: '#fff', opacity: 0.5, fontSize: '1.2rem' }}>×</button>
        )}
      </div>

      {/* 확장 기간 필터 UI (검색창 바로 아래 고정) */}
      {isFilterOpen && (
        <div style={{ 
          position: 'fixed', top: '195px', left: '0.8rem', right: '0.8rem', zIndex: 499,
          background: '#111', borderRadius: '20px', padding: '15px', 
          border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.9)',
          display: 'flex', flexDirection: 'column', gap: '12px',
          animation: 'fadeInDown 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '5px' }}>
            {[{l:'1개월', v:30}, {l:'2개월', v:60}, {l:'3개월', v:90}, {l:'4개월', v:120}].map(p => (
              <button key={p.l} onClick={() => setPresetRange(p.v)} style={{ padding: '6px 12px', borderRadius: '10px', background: '#000', color: '#666', border: '1px solid #222', fontSize: '11px', whiteSpace: 'nowrap' }}>{p.l}</button>
            ))}
            <button onClick={() => setPresetRange('all')} style={{ padding: '6px 12px', borderRadius: '10px', background: '#000', color: '#666', border: '1px solid #222', fontSize: '11px' }}>전체</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="date" value={dateRange.start} onClick={(e) => e.target.showPicker?.()} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} style={{ flex: 1, background: '#000', border: '1px solid #222', borderRadius: '10px', padding: '8px', color: '#fff', fontSize: '12px' }} />
            <span style={{ color: '#333' }}>~</span>
            <input type="date" value={dateRange.end} onClick={(e) => e.target.showPicker?.()} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} style={{ flex: 1, background: '#000', border: '1px solid #222', borderRadius: '10px', padding: '8px', color: '#fff', fontSize: '12px' }} />
          </div>
        </div>
      )}

      {/* 응모 내역 슬림 리스트 - 검색창 영역 확보를 위해 동적 여백 적용 */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '8px',
        marginTop: isFilterOpen ? '170px' : '75px',
        transition: 'margin-top 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {filteredEntries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: '#333', fontStyle: 'italic' }}>
            {searchTerm ? '검색 결과가 없습니다.' : '내역이 존재하지 않습니다.'}
          </div>
        ) : (
          filteredEntries.map((entry) => {
            const isWinner = !entry.prize.includes('꽝');
            return (
              <div key={entry.id} className={`premium-entry-item ${isWinner ? 'winner' : ''}`} style={{ padding: '0.6rem 1.5rem' }}>
                {/* 1행: 응모시간 */}
                <div style={{ color: '#888', fontSize: '0.75rem', marginBottom: '1px', lineHeight: '1.2' }}>
                  {entry.date}
                </div>
                {/* 2행: 성함 (전화번호) */}
                <div style={{ marginBottom: '2px', lineHeight: '1.3' }}>
                  <span style={{ color: '#fff', fontWeight: '800', fontSize: '1.05rem' }}>{entry.name}</span>
                  <span style={{ color: '#888', fontWeight: '400', fontSize: '0.85rem', marginLeft: '6px' }}>({entry.phone})</span>
                </div>
                {/* 3행: 당첨 경품 */}
                <div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '0.95rem', lineHeight: '1.2' }}>
                  {isWinner ? '✨ ' : ''}{entry.prize}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 1000000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ background: '#111', border: '1px solid var(--primary)', borderRadius: '30px', padding: '2.5rem 1.5rem', width: '100%', textAlign: 'center', boxShadow: '0 30px 100px rgba(0,0,0,0.8)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontWeight: '900' }}>응모 내역 삭제</h3>
            <p style={{ color: '#888', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
              정말 모든 응모 내역을 삭제하시겠습니까?<br/>
              <span style={{ color: '#ff4d4d' }}>삭제된 데이터는 복구할 수 없습니다.</span>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                onClick={() => { clearAll(); setShowDeleteConfirm(false); }}
                className="premium-gold-button"
                style={{ background: '#ff4d4d', border: 'none', color: '#fff', padding: '1.2rem', borderRadius: '15px' }}
              >
                🔥 전체 삭제 실행
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                style={{ background: 'transparent', color: '#666', border: 'none', padding: '1rem' }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 0명 발송 방지 경고 모달 (Native Alert 대체) */}
      {showEmptyAlert && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 1000000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ background: '#111', border: '1px solid #ff4d4d', borderRadius: '30px', padding: '2.5rem 1.5rem', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 30px 100px rgba(255, 77, 77, 0.2)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <h3 style={{ color: '#ff4d4d', marginBottom: '1rem', fontWeight: '900' }}>발송 대상자 없음</h3>
            <p style={{ color: '#888', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
              선택하신 필터 조건에 해당하는 고객이 없습니다.<br/>
              기간이나 검색어를 다시 확인해주세요.
            </p>
            <button 
              onClick={() => setShowEmptyAlert(false)}
              className="premium-gold-button"
              style={{ background: '#ff4d4d', border: 'none', color: '#fff', padding: '1rem', borderRadius: '15px', width: '100%' }}
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* 하단 플로팅 듀얼 버튼 */}
      <div className="floating-btn-container" style={{ padding: '0 1.5rem 30px 1.5rem' }}>
        <div className="dual-floating-group">
          <button 
            className="premium-gold-button"
            onClick={() => setShowSmsEditor(!showSmsEditor)}
          >
            📝 문자내용수정
          </button>
          <button 
            className="premium-gold-button"
            onClick={() => {
              if (targetNumbers.length === 0) {
                setShowEmptyAlert(true);
                return;
              }
              const numbersString = targetNumbers.join(',');
              window.location.href = `sms:${numbersString}?body=${encodeURIComponent(smsTemplate)}`;
            }}
          >
            💬 문자 발송하기
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
};

export default MobileAdminMessages;
