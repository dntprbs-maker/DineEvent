import { useState } from 'react';
import '../CompanyIntroV2.css';

/**
 * FaqSection — 자주 묻는 질문 (아코디언)
 * 라우트: /intro/faq
 */

// FAQ 데이터
const faqList = [
  {
    q: 'Q. 마케팅 문자 발송 비용은 어떻게 처리되나요?',
    a: '이벤트룰렛은 비싼 문자 대량 발송 중계 서버를 거치지 않습니다. 점주 관리실에서 원하는 당첨 그룹을 필터링한 후, 사장님 스마트폰의 기본 SMS 앱 전송 환경으로 번호 목록과 내용을 전달합니다. 따라서 추가적인 대행 수수료가 전혀 없으며, 사장님 휴대폰 요금제의 기본 무료 문자 범위 내에서 발송할 시 마케팅 수수료 0원으로 전액 무료 마케팅이 가능합니다.'
  },
  {
    q: 'Q. 여러 매장이나 프랜차이즈 지점을 한 번에 운영할 수 있나요?',
    a: '네, 가능합니다. 프랜차이즈 본사나 다수 지점을 소유하신 사장님들을 위해 Enterprise 플랜을 준비해 두었습니다. 마스터 비밀코드(기본 9999)를 통해 전체 매장 현황을 스위칭 제어할 수 있어, 본사 브랜드 관리 및 지점별 룰렛 운영 지표를 한눈에 모니터링하기에 가장 완벽한 대시보드를 제공합니다.'
  },
  {
    q: 'Q. 정말 가맹점 간 데이터 격리가 안전하게 보장되나요?',
    a: '네, 이벤트룰렛은 검증된 멀티 테넌트(Multi-tenancy) 클라우드 데이터 구조를 채택했습니다. 매장별 고유 ID를 기준으로 데이터베이스의 모든 경로가 수평으로 엄격히 분리 격리 가동되므로, 다른 지점 사장님이 본인의 대시보드 외에 다른 매장의 고객 개인정보나 템플릿, 경품 설정을 조회하거나 편집할 확률은 물리적으로 원천 봉쇄되어 있습니다.'
  },
  {
    q: 'Q. 경품이 조기 소진되면 현장에서 사고가 나지 않을까요?',
    a: '이벤트룰렛은 강력한 실시간 재고 제어 트랜잭션을 실행합니다. 만약 설정된 경품(예: 1등 한우)의 수량이 소진되어 0이 되는 즉시, 시스템이 실시간으로 상태를 감지하여 룰렛 판 당첨 확률 연산에서 해당 경품을 즉시 완전 제외합니다. 이후 모든 당첨 시도는 자동으로 안전 수량이나 꽝/다음 기회에로 분기되므로 현장에서의 과다 당첨 지급 사고 우려가 제로입니다.'
  },
  {
    q: 'Q. 도입 신청 후 실제 룰렛 가동까지 세팅 시간은 얼마나 걸리나요?',
    a: '회원가입 후 최초 설정 완료까지 단 5분이면 충분합니다. 관리자 센터에서 상호명과 매장 브랜드 로고를 등록하고, 준비하신 경품 수량과 대표 당첨 확률을 입력하시면 해당 매장 고유의 고객용 응모 URL과 사장님용 모바일 오피스가 즉시 생성되어 그 즉시 QR 코드를 뽑아 현장에 바로 배치하실 수 있습니다.'
  }
];

const FaqSection = () => {
  // 현재 열려있는 FAQ 항목 인덱스 관리
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <section id="faq" className="v2-faq" style={{ paddingTop: '100px' }}>
      <div className="v2-section-header">
        <h2 className="v2-section-title">🤔 사장님 질문 FAQ</h2>
        <p className="v2-section-desc" style={{ maxWidth: 'none', textAlign: 'center' }}>
          요금제, 보안 정책 및 실시간 연동에 관한 핵심 질문에 명쾌하게 대답해 드립니다.
        </p>
      </div>

      <div className="v2-faq-list">
        {faqList.map((faq, idx) => {
          const isOpen = activeFaq === idx;
          return (
            <div key={idx} className={`v2-faq-item ${isOpen ? 'v2-faq-item--open' : ''}`}>
              {/* 질문 클릭 시 열기/닫기 토글 */}
              <div
                className="v2-faq-question"
                onClick={() => setActiveFaq(isOpen ? null : idx)}
              >
                <span className="v2-faq-q-text">{faq.q}</span>
                <span className="v2-faq-arrow">▼</span>
              </div>
              {/* 답변 아코디언 (CSS max-height 전환) */}
              <div className={`v2-faq-answer ${isOpen ? 'v2-faq-answer--open' : ''}`}>
                <p className="v2-faq-a-text">{faq.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FaqSection;
