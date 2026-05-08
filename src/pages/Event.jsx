import React, { useState } from 'react';
import RouletteGame from '../components/RouletteGame';

const Event = () => {
  const [showGame, setShowGame] = useState(false);

  return (
    <section className="container" style={{ 
      padding: 'clamp(1.5rem, 6vw, 3rem) 0.8rem', 
      minHeight: '100vh', 
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {!showGame ? (
        <div style={{ animation: 'fadeIn 0.8s ease-out', width: '100%', maxWidth: '500px' }}>
          <div style={{ marginBottom: 'clamp(2rem, 8vw, 4rem)' }}>
            {/* 사용자의 요청에 따라 모든 효과 폐기, 심플한 네모 버튼으로 변경 */}
            <button 
              onClick={() => setShowGame(true)} 
              className="btn-simple-gold" 
            >
              행운의 추첨 시작하기
            </button>
          </div>
          
          <div className="glass" style={{ 
            margin: '0 auto', 
            padding: 'clamp(1.2rem, 4vw, 2rem)', 
            textAlign: 'left', 
            borderRadius: '15px',
            border: '1px solid rgba(197, 160, 89, 0.2)',
            width: '98%',
            background: 'rgba(0,0,0,0.8)'
          }}>
            <h3 style={{ 
              color: 'var(--primary)', 
              marginBottom: '1rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              fontSize: '1rem', 
              fontWeight: '700'
            }}>
              📋 참여 가이드
            </h3>
            <ul style={{ 
              color: '#fff', 
              lineHeight: '1.7', 
              paddingLeft: '1.1rem', 
              fontSize: '0.85rem', 
              opacity: 0.8,
              margin: 0
            }}>
              <li style={{ marginBottom: '0.5rem' }}>1인 1회 참여 가능하며, 현장 상황에 따라 제한될 수 있습니다.</li>
              <li style={{ marginBottom: '0.5rem' }}>당첨 경품은 매장 카운터에서 당첨 화면 확인 후 즉시 지급됩니다.</li>
              <li>입력하신 정보는 이벤트 당첨 안내 및 마케팅 용도로 활용됩니다.</li>
            </ul>
          </div>
          
          <div style={{ height: '6rem' }}></div>
        </div>
      ) : (
        <RouletteGame />
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .btn-simple-gold {
          padding: 1.2rem 2rem;
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--primary);
          background: #000;
          border: 1px solid var(--primary);
          border-radius: 4px; 
          cursor: pointer;
          transition: all 0.2s ease;
          width: 90%;
          max-width: 400px;
          letter-spacing: 1px;
          white-space: nowrap; /* 줄바꿈 방지 */
        }

        .btn-simple-gold:active {
          background: var(--primary);
          color: #000;
        }

        /* 모바일 환경 전용: 글씨 크기 약 80% 축소 */
        @media (max-width: 768px) {
          .btn-simple-gold {
            padding: 1rem 1.5rem;
            font-size: 1.05rem; /* 기존 1.3rem의 약 80% */
            width: 95%;
          }
          .glass h3 {
            font-size: 0.85rem !important; /* 기존 1rem의 약 85% */
          }
          .glass ul li {
            font-size: 0.75rem !important; /* 기존 0.85rem의 약 88% */
            line-height: 1.5;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </section>
  );
};

export default Event;
