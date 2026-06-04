import '../CompanyIntroV2.css';


/**
 * PricingSection — 요금제 안내
 * 라우트: /intro/pricing
 */

// 요금제 데이터
const pricing = [
  {
    name: 'Starter',
    price: '월 19,000원',
    popular: false,
    features: [
      '1개 매장 운영',
      '기본 룰렛 이벤트 기능',
      '고객 응모 내역 조회 (7일)',
      '모바일 점주 관리실',
      '이메일 기술 지원'
    ]
  },
  {
    name: 'Pro Gold',
    price: '월 39,000원',
    popular: true,
    features: [
      '1개 매장 운영',
      '실시간 경품 재고 자동 차감',
      '고객 응모 내역 조회 (1년)',
      '모바일 점주 관리실 (전체 기능)',
      '공지사항 관리 및 템플릿',
      'SMS 직발송 (수수료 0원)',
      '24시간 카카오톡 실시간 지원'
    ]
  },
  {
    name: 'Enterprise',
    price: '별도 협의',
    popular: false,
    features: [
      '무제한 매장 통합 운영',
      '프랜차이즈 지점별 독립 관리',
      '전용 도메인 개별 세팅',
      '영구 응모 로그 보존 + 엑셀 다운로드',
      '대량 SMS 게이트웨이 커스텀 연동',
      '지정 기술 엔지니어 밀착 케어'
    ]
  }
];

const PricingSection = () => {
  return (
    <section id="pricing" className="v2-pricing" style={{ paddingTop: '100px' }}>
      <div className="v2-section-header">
        <h2 className="v2-section-title">💵 합리적인 요금제 안내</h2>
        <p className="v2-section-desc" style={{ maxWidth: 'none', textAlign: 'center' }}>
          가입 및 위약금 걱정 없는 가벼운 월 구독 형태
        </p>
      </div>

      <div className="v2-pricing-grid">
        {pricing.map((plan, idx) => (
          <div key={idx} className={`v2-price-card ${plan.popular ? 'v2-price-card--popular' : ''}`}>
            {/* 인기 플랜 리본 */}
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
            <a
              href="mailto:contact@dntprbs-roulette.com"
              className={`v2-price-cta ${plan.popular ? 'v2-price-cta--gold' : ''}`}
            >
              상담 및 신청하기
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingSection;
