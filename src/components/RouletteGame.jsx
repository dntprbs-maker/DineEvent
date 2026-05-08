import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const RouletteGame = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [prizes, setPrizes] = useState([]); 
  const [showModal, setShowModal] = useState(true);
  const [form, setForm] = useState({ name: '', phone: '', agreed: false });
  const [slotText, setSlotText] = useState(""); 
  
  const isLockedRef = useRef(false); 

  useEffect(() => {
    fetchInitialPrizes();
  }, []);

  const fetchInitialPrizes = async () => {
    try {
      const prizeDoc = await getDoc(doc(db, 'content', 'prizes'));
      if (prizeDoc.exists()) {
        const data = prizeDoc.data().list || [];
        setPrizes(data);
      }
    } catch (err) {
      console.error("Initial prize fetch error:", err);
    }
  };

  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 8) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    }
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
  };

  const handlePhoneChange = (e) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    setForm({ ...form, phone: formattedValue });
  };

  const spin = async (validatedPhone) => {
    if (isLockedRef.current || prizes.length === 0) return;
    isLockedRef.current = true;
    setIsSpinning(true);
    
    const snap = await getDoc(doc(db, 'content', 'prizes'));
    const livePrizes = snap.exists() ? (snap.data().list || []) : [...prizes];
    setPrizes(livePrizes);

    const availablePrizes = livePrizes.filter(p => p.currentCount > 0);
    if (availablePrizes.length === 0) {
      alert('모든 경품이 소진되었습니다.');
      isLockedRef.current = false;
      setIsSpinning(false);
      return;
    }

    const totalWeight = livePrizes.reduce((sum, p) => sum + (p.currentCount > 0 ? Number(p.totalCount) : 0), 0);
    let random = Math.random() * totalWeight;
    let winnerIndex = -1;
    for (let i = 0; i < livePrizes.length; i++) {
      if (livePrizes[i].currentCount <= 0) continue;
      const weight = Number(livePrizes[i].totalCount);
      if (random < weight) { winnerIndex = i; break; }
      random -= weight;
    }

    if (winnerIndex === -1) {
      isLockedRef.current = false;
      setIsSpinning(false);
      return;
    }

    const winnerPrize = livePrizes[winnerIndex];

    let count = 0;
    const slotInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * livePrizes.length);
      setSlotText(livePrizes[randomIndex].name);
      count++;
    }, 100);

    setTimeout(async () => {
      clearInterval(slotInterval);
      const updatedPrizes = livePrizes.map((p, i) => 
        i === winnerIndex ? { ...p, currentCount: Math.max(0, p.currentCount - 1) } : p
      );
      
      try {
        await setDoc(doc(db, 'content', 'prizes'), { list: updatedPrizes });
        await addDoc(collection(db, 'entries'), {
          name: form.name,
          phone: validatedPhone,
          prize: winnerPrize.name,
          date: new Date().toLocaleString(),
          timestamp: serverTimestamp()
        });
        
        setPrizes(updatedPrizes);
        setResult(winnerPrize.name);
        setSubmitted(true);
      } catch (err) {
        console.error("Save error:", err);
      } finally {
        setIsSpinning(false);
        isLockedRef.current = false;
      }
    }, 2500); 
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const cleanPhone = form.phone.replace(/[^0-9]/g, '');
    if (!/^010[0-9]{7,8}$/.test(cleanPhone)) return alert('올바른 연락처를 입력해주세요.');
    if (!form.agreed) return alert('동의가 필요합니다.');
    setShowModal(false);
    spin(cleanPhone);
  };

  if (prizes.length === 0) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--primary)' }}>데이터 로딩 중...</div>;

  return (
    <div className="roulette-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', width: '100%', minHeight: '400px', justifyContent: 'center' }}>
      
      <div style={{ width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {submitted && !isSpinning && (
          <div className="result-card fade-in" style={{ 
            padding: '4rem 2rem', borderRadius: '30px', 
            background: `linear-gradient(135deg, ${result?.includes('꽝') ? 'rgba(255, 50, 50, 0.15)' : 'rgba(197, 160, 89, 0.2)'}, rgba(0,0,0,0.9))`, 
            border: `3px solid ${result?.includes('꽝') ? '#ff4d4d' : 'var(--primary)'}`, textAlign: 'center',
            boxShadow: `0 0 60px ${result?.includes('꽝') ? 'rgba(255, 50, 50, 0.4)' : 'rgba(197, 160, 89, 0.5)'}`,
            animation: 'impact 0.6s cubic-bezier(0.17, 0.89, 0.32, 1.49)',
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '1.8rem', animation: 'twinkle 1s infinite' }}>{result?.includes('꽝') ? '💦' : '✨'}</span>
              <h3 style={{ fontSize: '1.8rem', color: result?.includes('꽝') ? '#ff4d4d' : 'var(--primary)', fontWeight: '900', letterSpacing: '2px' }}>
                {result?.includes('꽝') ? '아쉽네요' : '축하합니다!'}
              </h3>
              <span style={{ fontSize: '1.8rem', animation: 'twinkle 1s infinite alternate' }}>{result?.includes('꽝') ? '💦' : '✨'}</span>
            </div>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <p style={{ 
                color: '#fff', 
                fontSize: 'clamp(2rem, 8vw, 3.5rem)', 
                fontWeight: '900', 
                textShadow: `0 0 20px ${result?.includes('꽝') ? 'rgba(255, 77, 77, 0.8)' : 'rgba(255, 255, 255, 0.8)'}, 0 0 40px ${result?.includes('꽝') ? 'rgba(255, 77, 77, 0.4)' : 'rgba(197, 160, 89, 0.6)'}`,
                lineHeight: '1.3',
                wordBreak: 'keep-all'
              }}>
                {result}
              </p>
            </div>
          </div>
        )}

        {!isSpinning && !submitted && (
          <button className="btn-primary" onClick={() => setShowModal(true)} style={{ width: '100%', padding: '1.6rem', fontSize: '1.3rem', borderRadius: '15px' }}>행운의 추첨 시작하기</button>
        )}

        {isSpinning && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '30px', border: '1px dashed var(--primary)' }}>
            <div style={{ height: '80px', overflow: 'hidden', marginBottom: '2rem' }}>
              <p style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)', animation: 'slotScroll 0.1s infinite linear' }}>
                {slotText}
              </p>
            </div>
            <p style={{ color: '#fff', fontWeight: 'bold', opacity: 0.7, fontSize: '1rem' }}>과연 행운의 결과는...?</p>
          </div>
        )}

        {!submitted && !isSpinning && (
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.8rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', marginTop: '4rem' }}>
            <p style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '1rem', marginBottom: '1rem', textAlign: 'center' }}>📋 이벤트 참여 가이드</p>
            <ul style={{ color: '#fff', fontSize: '0.9rem', textAlign: 'left', listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li>• 1인 1회 참여 가능하며, 현장 상황에 따라 제한될 수 있습니다.</li>
              <li>• 당첨 경품은 매장 카운터에서 당첨 화면 확인 후 즉시 지급됩니다.</li>
              <li>• 입력하신 정보는 이벤트 당첨 안내 및 마케팅 용도로 활용됩니다.</li>
            </ul>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(15px)' }}>
          <div className="glass modal-content" style={{ padding: '3rem', width: '90%', maxWidth: '420px', border: '1px solid var(--primary)', borderRadius: '30px' }}>
            <h3 className="modal-title" style={{ color: 'var(--primary)', marginBottom: '2rem', textAlign: 'center', fontSize: '1.5rem' }}>이벤트 응모</h3>
            <form onSubmit={handleFormSubmit} className="modal-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
                <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'left', width: '100%', paddingLeft: '0.2rem' }}>닉네임</label>
                <input type="text" placeholder="닉네임을 입력해주세요" className="glass-input modal-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={{ background: '#111', border: '1px solid #333', padding: '1.2rem', color: '#fff', borderRadius: '12px', width: '100%' }} />
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
                <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'left', width: '100%', paddingLeft: '0.2rem' }}>연락처</label>
                <input type="tel" placeholder="010-0000-0000" className="glass-input modal-input" value={form.phone} onChange={handlePhoneChange} required style={{ background: '#111', border: '1px solid #333', padding: '1.2rem', color: '#fff', borderRadius: '12px', width: '100%' }} />
              </div>
              <div className="consent-box" style={{ fontSize: '0.75rem', color: '#888', background: '#000', padding: '1.2rem', borderRadius: '15px', lineHeight: '1.6', border: '1px solid #222', textAlign: 'left', wordBreak: 'keep-all' }}>
                <p style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '0.6rem', textAlign: 'left' }}>[개인정보 수집 및 마케팅 활용 안내]</p>
                수집된 개인정보는 <span style={{ color: '#ff4d4d', fontWeight: 'bold' }}>당첨 안내</span> 및 <span style={{ color: '#ff4d4d', fontWeight: 'bold' }}>가게 홍보 목적</span>으로 활용될 수 있음에 동의하십니까? (보유기간: 1년)
              </div>
              <label className="agree-label" style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', fontSize: '0.95rem', color: '#fff', cursor: 'pointer', padding: '0.5rem 0' }}>
                <input type="checkbox" checked={form.agreed} onChange={e => setForm({...form, agreed: e.target.checked})} style={{ width: '20px', height: '20px' }} />
                위 내용을 확인했으며 동의합니다. (필수)
              </label>
              <button type="submit" className="btn-primary modal-submit-btn" style={{ padding: '1rem', marginTop: '1rem', width: '60%', alignSelf: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>추첨 시작하기</button>
              <button type="button" className="modal-cancel-btn" onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#666', marginTop: '1rem', cursor: 'pointer' }}>취소하기</button>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes impact {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slotScroll {
          0% { transform: translateY(5px); opacity: 0.8; }
          50% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-5px); opacity: 0.8; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1.2); }
          50% { opacity: 0.3; transform: scale(0.8); }
        }

        /* 모바일 응모 모달 최적화 (80% 축소 및 간격/정렬 정밀 조정) */
        @media (max-width: 768px) {
          .modal-content { padding: 1.5rem !important; border-radius: 20px !important; }
          .modal-title { font-size: 1.1rem !important; margin-bottom: 0.8rem !important; }
          .modal-form { gap: 0.6rem !important; align-items: stretch !important; } 
          .form-group { gap: 0.2rem !important; align-items: flex-start !important; } /* 라벨 좌측 정렬 */
          .form-label { font-size: 0.7rem !important; margin-bottom: 0 !important; text-align: left !important; width: 100% !important; padding-left: 0.2rem !important; }
          .modal-input { padding: 0.7rem !important; font-size: 0.85rem !important; width: 100% !important; }
          .consent-box { 
            padding: 0.7rem !important; 
            font-size: 0.6rem !important; 
            line-height: 1.1 !important; 
            text-align: left !important; 
            word-break: keep-all !important; 
          }
          .consent-box p { margin-bottom: 0.2rem !important; text-align: left !important; }
          .agree-label { font-size: 0.75rem !important; padding: 0.2rem 0 !important; gap: 0.4rem !important; justify-content: flex-start !important; }
          .agree-label input { width: 16px !important; height: 16px !important; }
          .modal-submit-btn { 
            width: 60% !important; /* 좌우 크기 절반 수준으로 축소 (가독성 위해 60% 설정) */
            padding: 0.7rem !important; /* 상하 크기 2/3 수준 (기존 1rem 대비) */
            font-size: 0.9rem !important; 
            margin: 0.5rem auto 0 auto !important; /* 중앙 정렬 및 여백 */
            display: block !important;
            border-radius: 30px !important;
          }
          .modal-cancel-btn { font-size: 0.7rem !important; margin-top: 0.3rem !important; }
        }
      `}} />
    </div>
  );
};

export default RouletteGame;
