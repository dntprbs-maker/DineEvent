import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CompanyIntroV2.css';

/**
 * HeroSection — 서비스 소개 (히어로 + 워크플로우)
 * 라우트: /
 */

// 룰렛 경품 섹터 설정 (시뮬레이션용)
const miniPrizes = [
  { name: '🥇 1등 명품 한우 세트',    color: '#ffb53f', isWin: true  },
  { name: '🍀 다음 기회에',            color: '#1a1a1a', isWin: false },
  { name: '☕ 스타벅스 커피 쿠폰',     color: '#c5a059', isWin: true  },
  { name: '🍟 맛있는 사이드 메뉴',     color: '#2a2a2a', isWin: true  },
  { name: '🎁 탄산음료 서비스권',      color: '#c5a059', isWin: true  },
  { name: '🍀 아쉬운 꽝',             color: '#111111', isWin: false },
];

const HeroSection = () => {
  const navigate = useNavigate();

  // ── 상태 관리 ──
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [isSpinning,     setIsSpinning]     = useState(false);
  const [spinAngle,      setSpinAngle]      = useState(0);
  const [selectedPrize,  setSelectedPrize]  = useState(null);
  const [totalEntries,   setTotalEntries]   = useState(482927); // 가상 누적 응모수

  // 실시간 누적 응모 카운팅 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalEntries(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // 가상 룰렛 구동 로직
  const startVirtualSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedPrize(null);
    const randomOffset = Math.floor(Math.random() * 360);
    const finalRotation = spinAngle + 2160 + randomOffset;
    setSpinAngle(finalRotation);
    setTimeout(() => {
      setIsSpinning(false);
      const normalized = (360 - (finalRotation % 360) + 90) % 360;
      const index = Math.floor(normalized / 60) % 6;
      setSelectedPrize(miniPrizes[index]);
      setShowPrizeModal(true);
    }, 4000);
  };

  return (
    <>
      {/* ── 룰렛 당첨 모달 ── */}
      {showPrizeModal && selectedPrize && (
        <div className="v2-modal-overlay" onClick={() => setShowPrizeModal(false)}>
          <div
            className={`v2-modal-card ${selectedPrize.isWin ? 'v2-modal-card--win' : 'v2-modal-card--lose'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="v2-modal-emoji">{selectedPrize.isWin ? '🎉' : '🍀'}</div>
            <h3 className="v2-modal-title" style={{ color: selectedPrize.isWin ? '#c5a059' : '#a3a3a3' }}>
              {selectedPrize.isWin ? '시뮬레이션 당첨 완료!' : '아쉽지만 다음 기회에!'}
            </h3>
            <p className="v2-modal-prize">{selectedPrize.name}</p>
            <p className="v2-modal-note">
              ※ 본 룰렛은 마케팅 시뮬레이션입니다.<br/>
              실제 매장 데모에 입장하여 경품 재고와 Firestore 실시간 연동을 체험해 보세요!
            </p>
            <button className="v2-modal-close" onClick={() => setShowPrizeModal(false)}>닫기</button>
          </div>
        </div>
      )}

      {/* ── 히어로 섹션 ── */}
      <section id="hero" className="v2-hero">
        <div className="v2-hero-inner">
          <div className="v2-badge">오프라인 매장 전용 스마트 마케팅 엔진</div>
          <h1 className="v2-hero-title">
            방문 고객의 발걸음을<br/>
            <span className="v2-hero-gradient">머물게 하는 완벽한 룰렛</span>
          </h1>
          <p className="v2-hero-sub">
            실시간 경품 한도 설정, 완벽한 테넌트 보안 격리,<br/>
            그리고 수수료 0원의 고객 단체 문자 발송까지.
          </p>
          <div className="v2-hero-highlight">
            스마트폰 하나로 오프라인 매장의 고객 유입과 단골 확보를 한 번에 실현하세요.
          </div>

          {/* 워크플로우 이미지 */}
          <div className="v2-workflow">
            <div className="v2-workflow-header">
              <h2 className="v2-workflow-title">💡 서비스 사용 방법</h2>
              <p className="v2-workflow-desc">QR 스캔부터 마케팅 문자까지 점주와 고객을 잇는 가장 간결한 흐름</p>
            </div>
            <div className="v2-workflow-img-wrap">
              <img src="/workflow-illust.png" alt="서비스 사용 방법 워크플로우" className="v2-workflow-img" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 최종 CTA ── */}
      <section className="v2-cta-section">
        <div className="v2-cta-box">
          <div className="v2-cta-glow" />
          <h2 className="v2-cta-title">이벤트룰렛과 함께 매출 성장을 시작해보세요</h2>
          <p className="v2-cta-desc">단 5분이면 매장만의 응모 이벤트 룰렛을 구축하여 현장 대기 트래픽을 단골 고객으로 전환할 수 있습니다.</p>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
