import '../CompanyIntroV2.css';


/**
 * FunctionsSection — 핵심 기술 & 기능 소개
 * 라우트: /intro/functions
 */

// 핵심 기능 데이터
const coreFeatures = [
  {
    icon: '🔒', badge: '보안 격리 보장',
    image: '/feat_security.png',
    title: '가맹점별 독립 데이터 운영',
    desc: '각 매장의 이벤트 정보, 경품 재고 수량, 당첨자 개인 정보 등이 고유의 tenantId로 암호화 격리 저장되므로 가맹점 간 데이터 무단 침범을 원천 격리합니다.'
  },
  {
    icon: '🎁', badge: '트랜지션 재고 제어',
    image: '/feat_inventory.png',
    title: '실시간 경품 재고 실시간 차감',
    desc: '룰렛 회전 완료 시점 Firestore 트랜잭션이 작동하여 실시간으로 수량을 1씩 즉각 차감하며, 남은 재고가 0이 되면 자동으로 꽝 처리되어 당첨 오류를 방지합니다.'
  },
  {
    icon: '📱', badge: '추가 앱 무설치',
    image: '/feat_mobile.png',
    title: '무필터 점주용 모바일 오피스',
    desc: '사장님과 고객 모두 귀찮은 모바일 앱을 다운로드할 필요가 전혀 없습니다. 모바일 브라우저에서 사장님 전용 관리 화면에 접속해 100% 무결한 제어가 가능합니다.'
  },
  {
    icon: '💬', badge: '마케팅 비용 0원',
    image: '/feat_sms.png',
    title: '메시지 발송 수수료 완전 제로',
    desc: '통합 수집된 당첨자 휴대폰 목록을 사장님 스마트폰 기본 SMS 전송 환경으로 즉각 매핑하여 직발송하므로, 비싼 대량 발송 대행업체 수수료를 100% 절감합니다.'
  },
  {
    icon: '📋', badge: '실시간 편집 지원',
    image: '/feat_notice.png',
    title: '공지사항 & 이벤트 템플릿 관리',
    desc: '매장의 새로운 소식이나 룰렛 이벤트 문구를 스마트폰 클릭 몇 번으로 즉시 수정할 수 있으며, 수정 즉시 고객들이 접속하는 이벤트 화면에 1초 만에 자동 배포됩니다.'
  },
  {
    icon: '📊', badge: '고품격 보고서',
    image: '/feat_report.png',
    title: '실시간 응모 로그 및 통계 리포트',
    desc: '어떤 고객이 몇 시 몇 분에 응모했고 어떤 경품에 당첨되었는지 모든 데이터를 실시간 타임라인 로그로 확인 가능하며 매장의 마케팅 인사이트 지표로 활용할 수 있습니다.'
  }
];

const FunctionsSection = () => {
  return (
    <section id="functions" className="v2-section-narrow" style={{ paddingTop: '100px' }}>
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
    </section>
  );
};

export default FunctionsSection;
