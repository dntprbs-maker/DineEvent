import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const RouletteGame = () => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [prizes, setPrizes] = useState([]); // 현재 렌더링 중인 경품 목록
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', agreed: false });
  
  const currentRotationRef = useRef(0);
  const isLockedRef = useRef(false); // 중복 클릭 방지용 락

  useEffect(() => {
    fetchInitialPrizes();
  }, []);

  const fetchInitialPrizes = async () => {
    try {
      const prizeDoc = await getDoc(doc(db, 'content', 'prizes'));
      if (prizeDoc.exists()) {
        const data = prizeDoc.data().prizes || [];
        setPrizes(data);
      }
    } catch (err) {
      console.error("Initial prize fetch error:", err);
    }
  };

  const spin = async (validatedPhone) => {
    if (isLockedRef.current || prizes.length === 0) return;
    isLockedRef.current = true;
    setIsSpinning(true);
    
    // 1. [핵심] 스핀 직전에 DB에서 최신 데이터를 가져오고, 로컬 상태와 '즉시' 동기화
    const snap = await getDoc(doc(db, 'content', 'prizes'));
    const livePrizes = snap.exists() ? snap.data().prizes : [...prizes];
    
    // 렌더링에 사용되는 prizes 상태를 최신화하여 화면상의 레이블과 당첨 계산 대상이 100% 일치하도록 보장
    setPrizes(livePrizes);

    const availablePrizes = livePrizes.filter(p => p.currentCount > 0);
    if (availablePrizes.length === 0) {
      alert('모든 경품이 소진되었습니다.');
      isLockedRef.current = false;
      setIsSpinning(false);
      return;
    }

    // 2. 당첨자 결정 (가중치 기반 랜덤)
    const totalWeight = livePrizes.reduce((sum, p) => sum + (p.currentCount > 0 ? Number(p.totalCount) : 0), 0);
    let random = Math.random() * totalWeight;
    let winnerIndex = -1;
    
    for (let i = 0; i < livePrizes.length; i++) {
      if (livePrizes[i].currentCount <= 0) continue;
      const weight = Number(livePrizes[i].totalCount);
      if (random < weight) {
        winnerIndex = i;
        break;
      }
      random -= weight;
    }

    if (winnerIndex === -1) {
      isLockedRef.current = false;
      setIsSpinning(false);
      return;
    }

    // 3. [초정밀 물리 엔진 v2.5] 6시(180도) 화살표 기준 계산
    const numPrizes = livePrizes.length;
    const segmentAngle = 360 / numPrizes;
    
    // Ci: Rotation 0일 때 해당 칸의 중심 각도 (12시 기준 시계방향)
    const Ci = (winnerIndex * segmentAngle) + (segmentAngle / 2);
    
    // R: 해당 칸을 6시(180도)로 가져오기 위해 휠이 돌아야 하는 각도
    const R = (180 - Ci + 360) % 360;
    
    // 최소 10바퀴 이상 돌도록 설정하여 박진감 제공
    const rotationIncrease = (360 * 10) + R;
    const nextRotation = currentRotationRef.current + (360 - (currentRotationRef.current % 360)) + rotationIncrease;
    
    currentRotationRef.current = nextRotation;
    
    const winnerPrize = livePrizes[winnerIndex];
    console.log(`[Spin Logic] Winner: ${winnerPrize.text}, Index: ${winnerIndex}, Segment Angle: ${segmentAngle}, Target R: ${R}`);

    setRotation(nextRotation);

    // 4. 애니메이션 종료(4.5초) 후 결과 처리
    setTimeout(async () => {
      const updatedPrizes = livePrizes.map((p, i) => 
        i === winnerIndex ? { ...p, currentCount: Math.max(0, p.currentCount - 1) } : p
      );
      
      try {
        await setDoc(doc(db, 'content', 'prizes'), { prizes: updatedPrizes });
        await addDoc(collection(db, 'entries'), {
          name: form.name,
          phone: validatedPhone,
          prize: winnerPrize.text,
          date: new Date().toLocaleString(),
          timestamp: serverTimestamp()
        });
        
        setPrizes(updatedPrizes);
        setResult(winnerPrize.text);
        setSubmitted(true);
      } catch (err) {
        console.error("Save error:", err);
      } finally {
        setIsSpinning(false);
        isLockedRef.current = false;
      }
    }, 4600); 
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const cleanPhone = form.phone.replace(/[^0-9]/g, '');
    if (!/^010[0-9]{7,8}$/.test(cleanPhone)) return alert('올바른 연락처를 입력해주세요.');
    if (!form.agreed) return alert('동의가 필요합니다.');
    setShowModal(false);
    spin(cleanPhone);
  };

  if (prizes.length === 0) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--primary)' }}>룰렛 로딩 중...</div>;

  return (
    <div className="roulette-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', width: '100%' }}>
      
      {/* 룰렛 본체 */}
      <div className="roulette-container" style={{ position: 'relative', width: '320px', height: '320px' }}>
        {/* 하단 화살표 (6시 방향 고정) */}
        <div style={{ 
          position: 'absolute', bottom: '-45px', left: '50%', transform: 'translateX(-50%)', 
          zIndex: 100, width: 0, height: 0, 
          borderLeft: '22px solid transparent', borderRight: '22px solid transparent', 
          borderBottom: '44px solid var(--primary)',
          filter: 'drop-shadow(0 0 10px rgba(197, 160, 89, 0.6))'
        }}></div>

        <div className="roulette-wheel" style={{ 
          width: '100%', height: '100%', borderRadius: '50%', border: '10px solid var(--primary)', 
          overflow: 'hidden', position: 'relative',
          transform: `rotate(${rotation}deg)`, 
          transition: isSpinning ? 'transform 4.5s cubic-bezier(0.15, 0, 0.15, 1)' : 'none',
          background: `conic-gradient(${prizes.map((p, i) => `${p.color || (i % 2 === 0 ? '#1a1a1a' : '#2a2a2a')} ${i * (360/prizes.length)}deg ${(i+1) * (360/prizes.length)}deg`).join(', ')})`
        }}>
          {prizes.map((prize, i) => {
            const angle = (i * (360/prizes.length)) + (180/prizes.length);
            return (
              <div key={i} style={{ 
                position: 'absolute', top: '50%', left: '50%', width: '50%', height: '60px', 
                marginTop: '-30px', transformOrigin: 'left center', 
                transform: `rotate(${angle}deg)`, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '35px' 
              }}>
                <div style={{ transform: `rotate(${-angle}deg)`, textAlign: 'center' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '0.85rem', wordBreak: 'keep-all' }}>{prize.text}</span>
                  {prize.currentCount <= 0 && <span style={{ color: '#ff4444', fontSize: '0.6rem', display: 'block', fontWeight: 'bold' }}>품절</span>}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '45px', height: '45px', background: 'var(--primary)', borderRadius: '50%', zIndex: 50, border: '5px solid #000' }}></div>
      </div>

      {/* 결과 UI */}
      <div style={{ width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {submitted && !isSpinning && (
          <div className="glass fade-in" style={{ padding: '2.5rem', borderRadius: '25px', background: 'rgba(197, 160, 89, 0.15)', border: '2px solid var(--primary)', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1rem' }}>🎉 당첨을 축하드립니다!</h3>
            <p style={{ color: '#fff', fontSize: '2.2rem', fontWeight: '800', marginBottom: '1.5rem' }}>{result}</p>
            <button className="btn-primary" style={{ padding: '1rem 3rem' }} onClick={() => setSubmitted(false)}>한 번 더 도전하기</button>
          </div>
        )}

        {/* 참여 안내 */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.8rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '1rem', marginBottom: '1rem', textAlign: 'center' }}>📋 이벤트 참여 가이드</p>
          <ul style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'left', listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <li>• 1인 1회 참여 가능하며, 현장 상황에 따라 제한될 수 있습니다.</li>
            <li>• 당첨 경품은 매장 카운터에서 당첨 화면 확인 후 즉시 지급됩니다.</li>
            <li>• 입력하신 정보는 이벤트 당첨 안내 및 마케팅 용도로 활용됩니다.</li>
          </ul>
        </div>

        {!isSpinning && !submitted && (
          <button className="btn-primary" onClick={() => setShowModal(true)} style={{ width: '100%', padding: '1.6rem', fontSize: '1.3rem', borderRadius: '15px' }}>행운의 룰렛 돌리기</button>
        )}
        {isSpinning && <p style={{ color: 'var(--primary)', fontWeight: 'bold', textAlign: 'center', animation: 'pulse 1s infinite', fontSize: '1.1rem' }}>행운의 여신이 응답하는 중...</p>}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(15px)' }}>
          <div className="glass" style={{ padding: '3rem', width: '90%', maxWidth: '420px', border: '1px solid var(--primary)', borderRadius: '30px' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '2rem', textAlign: 'center', fontSize: '1.5rem' }}>이벤트 응모</h3>
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>성함</label>
                <input type="text" placeholder="성함을 입력해주세요" className="glass-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={{ background: '#111', border: '1px solid #333', padding: '1.2rem', color: '#fff', borderRadius: '12px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>연락처</label>
                <input type="tel" placeholder="010-0000-0000" className="glass-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required style={{ background: '#111', border: '1px solid #333', padding: '1.2rem', color: '#fff', borderRadius: '12px' }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: '#888', background: '#000', padding: '1.2rem', borderRadius: '15px', lineHeight: '1.6', border: '1px solid #222' }}>
                <p style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '0.6rem' }}>[개인정보 수집 및 마케팅 활용 안내]</p>
                수집된 개인정보는 당첨 안내 및 가게 홍보 목적으로 활용될 수 있음에 동의하십니까? (보유기간: 1년)
              </div>
              <label style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', fontSize: '0.95rem', color: '#fff', cursor: 'pointer', padding: '0.5rem 0' }}>
                <input type="checkbox" checked={form.agreed} onChange={e => setForm({...form, agreed: e.target.checked})} style={{ width: '20px', height: '20px' }} />
                위 내용을 확인했으며 동의합니다. (필수)
              </label>
              <button type="submit" className="btn-primary" style={{ padding: '1.5rem', marginTop: '1rem' }}>룰렛 돌리기 시작</button>
              <button type="button" onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#666', marginTop: '1rem', cursor: 'pointer' }}>취소하기</button>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}} />
    </div>
  );
};

export default RouletteGame;
