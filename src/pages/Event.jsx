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
          <div style={{ marginBottom: 'clamp(1.5rem, 6vw, 3rem)' }}>
            <button 
              onClick={() => setShowGame(true)} 
              className="btn-neon-gold" 
            >
              행운의 추첨 시작하기
            </button>
          </div>
          
          <div className="glass" style={{ 
            margin: '0 auto', 
            padding: 'clamp(1.2rem, 4vw, 2rem)', 
            textAlign: 'left', 
            borderRadius: '25px',
            border: '1px solid rgba(197, 160, 89, 0.15)',
            width: '98%',
            background: 'rgba(0,0,0,0.4)'
          }}>
            <h3 style={{ 
              color: 'var(--primary)', 
              marginBottom: '1.2rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              fontSize: 'clamp(0.95rem, 3.5vw, 1.15rem)', 
              fontWeight: '700'
            }}>
              📋 참여 가이드
            </h3>
            <ul style={{ 
              color: '#fff', 
              lineHeight: '1.7', 
              paddingLeft: '1.1rem', 
              fontSize: 'clamp(0.75rem, 3vw, 0.9rem)', 
              opacity: 0.85,
              margin: 0
            }}>
              <li style={{ marginBottom: '0.6rem' }}>1인 1회 참여 가능하며, 현장 상황에 따라 제한될 수 있습니다.</li>
              <li style={{ marginBottom: '0.6rem' }}>당첨 경품은 매장 카운터에서 당첨 화면 확인 후 즉시 지급됩니다.</li>
              <li>입력하신 정보는 이벤트 당첨 안내 및 마케팅 용도로 활용됩니다.</li>
            </ul>
          </div>
          
          {/* 사용자의 요청에 따라 '메인 페이지로 돌아가기' 링크를 모든 화면에서 삭제했습니다. */}
          <div style={{ height: '6rem' }}></div>
        </div>
      ) : (
        <RouletteGame />
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .btn-neon-gold {
          position: relative;
          padding: clamp(1rem, 4vw, 1.5rem) clamp(2rem, 10vw, 4rem);
          font-size: clamp(1.1rem, 4vw, 1.5rem);
          font-weight: 900;
          color: #ffd700;
          background: transparent;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          letter-spacing: 2px;
          overflow: hidden;
          width: auto;
          max-width: 90%;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
          z-index: 1;
        }
        .btn-neon-gold::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: repeating-conic-gradient(
            from 0deg,
            transparent 0%,
            transparent 12%,
            rgba(255, 215, 0, 0.4) 18%,
            #ffd700 20%
          );
          animation: spinNeon 3s linear infinite;
          z-index: -2;
        }
        .btn-neon-gold::after {
          content: '';
          position: absolute;
          inset: 3px;
          background: #0a0a0a;
          border-radius: 50px;
          z-index: -1;
        }
        @keyframes spinNeon {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </section>
  );
};

export default Event;
