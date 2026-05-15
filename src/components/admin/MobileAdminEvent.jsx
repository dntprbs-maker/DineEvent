import React, { useState } from 'react';

const MobileAdminEvent = ({ 
  prizes, handleChange, handleSave, 
  handleConfirmReset, handleNewEventSetup, handleStartNewEvent,
  saving, 
  showResetConfirm, setShowResetConfirm 
}) => {
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [setupPrizes, setSetupPrizes] = useState([]); // 로컬 상태로 분리

  const handleSetupChange = (index, field, value) => {
    const newList = [...setupPrizes];
    if (field === 'totalCount') {
      const cleanValue = value.replace(/[^0-9]/g, '');
      const numValue = parseInt(cleanValue) || 0;
      newList[index] = { ...newList[index], [field]: numValue, currentCount: numValue };
    } else {
      newList[index] = { ...newList[index], [field]: value };
    }
    setSetupPrizes(newList);
  };

  const sharedStyles = `
    .action-floating-dual-perfect { 
      position: fixed; bottom: 35px; left: 12px; right: 12px; 
      display: flex; gap: 12px; z-index: 2000; 
      animation: slideUpIn 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    }
    .mockup-btn-extreme-gold {
      flex: 1;
      padding: 0.9rem 0.5rem;
      border-radius: 12px;
      background: linear-gradient(135deg, #fceabb 0%, #fccd4d 40%, #f8b500 50%, #fccd4d 60%, #fbdf93 100%);
      border: 1px solid #ffeb3b;
      color: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      box-shadow: 0 0 25px rgba(255, 215, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4);
      transition: all 0.2s ease;
    }
    .btn-label { font-size: 0.85rem; font-weight: 900; }
    .btn-icon-right-thin { font-size: 0.9rem; filter: drop-shadow(0 0 1px rgba(0,0,0,0.3)); }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUpIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
  `;

  // 리스트 뷰 (생략...)
  if (!isSetupMode) {
    return (
      <div className="mobile-admin-container" style={{ padding: '0 0.8rem 150px 0.8rem', animation: 'fadeIn 0.5s ease-out' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {prizes.map((prize, index) => (
            <div key={index} className="slim-premium-card">
              <div className="card-top-row">
                <span className="gold-icon">🎁</span>
                <input 
                  type="text" 
                  value={prize.name} 
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  className="prize-input-name"
                  placeholder="경품 명칭"
                />
              </div>
              <div className="card-bottom-row">
                <div className="stat-inputs">
                  <span className="stat-label">설정갯수:</span>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    value={prize.totalCount?.toLocaleString()} 
                    onChange={(e) => handleChange(index, 'totalCount', e.target.value)}
                    className="prize-input-num"
                  />
                  <span className="stat-label" style={{ marginLeft: '8px' }}>남은갯수:</span>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    value={prize.currentCount?.toLocaleString()} 
                    onChange={(e) => handleChange(index, 'currentCount', e.target.value)}
                    className="prize-input-num gold"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 버튼 */}
        <div className="action-floating-dual-perfect">
          <button 
            className="mockup-btn-extreme-gold" 
            onClick={() => handleSave()}
            disabled={saving}
          >
            <span className="btn-label">{saving ? '저장중' : '변경내용저장'}</span>
            <span className="btn-icon-right-thin">💾</span>
          </button>
          <button 
            className="mockup-btn-extreme-gold" 
            onClick={() => {
              // 메인 데이터는 건드리지 않고 로컬 상태만 초기화
              setSetupPrizes(Array(6).fill().map(() => ({ name: '', totalCount: 0, currentCount: 0 })));
              setIsSetupMode(true);
            }}
          >
            <span className="btn-label">새 이벤트 만들기</span>
            <span className="btn-icon-right-thin">🔄</span>
          </button>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          ${sharedStyles}
          .slim-premium-card {
            background: rgba(15, 15, 15, 0.7);
            border: 1px solid rgba(197, 160, 89, 0.25);
            border-radius: 10px;
            padding: 0.7rem 1rem;
            display: flex;
            flex-direction: column;
            gap: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            backdrop-filter: blur(8px);
          }
          .card-top-row { display: flex; align-items: center; gap: 8px; }
          .gold-icon { font-size: 0.9rem; opacity: 0.9; }
          
          .prize-input-name {
            background: transparent;
            border: none;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            color: #eee;
            font-size: 0.9rem;
            font-weight: 700;
            width: 100%;
            padding: 2px 0;
            outline: none;
          }
          .prize-input-name:focus { border-bottom-color: var(--primary); }

          .card-bottom-row { display: flex; align-items: center; margin-top: 2px; }
          .stat-inputs { display: flex; align-items: center; gap: 4px; }
          .stat-label { color: #666; font-size: 0.65rem; font-weight: 500; }
          
          .prize-input-num {
            background: rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 4px;
            color: #aaa;
            font-size: 0.8rem;
            font-weight: 600;
            width: 68px;
            text-align: right;
            padding: 2px 6px;
            outline: none;
            -moz-appearance: textfield;
          }
          .prize-input-num::-webkit-outer-spin-button,
          .prize-input-num::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          .prize-input-num.gold {
            color: var(--primary);
            border-color: rgba(197, 160, 89, 0.3);
            font-weight: 800;
          }
          .prize-input-num:focus { border-color: var(--primary); background: #000; }
        `}} />
      </div>
    );
  }

  // 초기화 및 설정 뷰 (새 이벤트 만들기)
  return (
    <div className="mobile-admin-container" style={{ padding: '2rem 1rem 150px 1rem', background: '#000', minHeight: '100vh', animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: '900', textShadow: '0 0 15px rgba(197, 160, 89, 0.4)' }}>🔄 새 이벤트 만들기</h3>
        <p style={{ color: '#666', fontSize: '0.8rem', marginTop: '5px' }}>새로운 경품 구성을 설정합니다.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {setupPrizes.map((prize, index) => (
          <div key={index} className="setup-card-premium">
            <div className="setup-badge">#{index + 1}</div>
            <div className="setup-inputs-group">
              <input 
                type="text" 
                value={prize.name} 
                placeholder="경품 명칭 입력"
                onChange={(e) => handleSetupChange(index, 'name', e.target.value)}
                className="setup-input-name"
              />
              <input 
                type="text" 
                inputMode="numeric"
                value={prize.totalCount > 0 ? prize.totalCount.toLocaleString() : ''} 
                placeholder="0"
                onChange={(e) => handleSetupChange(index, 'totalCount', e.target.value)}
                className="setup-input-count"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="action-floating-dual-perfect">
        <button 
          className="mockup-btn-extreme-gold" 
          onClick={async () => { 
            await handleStartNewEvent(setupPrizes); 
            setIsSetupMode(false); 
          }}
          disabled={saving}
        >
          <span className="btn-label">이벤트 시작하기</span>
          <span className="btn-icon-right-thin">🚀</span>
        </button>
        <button 
          className="mockup-btn-extreme-gold" 
          onClick={() => setIsSetupMode(false)}
          style={{ background: 'linear-gradient(135deg, #444, #222)', color: '#fff', border: '1px solid #555' }}
        >
          <span className="btn-label">취소하기</span>
          <span className="btn-icon-right-thin">❌</span>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        ${sharedStyles}
        .setup-card-premium { 
          background: rgba(255,255,255,0.03); 
          padding: 1rem; 
          border-radius: 15px; 
          display: flex; 
          align-items: center; 
          gap: 15px; 
          border: 1px solid rgba(255,255,255,0.05); 
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        .setup-badge { 
          color: var(--primary); 
          font-size: 1.2rem; 
          font-weight: 900; 
          min-width: 35px; 
          font-family: serif;
        }
        .setup-inputs-group { flex: 1; display: flex; gap: 10px; }
        .setup-input-name { 
          flex: 1; 
          background: #0a0a0a; 
          border: 1px solid #222; 
          border-radius: 10px; 
          padding: 0.8rem; 
          color: #fff; 
          font-size: 0.9rem; 
          outline: none; 
        }
        .setup-input-name:focus { border-color: var(--primary); }
        .setup-input-count { 
          width: 75px; 
          background: #0a0a0a; 
          border: 1px solid rgba(197, 160, 89, 0.3); 
          border-radius: 10px; 
          padding: 0.8rem; 
          color: var(--primary); 
          font-size: 1rem; 
          font-weight: 800; 
          text-align: right; 
          outline: none; 
        }
        .setup-input-count:focus { border-color: var(--primary); background: #000; }
      `}} />
    </div>
  );
};

export default MobileAdminEvent;
