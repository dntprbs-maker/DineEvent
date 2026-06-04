import React, { useState, useEffect } from 'react';
import { useNavigate, useBlocker } from 'react-router-dom';
import { useIsMobile } from '../../hooks/useIsMobile';
import MobileAdminEvent from '../../components/admin/MobileAdminEvent';
import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useTenant } from '../../context/TenantContext';

const AdminEvent = () => {
  const { getDocRef } = useTenant();
  const [prizes, setPrizes] = useState([]);
  const [originalPrizes, setOriginalPrizes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleNewEventSetup = () => {
    // 6개의 고품질 목업 데이터로 초기화 (주인님 요청)
    const mockPrizes = [
      { name: '🥇 1등: 다이슨 에어랩 멀티 스타일러', totalCount: 1, currentCount: 1 },
      { name: '🥈 2등: 신세계 상품권 10만원권', totalCount: 5, currentCount: 5 },
      { name: '🥉 3등: 스타벅스 3만원권', totalCount: 10, currentCount: 10 },
      { name: '🍗 4등: BHC 후라이드+콜라 세트', totalCount: 20, currentCount: 20 },
      { name: '🍦 5등: 배스킨라빈스 파인트', totalCount: 50, currentCount: 50 },
      { name: '🍀 6등: 다음 기회에 (꽝)', totalCount: 1000, currentCount: 1000 },
    ];
    setPrizes(mockPrizes);
  };

  const defaultPrizes = [
    { name: '🥇 1등: 다이슨 에어랩 멀티 스타일러', totalCount: 1, currentCount: 1 },
    { name: '🥈 2등: 신세계 상품권 10만원권', totalCount: 5, currentCount: 5 },
    { name: '🥉 3등: 스타벅스 3만원권', totalCount: 10, currentCount: 10 },
    { name: '🍗 4등: BHC 후라이드+콜라 세트', totalCount: 20, currentCount: 20 },
    { name: '🍦 5등: 배스킨라빈스 파인트', totalCount: 50, currentCount: 50 },
    { name: '🍀 6등: 다음 기회에 (꽝)', totalCount: 1000, currentCount: 1000 }
  ];

  useEffect(() => {
    const fetchPrizes = async () => {
      try {
        const docRef = getDocRef('content', 'prizes');
        const docSnap = await getDoc(docRef);
        let data = defaultPrizes;
        if (docSnap.exists() && docSnap.data().list && docSnap.data().list.length > 0) {
          data = docSnap.data().list;
        }
        setPrizes(data);
        setOriginalPrizes(JSON.stringify(data));
      } catch (err) {
        console.error(err);
        setPrizes(defaultPrizes);
        setOriginalPrizes(JSON.stringify(defaultPrizes));
      } finally {
        setLoading(false);
      }
    };
    fetchPrizes();
  }, []);

  const isDirty = originalPrizes !== JSON.stringify(prizes);

  // [NEW] 페이지 이동 차단 (React Router Blocker)
  const blocker = useBlocker(({ nextLocation }) => isDirty && !saving);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleChange = (index, field, value) => {
    const newList = [...prizes];
    
    // 수량 필드인 경우 숫자 외 문자 제거 및 처리
    if (field === 'totalCount' || field === 'currentCount') {
      const cleanValue = value.replace(/[^0-9]/g, '');
      const numValue = parseInt(cleanValue) || 0;
      newList[index] = { ...newList[index], [field]: numValue };
      
      if (field === 'totalCount') {
        newList[index].currentCount = numValue;
      }
    } else {
      newList[index] = { ...newList[index], [field]: value };
    }
    
    setPrizes(newList);
  };

  const handleSave = async (silent = false) => {
    if (saving) return;
    setSaving(true);
    try {
      await setDoc(getDocRef('content', 'prizes'), { list: prizes });
      setOriginalPrizes(JSON.stringify(prizes));
      if (!silent) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      }
      return true;
    } catch (err) {
      alert('저장 실패: ' + err.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // [NEW] 저장 후 이동 로직
  const handleSaveAndProceed = async () => {
    const success = await handleSave(true);
    if (success && blocker.proceed) blocker.proceed();
  };

  // [NEW] 셋업 화면(로컬 상태)에서 작성된 새로운 데이터를 덮어쓰고 저장
  const handleStartNewEvent = async (newList) => {
    setSaving(true);
    try {
      await setDoc(getDocRef('content', 'prizes'), { list: newList });
      setPrizes(newList);
      setOriginalPrizes(JSON.stringify(newList));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      return true;
    } catch (err) {
      alert('저장 실패: ' + err.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmReset = async () => {
    const resetList = prizes.map(p => ({
      ...p,
      currentCount: parseInt(p.totalCount) || 0
    }));
    setSaving(true);
    setShowResetConfirm(false);
    try {
      await setDoc(getDocRef('content', 'prizes'), { list: resetList });
      setPrizes(resetList);
      setOriginalPrizes(JSON.stringify(resetList));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      alert('초기화 실패: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const isMobile = useIsMobile(768);

  if (loading) return <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>데이터 로딩 중...</div>;

  if (isMobile) {
    return (
      <div className="admin-content-inner">
        <MobileAdminEvent 
          prizes={prizes}
          handleChange={handleChange}
          handleSave={handleSave}
          handleConfirmReset={handleConfirmReset}
          handleNewEventSetup={handleNewEventSetup}
          handleStartNewEvent={handleStartNewEvent}
          saving={saving}
          showResetConfirm={showResetConfirm}
          setShowResetConfirm={setShowResetConfirm}
        />
        {/* 이동 차단 모달 */}
        {blocker.state === "blocked" && (
          <div style={{ 
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', 
            zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div className="glass" style={{ padding: '2rem', borderRadius: '30px', border: '1px solid var(--primary)', background: '#111', width: '90%', textAlign: 'center' }}>
              <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>저장되지 않았습니다</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button onClick={handleSaveAndProceed} style={{ background: 'var(--primary)', padding: '1rem', borderRadius: '10px', fontWeight: 'bold' }}>저장 후 이동</button>
                <button onClick={() => blocker.proceed?.()} style={{ background: 'transparent', color: '#ff4d4d', border: '1px solid #331111', padding: '1rem', borderRadius: '10px' }}>저장 안함</button>
                <button onClick={() => blocker.reset?.()} style={{ color: '#888', border: 'none', background: 'none' }}>취소</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="admin-content-inner" style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '120px' }}>
      
      {/* [NEW] 중앙 집중식 이동 차단 모달 UI */}
      {blocker.state === "blocked" && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', 
          zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div className="glass" style={{ 
            padding: '3rem', borderRadius: '40px', border: '1px solid var(--primary)', 
            background: '#111', width: 'min(90%, 500px)', textAlign: 'center',
            boxShadow: '0 30px 100px rgba(0,0,0,1)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>⚠️</div>
            <h2 style={{ color: 'var(--primary)', marginBottom: '1rem', fontWeight: '900' }}>저장되지 않았습니다</h2>
            <p style={{ color: '#aaa', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
              이벤트 경품 수정 내용이 아직 저장되지 않았습니다.<br/>
              이대로 페이지를 벗어나시겠습니까?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <button onClick={handleSaveAndProceed} className="premium-gold-button" style={{ padding: '1.2rem', borderRadius: '15px', fontSize: '1.1rem' }}>
                💾 변경사항 저장 후 이동
              </button>
              <button onClick={() => blocker.proceed?.()} style={{ background: 'transparent', color: '#ff4d4d', border: '1px solid #331111', padding: '1rem', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
                🗑️ 저장 안함 (취소)
              </button>
              <button onClick={() => blocker.reset?.()} style={{ background: 'transparent', color: '#666', border: 'none', padding: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                닫기 (계속 수정하기)
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="glass admin-card-glass">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '15px' }}>
          <h3 style={{ color: 'var(--primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>⚙️ 이벤트 경품 관리</h3>
        </div>

        <div className="prize-grid" style={{ padding: '0 10px 10px', borderBottom: '1px solid #333', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', textAlign: 'center' }}>
          <div>순서</div>
          <div>경품 이름</div>
          <div>설정갯수</div>
          <div>남은갯수</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {prizes.map((prize, index) => (
            <div key={index} className="prize-grid" style={{ alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '8px 10px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '1.1rem', textAlign: 'center', fontFamily: 'serif' }}>#{index + 1}</div>
              <input type="text" value={prize.name} onChange={(e) => handleChange(index, 'name', e.target.value)} placeholder="경품 명칭 입력" style={{ background: '#000', border: '1px solid #333', color: '#fff', padding: '10px 12px', borderRadius: '10px', fontSize: '0.95rem', outline: 'none' }} />
              <input type="text" inputMode="numeric" value={prize.totalCount?.toLocaleString()} onChange={(e) => handleChange(index, 'totalCount', e.target.value)} style={{ background: '#000', border: '1px solid #333', color: 'var(--primary)', padding: '10px', borderRadius: '10px', fontSize: '1rem', fontWeight: '700', textAlign: 'center', outline: 'none' }} />
              <input type="text" inputMode="numeric" value={prize.currentCount?.toLocaleString()} onChange={(e) => handleChange(index, 'currentCount', e.target.value)} style={{ background: '#000', border: '1px solid #333', color: 'var(--accent)', padding: '10px', borderRadius: '10px', fontSize: '1rem', fontWeight: '700', textAlign: 'center', outline: 'none' }} />
            </div>
          ))}
        </div>
      </div>

      <div className="floating-btn-container">
        
        {/* 확인 팝오버 */}
        {showResetConfirm && (
          <div style={{ pointerEvents: 'auto', background: 'rgba(20,20,20,0.95)', border: '1px solid var(--primary)', padding: '15px 20px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.8)', animation: 'fadeInUp 0.2s ease-out', marginBottom: '10px' }}>
            <p style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '10px', textAlign: 'center', fontWeight: 'bold' }}>정말 이벤트를 초기화하시겠습니까?</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleConfirmReset} className="premium-gold-button" style={{ flex: 1, padding: '8px', borderRadius: '8px' }}>확인</button>
              <button onClick={() => setShowResetConfirm(false)} style={{ flex: 1, background: 'transparent', color: '#888', border: '1px solid #444', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>취소</button>
            </div>
          </div>
        )}

        {/* 분리된 독립 버튼 그룹 */}
        <div style={{ display: 'flex', gap: '15px', pointerEvents: 'auto' }}>
          <button 
            onClick={() => handleNewEventSetup()} 
            disabled={saving} 
            className="premium-gold-button"
            style={{ padding: '1.2rem 2.5rem', borderRadius: '50px', fontSize: '1rem' }}
          >
            ✨ 새 이벤트 만들기
          </button>
          
          <button 
            onClick={() => handleSave()} 
            disabled={saving} 
            className="premium-gold-button"
            style={{ padding: '1.2rem 4rem', borderRadius: '50px', fontSize: '1.1rem' }}
          >
            {saving ? '⏳ 저장중...' : '💾 변경내용저장'}
          </button>
        </div>
      </div>

      {showToast && (
        <div style={{ position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0, 0, 0, 0.9)', color: 'var(--primary)', padding: '1rem 2rem', borderRadius: '15px', border: '1px solid var(--primary)', zIndex: 10001, animation: 'fadeInUp 0.3s ease-out', fontWeight: 'bold' }}>✅ 수정사항이 저장되었습니다.</div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .prize-grid { display: grid; grid-template-columns: 50px 1fr 100px 100px; gap: 15px; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }
        @media (max-width: 600px) {
          .prize-grid { grid-template-columns: 35px 1fr 70px 70px; gap: 8px; }
        }
      `}} />
    </div>
  );
};

export default AdminEvent;
