import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CompanyIntroV2.css'; // 전용 CSS (Tailwind 비의존)

/**
 * CompanyIntroV2 - 리뉴얼 서비스 소개 랜딩 페이지 (V2)
 * 순수 CSS 기반 — Tailwind 버전에 의존하지 않아 어떤 프로젝트에든 이식 가능
 */
const CompanyIntroV2 = () => {
  const navigate = useNavigate();

  // ── 상태 관리 ──
  const [activeSection, setActiveSection] = useState('hero'); // 현재 활성 섹션
  const [activeFaq, setActiveFaq] = useState(null);
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinAngle, setSpinAngle] = useState(0);
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [totalEntries, setTotalEntries] = useState(482927);

  // 가상 룰렛 경품 섹터 설정
  const miniPrizes = [
    { name: '🥇 1등 명품 한우 세트', color: '#ffb53f', isWin: true },
    { name: '🍀 다음 기회에', color: '#1a1a1a', isWin: false },
    { name: '☕ 스타벅스 커피 쿠폰', color: '#c5a059', isWin: true },
    { name: '🍟 맛있는 사이드 메뉴', color: '#2a2a2a', isWin: true },
    { name: '🎁 탄산음료 서비스권', color: '#c5a059', isWin: true },
    { name: '🍀 아쉬운 꽝', color: '#111111', isWin: false },
  ];

  // 실시간 누적 응모 카운팅 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalEntries(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // ── 스크롤 스파이: IntersectionObserver로 현재 섹션 감지 ──
  useEffect(() => {
    // 감지할 섹션 ID 목록 (nav 메뉴 순서와 대응)
    const sectionIds = ['hero', 'cases', 'functions', 'pricing', 'faq'];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 화면에 40% 이상 보이는 섹션을 활성으로 설정
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,           // 뷰포트 기준
        rootMargin: '0px',
        threshold: 0.25,       // 25% 이상 보일 때 감지
      }
    );

    // 각 섹션 요소에 observer 연결
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // 컴포넌트 언마운트 시 정리
    return () => observer.disconnect();
  }, []);

  // ── 최상단 보정: 스크롤이 맨 위(200px 이하)이면 항상 hero 활성 ──
  // (기존 Observer 로직과 독립적으로 동작 — 다른 섹션에 영향 없음)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 200) {
        setActiveSection('hero');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

  // ── 데이터 ──
  const caseStudies = [
    {
      title: '🍽️ 다이닝 & 외식 매장',
      goal: '고객 단가의 상승과<br/>대기 시간의 지루함 해결!',
      prize: '1등 한우 모듬 세트, 사이드 무료 시식권 등',
      desc: '대기 시간이 다소 긴 고품격 다이닝 매장에 배치하여 고객의 지루함을 없애고, 주문 금액대별 응모 기회를 부여해 자연스럽게 테이블 단가를 끌어올립니다.',
      colorClass: 'v2-color-gold'
    },
    {
      title: '☕ 베이커리 & 카페',
      goal: '테이크아웃 단골 고객의<br/>방문 주기 폭발적 단축!',
      prize: '무료 아메리카노 교환권, 브랜드 텀블러 등',
      desc: '스탬프 적립보다 시각적 효과가 큰 즉석 룰렛 이벤트를 통해 단골 확보가 어려운 오피스 카페 상권에서 독보적인 유인 효과와 단골 락인을 이끌어냅니다.',
      colorClass: 'v2-color-emerald'
    },
    {
      title: '🍗 프랜차이즈 & 치킨 매장',
      goal: '배달 고객을 매장 홀 유입<br/>단골 고객으로 전환!',
      prize: '치킨 모바일 상품권, 크림 생맥주 무료권 등',
      desc: '배달 패키지에 동봉된 QR 코드를 활용하여 응모하게 한 뒤, 당첨된 룰렛 쿠폰을 매장 방문 시 즉시 사용하게 유도하여 홀 활성화 매출을 증폭시킵니다.',
      colorClass: 'v2-color-orange'
    },
    {
      title: '🎪 팝업스토어 & 행사장',
      goal: '현장 집객 효과의 극대화와<br/>잠재 고객 DB 수집!',
      prize: '브랜드 리미티드 굿즈, 스페셜 할인 바우처 등',
      desc: '폭발적으로 밀려드는 대기 고객의 트래픽을 안전하게 제어하고, 당첨 확률의 정밀 조정 및 소진 한도 제어를 통해 완벽한 행사 운영 리스크 헷지를 보장합니다.',
      colorClass: 'v2-color-violet'
    }
  ];

  const coreFeatures = [
    { icon: '🔒', badge: '보안 격리 보장',      image: '/feat_security.png',  title: '가맹점별 독립 데이터 운영',       desc: '각 매장의 이벤트 정보, 경품 재고 수량, 당첨자 개인 정보 등이 고유의 tenantId로 암호화 격리 저장되므로 가맹점 간 데이터 무단 침범을 원천 격리합니다.' },
    { icon: '🎁', badge: '트랜지션 재고 제어',   image: '/feat_inventory.png', title: '실시간 경품 재고 실시간 차감',     desc: '룰렛 회전 완료 시점 Firestore 트랜잭션이 작동하여 실시간으로 수량을 1씩 즉각 차감하며, 남은 재고가 0이 되면 자동으로 꽝 처리되어 당첨 오류를 방지합니다.' },
    { icon: '📱', badge: '추가 앱 무설치',       image: '/feat_mobile.png',   title: '무필터 점주용 모바일 오피스',     desc: '사장님과 고객 모두 귀찮은 모바일 앱을 다운로드할 필요가 전혀 없습니다. 모바일 브라우저에서 사장님 전용 관리 화면에 접속해 100% 무결한 제어가 가능합니다.' },
    { icon: '💬', badge: '마케팅 비용 0원',      image: '/feat_sms.png',      title: '메시지 발송 수수료 완전 제로',   desc: '통합 수집된 당첨자 휴대폰 목록을 사장님 스마트폰 기본 SMS 전송 환경으로 즉각 매핑하여 직발송하므로, 비싼 대량 발송 대행업체 수수료를 100% 절감합니다.' },
    { icon: '📋', badge: '실시간 편집 지원',     image: '/feat_notice.png',   title: '공지사항 & 이벤트 템플릿 관리', desc: '매장의 새로운 소식이나 룰렛 이벤트 문구를 스마트폰 클릭 몇 번으로 즉시 수정할 수 있으며, 수정 즉시 고객들이 접속하는 이벤트 화면에 1초 만에 자동 배포됩니다.' },
    { icon: '📊', badge: '고품격 보고서',        image: '/feat_report.png',   title: '실시간 응모 로그 및 통계 리포트', desc: '어떤 고객이 몇 시 몇 분에 응모했고 어떤 경품에 당첨되었는지 모든 데이터를 실시간 타임라인 로그로 확인 가능하며 매장의 마케팅 인사이트 지표로 활용할 수 있습니다.' }
  ];

  const faqList = [
    { q: 'Q. 마케팅 문자 발송 비용은 어떻게 처리되나요?', a: '이벤트룰렛은 비싼 문자 대량 발송 중계 서버를 거치지 않습니다. 점주 관리실에서 원하는 당첨 그룹을 필터링한 후, 사장님 스마트폰의 기본 SMS 앱 전송 환경으로 번호 목록과 내용을 전달합니다. 따라서 추가적인 대행 수수료가 전혀 없으며, 사장님 휴대폰 요금제의 기본 무료 문자 범위 내에서 발송할 시 마케팅 수수료 0원으로 전액 무료 마케팅이 가능합니다.' },
    { q: 'Q. 여러 매장이나 프랜차이즈 지점을 한 번에 운영할 수 있나요?', a: '네, 가능합니다. 프랜차이즈 본사나 다수 지점을 소유하신 사장님들을 위해 Enterprise 플랜을 준비해 두었습니다. 마스터 비밀코드(기본 9999)를 통해 전체 매장 현황을 스위칭 제어할 수 있어, 본사 브랜드 관리 및 지점별 룰렛 운영 지표를 한눈에 모니터링하기에 가장 완벽한 대시보드를 제공합니다.' },
    { q: 'Q. 정말 가맹점 간 데이터 격리가 안전하게 보장되나요?', a: '네, 이벤트룰렛은 검증된 멀티 테넌트(Multi-tenancy) 클라우드 데이터 구조를 채택했습니다. 매장별 고유 ID를 기준으로 데이터베이스의 모든 경로가 수평으로 엄격히 분리 격리 가동되므로, 다른 지점 사장님이 본인의 대시보드 외에 다른 매장의 고객 개인정보나 템플릿, 경품 설정을 조회하거나 편집할 확률은 물리적으로 원천 봉쇄되어 있습니다.' },
    { q: 'Q. 경품이 조기 소진되면 현장에서 사고가 나지 않을까요?', a: '이벤트룰렛은 강력한 실시간 재고 제어 트랜잭션을 실행합니다. 만약 설정된 경품(예: 1등 한우)의 수량이 소진되어 0이 되는 즉시, 시스템이 실시간으로 상태를 감지하여 룰렛 판 당첨 확률 연산에서 해당 경품을 즉시 완전 제외합니다. 이후 모든 당첨 시도는 자동으로 안전 수량이나 꽝/다음 기회에로 분기되므로 현장에서의 과다 당첨 지급 사고 우려가 제로입니다.' },
    { q: 'Q. 도입 신청 후 실제 룰렛 가동까지 세팅 시간은 얼마나 걸리나요?', a: '회원가입 후 최초 설정 완료까지 단 5분이면 충분합니다. 관리자 센터에서 상호명과 매장 브랜드 로고를 등록하고, 준비하신 경품 수량과 대표 당첨 확률을 입력하시면 해당 매장 고유의 고객용 응모 URL과 사장님용 모바일 오피스가 즉시 생성되어 그 즉시 QR 코드를 뽑아 현장에 바로 배치하실 수 있습니다.' },
    // 아래 항목은 숨김 처리 (필요 시 주석 해제하여 복구 가능)
    // { q: 'Q. 이벤트가 완전히 종료된 후 응모자 데이터를 엑셀로 받을 수 있나요?', a: '네, 사장님 관리 센터의 \'고객 관리\' 메뉴를 통해 기간별 전체 응모자 정보 및 당첨 결과를 안전하게 모니터링할 수 있습니다. (※ 엑셀 다운로드 버튼과 기능은 주인님의 서비스 개발 계획에 따라 화면 UI에 주석 보존 처리되어 있어, 차후 고도화 배포 시 즉각 안전하게 활성화됩니다.)' }
  ];

  const pricing = [
    { name: 'Starter', price: '월 19,000원', popular: false, features: ['1개 매장 운영', '기본 룰렛 이벤트 기능', '고객 응모 내역 조회 (7일)', '모바일 점주 관리실', '이메일 기술 지원'] },
    { name: 'Pro Gold', price: '월 39,000원', popular: true, features: ['1개 매장 운영', '실시간 경품 재고 자동 차감', '고객 응모 내역 조회 (1년)', '모바일 점주 관리실 (전체 기능)', '공지사항 관리 및 템플릿', 'SMS 직발송 (수수료 0원)', '24시간 카카오톡 실시간 지원'] },
    { name: 'Enterprise', price: '별도 협의', popular: false, features: ['무제한 매장 통합 운영', '프랜차이즈 지점별 독립 관리', '전용 도메인 개별 세팅', '영구 응모 로그 보존 + 엑셀 다운로드', '대량 SMS 게이트웨이 커스텀 연동', '지정 기술 엔지니어 밀착 케어'] }
  ];

  // 앵커 스크롤 헬퍼
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    const nav = document.querySelector('.v2-nav');
    if (!el) return;
    const navH = nav ? nav.getBoundingClientRect().height : 0;
    const top = el.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <div className="v2-root">
      <div className="v2-glow" />

      {/* ── 모달 ── */}
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

      {/* ── [1] 헤더 ── */}
      <nav className="v2-nav">
        <div className="v2-nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="v2-nav-logo-icon">🎡</span>
          <span className="v2-nav-logo-text">이벤트 룰렛</span>
        </div>
        <div className="v2-nav-links">
          {/* 각 버튼: activeSection과 일치하면 v2-nav-link--active 클래스 추가 */}
          <button className={`v2-nav-link ${activeSection === 'hero' ? 'v2-nav-link--active' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>서비스 소개</button>
          <button className={`v2-nav-link ${activeSection === 'cases' ? 'v2-nav-link--active' : ''}`} onClick={() => scrollToSection('cases')}>활용사례</button>
          <button className={`v2-nav-link ${activeSection === 'functions' ? 'v2-nav-link--active' : ''}`} onClick={() => scrollToSection('functions')}>핵심기능</button>
          <button className={`v2-nav-link ${activeSection === 'pricing' ? 'v2-nav-link--active' : ''}`} onClick={() => scrollToSection('pricing')}>요금제</button>
          <button className={`v2-nav-link ${activeSection === 'faq' ? 'v2-nav-link--active' : ''}`} onClick={() => scrollToSection('faq')}>FAQ</button>
        </div>
      </nav>

      {/* ── [2] 히어로 ── */}
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

          {/* 워크플로우 */}
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

      {/* ── [4] 업종별 활용 사례 ── */}
      <section id="cases" className="v2-section">
        <div className="v2-section-header">
          <h2 className="v2-section-title">🏪 우리 매장 업종에 딱 맞는 스마트 도입안</h2>
          {/* 설명 텍스트: 완전 인라인 스타일로 중앙 정렬 보장 */}
          <p style={{ color: '#a3a3a3', fontSize: '0.875rem', lineHeight: '1.7', textAlign: 'center', marginTop: '0.5rem' }}>매장 특성에 적합한 룰렛 이벤트 기획으로 단골 고객 확보와 객단가 향상 효과를 동시에 경험하세요.</p>
        </div>
        <div className="v2-grid-4">
          {caseStudies.map((cs, idx) => (
            <div key={idx} className="v2-case-card">
              <div>
                <h3 className={`v2-case-title ${cs.colorClass}`}>{cs.title}</h3>
                {/* goal 텍스트: <br/> 태그 포함 HTML 렌더링 */}
                <p className="v2-case-goal" dangerouslySetInnerHTML={{ __html: `🎯 ${cs.goal}` }} />
                <p className="v2-case-desc" style={{ marginBottom: '2.5rem' }}>{cs.desc}</p>
              </div>
              <div>
                <div className="v2-case-prize">
                  <span className="v2-case-prize-label">🎁 추천 경품 설계</span>
                  <span className="v2-case-prize-text">{cs.prize}</span>
                </div>
                <button className="v2-case-btn" style={{ display: 'none' }} onClick={() => navigate('/dine-event/event')}>데모 보기 ➔</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── [6] 핵심 기술 ── */}
      <section id="functions" className="v2-section-narrow">
        <div className="v2-section-header" style={{ marginBottom: '2rem' }}>
          <h2 className="v2-section-title-sm">🛠️ 매장 운영을 위한 핵심 테크놀로지</h2>
          <p className="v2-section-desc-sm">현장 집객과 마케팅의 안정성을 위해 완벽하게 작동하는 고급 사양 기술들</p>
        </div>
        <div className="v2-grid-3">
          {coreFeatures.map((feat, idx) => (
            <div key={idx} className="v2-feat-card">
              {/* 상단 일러스트 이미지 영역 */}
              <div className="v2-feat-img-wrap">
                <img src={feat.image} alt={feat.title} className="v2-feat-img" />
                <span className="v2-feat-badge v2-feat-badge--overlay">{feat.badge}</span>
              </div>
              <div className="v2-feat-body">
                <h3 className="v2-feat-title">{feat.title}</h3>
                <p className="v2-feat-desc">{feat.desc}</p>
              </div>
              <div className="v2-feat-benefit">
                <span>✦ 도입 이점:</span>
                <span className="v2-feat-benefit-text">실질적 비용 절감 및 무결점 관리</span>
              </div>
            </div>
          ))}
        </div>

        {/* 핵심기능 하단 배너 이미지 — 사용자 제공 이미지 */}
        <div className="v2-feat-banner-wrap">
          <img
            src="/feat_banner.png"
            alt="핵심기능 배너"
            className="v2-feat-banner-img"
          />
        </div>
      </section>

      {/* ── [7] 요금제 ── */}
      <section id="pricing" className="v2-pricing">
        <div className="v2-section-header">
          <h2 className="v2-section-title">💵 합리적인 요금제 안내</h2>
          <p className="v2-section-desc" style={{ maxWidth: 'none', textAlign: 'center' }}>가입 및 위약금 걱정 없는 가벼운 월 구독 형태</p>
        </div>
        <div className="v2-pricing-grid">
          {pricing.map((plan, idx) => (
            <div key={idx} className={`v2-price-card ${plan.popular ? 'v2-price-card--popular' : ''}`}>
              {plan.popular && <div className="v2-price-ribbon">BEST Choice</div>}
              <div>
                <h3 className="v2-price-name">{plan.name}</h3>
                <div className="v2-price-amount">{plan.price}</div>
                <ul className="v2-price-features">
                  {plan.features.map((f, i) => (
                    <li key={i} className="v2-price-feature">
                      <span className="v2-price-check">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <a href="mailto:contact@dntprbs-roulette.com"
                 className={`v2-price-cta ${plan.popular ? 'v2-price-cta--gold' : ''}`}>
                상담 및 신청하기
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── [8] FAQ ── */}
      <section id="faq" className="v2-faq">
        <div className="v2-section-header">
          <h2 className="v2-section-title">🤔 사장님 질문 FAQ</h2>
          <p className="v2-section-desc" style={{ maxWidth: 'none', textAlign: 'center' }}>요금제, 보안 정책 및 실시간 연동에 관한 핵심 질문에 명쾌하게 대답해 드립니다.</p>
        </div>
        <div className="v2-faq-list">
          {faqList.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className={`v2-faq-item ${isOpen ? 'v2-faq-item--open' : ''}`}>
                <div className="v2-faq-question" onClick={() => setActiveFaq(isOpen ? null : idx)}>
                  <span className="v2-faq-q-text">{faq.q}</span>
                  <span className="v2-faq-arrow">▼</span>
                </div>
                <div className={`v2-faq-answer ${isOpen ? 'v2-faq-answer--open' : ''}`}>
                  <p className="v2-faq-a-text">{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── [9] 최종 CTA ── */}
      <section className="v2-cta-section">
        <div className="v2-cta-box">
          <div className="v2-cta-glow" />
          <h2 className="v2-cta-title">이벤트룰렛과 함께 매출 성장을 시작해보세요</h2>
          <p className="v2-cta-desc">단 5분이면 매장만의 응모 이벤트 룰렛을 구축하여 현장 대기 트래픽을 단골 고객으로 전환할 수 있습니다.</p>
        </div>
      </section>

      {/* ── [10] 푸터 ── */}
      <footer className="v2-footer">
        <div className="v2-footer-inner">
          <div>
            <div className="v2-footer-logo">
              <span>🎡</span>
              <span>이벤트 룰렛</span>
            </div>
            <p className="v2-footer-text">오프라인 매장의 효율적인 스마트 마케팅을 위한 독립 테넌트 기반의 안전한 룰렛 솔루션</p>
          </div>
          <div>
            <h4 className="v2-footer-contact-title">고객지원</h4>
            <p className="v2-footer-contact-text">
              대표메일: contact@dntprbs-roulette.com<br/>
              고객센터: 1544-0000 (평일 10시~18시)
            </p>
          </div>
        </div>
        <div className="v2-footer-bottom">
          <span>© {new Date().getFullYear()} 주식회사 이벤트룰렛. All rights reserved.</span>
          <span className="v2-footer-gold">✦ Premium Gold SaaS V2 Edition</span>
        </div>
      </footer>
    </div>
  );
};

export default CompanyIntroV2;
