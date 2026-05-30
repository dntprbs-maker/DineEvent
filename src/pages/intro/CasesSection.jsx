import React from 'react';
import '../CompanyIntroV2.css';

/**
 * CasesSection — 업종별 활용 사례
 * 라우트: /intro/cases
 */

// 활용 사례 데이터
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

const CasesSection = () => {
  return (
    <section id="cases" className="v2-section" style={{ paddingTop: '100px' }}>
      <div className="v2-section-header">
        <h2 className="v2-section-title">🏪 우리 매장 업종에 딱 맞는 스마트 도입안</h2>
        <p style={{ color: '#a3a3a3', fontSize: '0.875rem', lineHeight: '1.7', textAlign: 'center', marginTop: '0.5rem' }}>
          매장 특성에 적합한 룰렛 이벤트 기획으로 단골 고객 확보와 객단가 향상 효과를 동시에 경험하세요.
        </p>
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
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CasesSection;
