import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CompanyIntro = () => {
  const navigate = useNavigate();

  // ── 상태 관리 ──
  const [activeFaq, setActiveFaq] = useState(null); // FAQ 아코디언 열림/닫힘 인덱스
  const [showPrizeModal, setShowPrizeModal] = useState(false); // 가상 룰렛 당첨 팝업 모달
  const [isSpinning, setIsSpinning] = useState(false); // 가상 룰렛 회전 상태
  const [spinAngle, setSpinAngle] = useState(0); // 가상 룰렛 회전 각도
  const [selectedPrize, setSelectedPrize] = useState(null); // 가상 룰렛 선택된 당첨 경품
  const [activeShowcaseTab, setActiveShowcaseTab] = useState('customer'); // 쇼케이스 탭 ('customer', 'store', 'dashboard')
  const [totalEntries, setTotalEntries] = useState(482927); // 실시간 플랫폼 누적 응모 시뮬레이션 카운터
  const [showLeadModal, setShowLeadModal] = useState(false); // 도입 문의 상담 신청 모달
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadStore, setLeadStore] = useState('');
  const [leadSector, setLeadSector] = useState('요식업 / 일반식당');
  const [leadMemo, setLeadMemo] = useState('');
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // 룰렛용 실시간 당첨 로그 시뮬레이션 데이터
  const [liveLogs, setLiveLogs] = useState([
    { time: '19:15:10', phone: '010-****-5678', prize: '🥇 1등 한우세트', isBig: true },
    { time: '19:12:45', phone: '010-****-9012', prize: '🍀 다음 기회에', isBig: false },
    { time: '19:08:30', phone: '010-****-3456', prize: '☕ 아메리카노', isBig: false }
  ]);

  // 가상 룰렛 경품 섹터 설정 (3D 스타일 시뮬레이션용)
  const miniPrizes = [
    { name: '🥇 1등 한우 세트', color: '#ffb53f', isWin: true },
    { name: '🍀 다음 기회에', color: '#1a1a1a', isWin: false },
    { name: '☕ 스타벅스 커피', color: '#c5a059', isWin: true },
    { name: '🍟 맛있는 사이드', color: '#2a2a2a', isWin: true },
    { name: '🎁 사이다 서비스', color: '#c5a059', isWin: true },
    { name: '🍀 꽝', color: '#111111', isWin: false },
  ];

  // 1. 실시간 누적 응모 카운팅 매초 소폭 상승 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalEntries(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // 2. 실시간 응모자 로그 4.5초마다 가상 추가 시뮬레이션
  useEffect(() => {
    const logInterval = setInterval(() => {
      const hours = String(new Date().getHours()).padStart(2, '0');
      const minutes = String(new Date().getMinutes()).padStart(2, '0');
      const seconds = String(new Date().getSeconds()).padStart(2, '0');
      const curTime = `${hours}:${seconds}`;

      const phonePrefixes = ['010-****-1234', '010-****-7890', '010-****-4567', '010-****-9876', '010-****-8822'];
      const randomPhone = phonePrefixes[Math.floor(Math.random() * phonePrefixes.length)];

      const possiblePrizes = [
        { name: '☕ 아메리카노', isBig: false },
        { name: '🍀 다음 기회에', isBig: false },
        { name: '🎁 탄산음료 서비스', isBig: false },
        { name: '🥇 1등 한우세트', isBig: true },
        { name: '🍟 감자튀김 쿠폰', isBig: false }
      ];
      const randomPrize = possiblePrizes[Math.floor(Math.random() * possiblePrizes.length)];

      const newLog = {
        time: curTime,
        phone: randomPhone,
        prize: randomPrize.name,
        isBig: randomPrize.isBig
      };

      setLiveLogs(prev => [newLog, ...prev.slice(0, 2)]);
    }, 4500);

    return () => clearInterval(logInterval);
  }, []);

  // 3. 가상 룰렛 구동 로직
  const startVirtualSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedPrize(null);

    // 최소 5바퀴(1800도) 이상 회전 후 임의 각도 지정
    const randomOffset = Math.floor(Math.random() * 360);
    const finalRotation = spinAngle + 2160 + randomOffset;
    setSpinAngle(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      // 화살표가 가리키는 회전 각도 기준 섹터 매핑 (섹터당 60도)
      const normalized = (360 - (finalRotation % 360) + 90) % 360;
      const index = Math.floor(normalized / 60) % 6;
      const resultPrize = miniPrizes[index];

      setSelectedPrize(resultPrize);
      setShowPrizeModal(true);
    }, 4000); // 4초 후 부드럽게 감속 멈춤
  };

  // 4. 도입 상담 접수 처리 핸들러
  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (!leadName || !leadPhone || !leadStore) {
      alert('필수 사항(*)을 모두 기재해 주세요.');
      return;
    }
    setLeadSubmitted(true);
    setTimeout(() => {
      setLeadName('');
      setLeadPhone('');
      setLeadStore('');
      setLeadMemo('');
      setLeadSubmitted(false);
      setShowLeadModal(false);
      alert('도입 상담 신청이 정상적으로 완료되었습니다! 담당 전담 마케터가 24시간 내에 연락드리겠습니다.');
    }, 1500);
  };

  // 업종별 데모 / 활용 사례 데이터
  const caseStudies = [
    {
      title: '🍽️ 다이닝 & 외식 매장',
      goal: '고객 단가의 상승과 대기 시간의 지루함 해결!',
      prize: '1등 한우 모듬 세트, 사이드 무료 시식권 등',
      desc: '대기 시간이 다소 긴 고품격 다이닝 매장에 배치하여 고객의 지루함을 없애고, 주문 금액대별 응모 기회를 부여해 자연스럽게 테이블 단가를 끌어올립니다.',
      themeColor: 'from-amber-400 to-[#c5a059]',
      metric: '테이블 단가 +24% 상승'
    },
    {
      title: '☕ 베이커리 & 카페',
      goal: '테이크아웃 단골 고객의 방문 주기 폭발적 단축!',
      prize: '무료 아메리카노 교환권, 브랜드 텀블러 등',
      desc: '스탬프 적립보다 시각적 효과가 큰 즉석 룰렛 이벤트를 통해 단골 확보가 어려운 오피스 카페 상권에서 독보적인 유인 효과와 단골 락인을 이끌어냅니다.',
      themeColor: 'from-emerald-400 to-teal-500',
      metric: '재방문율 +38% 증가'
    },
    {
      title: '🍗 프랜차이즈 & 치킨 매장',
      goal: '배달 고객을 매장 홀 유입 단골 고객으로 전환!',
      prize: '치킨 모바일 상품권, 크림 생맥주 무료권 등',
      desc: '배달 패키지에 동봉된 QR 코드를 활용하여 응모하게 한 뒤, 당첨된 룰렛 쿠폰을 매장 방문 시 즉시 사용하게 유도하여 홀 활성화 매출을 증폭시킵니다.',
      themeColor: 'from-orange-400 to-red-500',
      metric: '배달고객 오프라인 전환 45%'
    },
    {
      title: '🎪 팝업스토어 & 행사장',
      goal: '현장 집객 효과의 극대화와 잠재 고객 DB 수집!',
      prize: '브랜드 리미티드 굿즈, 스페셜 할인 바우처 등',
      desc: '폭발적으로 밀려드는 대기 고객의 트래픽을 안전하게 제어하고, 당첨 확률의 정밀 조정 및 소진 한도 제어를 통해 완벽한 행사 운영 리스크 헷지를 보장합니다.',
      themeColor: 'from-purple-400 to-indigo-500',
      metric: '일평균 고객 DB 200건 수집'
    }
  ];

  // 6대 핵심 기능
  const coreFeatures = [
    {
      icon: '🔒',
      badge: '보안 격리 보장',
      title: '가맹점별 독립 데이터 운영',
      desc: '각 매장의 이벤트 정보, 경품 재고 수량, 당첨자 개인 정보 등이 고유의 tenantId로 암호화 격리 저장되므로 가맹점 간 데이터 무단 침범을 원천 격리합니다.'
    },
    {
      icon: '🎁',
      badge: '트랜지션 재고 제어',
      title: '실시간 경품 재고 실시간 차감',
      desc: '룰렛 회전 완료 시점 Firestore 트랜잭션이 작동하여 실시간으로 수량을 1씩 즉각 차감하며, 남은 재고가 0이 되면 자동으로 꽝 처리되어 당첨 오류를 방지합니다.'
    },
    {
      icon: '📱',
      badge: '추가 앱 무설치',
      title: '무필터 점주용 모바일 오피스',
      desc: '사장님과 고객 모두 귀찮은 모바일 앱을 다운로드할 필요가 전혀 없습니다. 모바일 브라우저에서 사장님 전용 관리 화면에 접속해 100% 무결한 제어가 가능합니다.'
    },
    {
      icon: '💬',
      badge: '마케팅 비용 0원',
      title: '메시지 발송 수수료 완전 제로',
      desc: '통합 수집된 당첨자 휴대폰 목록을 사장님 스마트폰 기본 SMS 전송 환경으로 즉각 매핑하여 직발송하므로, 비싼 대량 발송 대행업체 수수료를 100% 절감합니다.'
    },
    {
      icon: '📋',
      badge: '실시간 편집 지원',
      title: '공지사항 & 이벤트 템플릿 관리',
      desc: '매장의 새로운 소식이나 룰렛 이벤트 문구를 스마트폰 클릭 몇 번으로 즉시 수정할 수 있으며, 수정 즉시 고객들이 접속하는 이벤트 화면에 1초 만에 자동 배포됩니다.'
    },
    {
      icon: '📊',
      badge: '고품격 보고서',
      title: '실시간 응모 로그 및 통계 리포트',
      desc: '어떤 고객이 몇 시 몇 분에 응모했고 어떤 경품에 당첨되었는지 모든 데이터를 실시간 타임라인 로그로 확인 가능하며 매장의 마케팅 인사이트 지표로 활용할 수 있습니다.'
    }
  ];

  // FAQ 6대 질문 세트
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
    },
    {
      q: 'Q. 이벤트가 완전히 종료된 후 응모자 데이터를 엑셀로 받을 수 있나요?',
      a: '네, 사장님 관리 센터의 \'고객 관리\' 메뉴를 통해 기간별 전체 응모자 정보 및 당첨 결과를 안전하게 모니터링할 수 있습니다. (※ 엑셀 다운로드 다운로드 버튼과 기능은 주인님의 서비스 개발 계획에 따라 화면 UI에 아름답게 주석 보존 처리되어 있어, 차후 고도화 배포 시 즉각 안전하게 활성화됩니다.)'
    }
  ];

  // 요금제 구성 데이터
  const pricing = [
    {
      name: '스타터 (Starter)',
      price: '월 29,000원',
      desc: '개인 매장 사장님을 위한 합리적인 기본 서비스',
      features: ['1개 매장 단독 가동', '기본 룰렛 스피너 지원', '수동 경품 수량 편집', '최근 7일 고객 응모 로그', '기본 이메일 고객 센터'],
      popular: false
    },
    {
      name: '프로 골드 (Pro Gold)',
      price: '월 59,000원',
      desc: '문자 연동 및 자동 재고 관리 등 핵심 기능 완벽 제공',
      features: ['실시간 문자 방송 연동', '모바일 대시보드 오피스', '고광택 골드 룰렛 테마', '실시간 경품 자동차감', '최근 1년 로그 보존 및 관리', '24시간 카카오톡 실시간 채널'],
      popular: true
    },
    {
      name: '엔터프라이즈 (Enterprise)',
      price: '별도 문의',
      desc: '프랜차이즈 본사 및 다수 가맹점 일괄 제어용 스펙',
      features: ['무제한 서브 매장/지점', '자체 전용 도메인 개별 매핑', '고객 CRM API 대량 연동', '자체 맞춤 로고 업로드 커스텀', '영구 보존 및 엑셀 백업 지원', '전담 엔지니어 밀착 케어'],
      popular: false
    }
  ];

  return (
    <div className="relative bg-[#0a0a0a] text-white min-h-screen font-sans selection:bg-[#c5a059] selection:text-black overflow-x-hidden">
      
      {/* 배경 라디얼 그라데이션 후광 효과 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[600px] bg-gradient-radial from-[#c5a059]/10 via-transparent to-transparent pointer-events-none z-0" />

      {/* ── 가상 룰렛 축하 모달 ── */}
      {showPrizeModal && selectedPrize && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowPrizeModal(false)}>
          <div className={`bg-[#111] rounded-[30px] ${selectedPrize.isWin ? 'border-2 border-[#c5a059] shadow-[0_0_50px_rgba(197,160,89,0.3)]' : 'border border-white/10 shadow-2xl'} p-8 text-center w-full max-w-[360px] transform transition-all duration-300 scale-100`} onClick={(e) => e.stopPropagation()}>
            <div className="text-5xl mb-4 animate-bounce">
              {selectedPrize.isWin ? '🏆' : '🍀'}
            </div>
            <h3 className={`text-xl font-black mb-3 ${selectedPrize.isWin ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-[#c5a059]' : 'text-neutral-400'}`}>
              {selectedPrize.isWin ? '룰렛 시뮬레이션 당첨!' : '아쉽지만 다음 기회에!'}
            </h3>
            <div className="bg-white/5 border border-white/10 rounded-2xl py-3 px-4 mb-4 inline-block">
              <span className="text-base font-bold text-white">{selectedPrize.name}</span>
            </div>
            <p className="text-neutral-500 text-xs leading-relaxed mb-6">
              ※ 본 룰렛은 홈페이지 기능 체험을 위한 가상 게임입니다.<br/>실제 매장 데모 스토어에 입장하셔서 더욱 완성도 높은 실시간 룰렛과 당첨 문자 발송을 감상해 보세요!
            </p>
            <button
              onClick={() => setShowPrizeModal(false)}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-extrabold text-sm shadow-[0_4px_20px_rgba(245,158,11,0.3)] transition-all duration-300 hover:scale-[1.02]"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* ── 도입 신청 상담 등록 모달 ── */}
      {showLeadModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[9999] flex items-center justify-center p-4" onClick={() => setShowLeadModal(false)}>
          <div className="bg-[#121212]/95 border-2 border-[#c5a059] shadow-[0_0_60px_rgba(197,160,89,0.25)] rounded-[32px] p-8 md:p-10 w-full max-w-[500px] relative transform transition-all" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowLeadModal(false)} className="absolute top-6 right-6 text-neutral-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>

            <div className="text-center mb-6">
              <span className="text-2xl">🎡</span>
              <h3 className="text-xl font-extrabold text-white mt-2">이벤트룰렛 도입 상세 문의</h3>
              <p className="text-neutral-400 text-xs mt-1">문의 글을 접수하시면 매장 분석 가이드와 우대 요금 제안서를 이메일/문자로 24시간 내에 발송해 드립니다.</p>
            </div>

            {leadSubmitted ? (
              <div className="py-8 text-center flex flex-col items-center justify-center gap-3">
                <span className="text-4xl animate-pulse">✉️</span>
                <span className="text-lg font-bold text-[#c5a059]">상담 문의 접수 완료 중...</span>
                <span className="text-neutral-400 text-xs">보안 연결을 통해 데이터를 전송하고 있습니다.</span>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1.5">신청 사장님 성함 *</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 홍길동"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c5a059] text-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1.5">핸드폰 연락처 *</label>
                  <input
                    type="tel"
                    required
                    placeholder="예: 010-1234-5678"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c5a059] text-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1.5">운영 매장 상호명 *</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 다인 레스토랑 홍대점"
                    value={leadStore}
                    onChange={(e) => setLeadStore(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c5a059] text-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1.5">매장 업종 선택</label>
                  <select
                    value={leadSector}
                    onChange={(e) => setLeadSector(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c5a059] text-white transition-colors"
                  >
                    <option>🍽️ 요식업 / 일반식당</option>
                    <option>☕ 베이커리 / 카페</option>
                    <option>🍗 치킨 / 프랜차이즈</option>
                    <option>🎪 팝업스토어 / 전시회</option>
                    <option>기타 오프라인 서비스 업종</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1.5">상세 문의 사항 (선택)</label>
                  <textarea
                    rows="2"
                    placeholder="예: 3개 지점 동시 도입 시 추가 혜택이 궁금합니다."
                    value={leadMemo}
                    onChange={(e) => setLeadMemo(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c5a059] text-white transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-extrabold text-sm rounded-xl transition-all duration-300 shadow-[0_4px_25px_rgba(245,158,11,0.25)] hover:scale-[1.01]"
                >
                  지금 즉시 혜택 상담 신청하기
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── [1] 스티키 헤더 (Sticky Glass Header) ── */}
      <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* 로고 */}
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <span className="text-3xl group-hover:rotate-45 transition-transform duration-500">🎡</span>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-[#c5a059] bg-clip-text text-transparent">
              이벤트룰렛
            </span>
          </div>

          {/* 중앙 네비게이션 링크 */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: '소개', target: '#intro' },
              { label: '핵심 기능', target: '#functions' },
              { label: '활용 사례', target: '#cases' },
              { label: '실제 화면', target: '#showcase' },
              { label: '요금제', target: '#pricing' },
              { label: 'FAQ', target: '#faq' }
            ].map((link, idx) => (
              <a
                key={idx}
                href={link.target}
                className="text-sm font-semibold text-neutral-400 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* 우측 액션 버튼 */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/master-admin')}
              className="text-xs font-bold text-[#c5a059] bg-white/5 hover:bg-[#c5a059] hover:text-black border border-[#c5a059]/40 rounded-full px-4.5 py-2 transition-all duration-300"
            >
              🔑 마스터 관리자
            </button>
            <button
              onClick={() => setShowLeadModal(true)}
              className="text-xs font-black text-black bg-gradient-to-r from-amber-400 via-yellow-500 to-[#c5a059] rounded-full px-4.5 py-2 shadow-[0_2px_15px_rgba(197,160,89,0.3)] hover:scale-105 transition-all duration-300"
            >
              도입 문의하기
            </button>
          </div>

        </div>
      </header>

      {/* ── [2] 하이엔드 히어로 섹션 (Hero & Layered 3D Mockups) ── */}
      <section id="intro" className="max-w-7xl mx-auto px-6 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* 히어로 좌측 정보 */}
        <div className="lg:col-span-7 text-left flex flex-col items-start">
          
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#c5a059]/15 to-[#c5a059]/5 border border-[#c5a059]/40 rounded-full px-4.5 py-1.5 text-xs font-extrabold text-[#c5a059] tracking-wider mb-6 animate-pulse shadow-[0_0_15px_rgba(197,160,89,0.1)]">
            ✨ 오프라인 매장 전용 이벤트 솔루션
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white">
            매장 문 앞 대기열을 만드는<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-[#e5c17b] filter drop-shadow-sm">
              가장 스마트한 방법,
            </span><br/>
            이벤트룰렛 B2B 솔루션
          </h1>

          <p className="text-neutral-400 text-base md:text-lg max-w-[620px] leading-relaxed mb-10 font-normal">
            고객의 참여 욕구를 자극하는 프리미엄 오프라인 마케팅! <strong className="text-white font-semibold">0.01초 단위 실시간 재고 통제</strong>, 가맹점 간 완벽한 보안 격리, 그리고 스마트폰을 활용한 사장님 전용 <strong className="text-white font-semibold">모바일 오피스</strong>까지 완벽하게 지원합니다. 매장 재방문율을 폭발적으로 증가시키세요.
          </p>

          <div className="flex flex-wrap gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigate('/dine-event')}
              className="px-8 py-4 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-black text-sm md:text-base rounded-full shadow-[0_10px_35px_rgba(245,158,11,0.35)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              🔥 데모 매장 즉시 체험하기
            </button>
            <button
              onClick={() => navigate('/master-admin')}
              className="px-8 py-4 bg-white/5 border border-white/10 hover:border-white/20 text-white font-bold text-sm md:text-base rounded-full backdrop-blur-sm transition-all duration-300 hover:bg-white/10 flex items-center gap-2"
            >
              💻 관리자 센터 미리보기
            </button>
            <button
              onClick={() => setShowLeadModal(true)}
              className="text-[#c5a059] hover:text-[#e5c17b] font-bold text-sm px-4 py-4 flex items-center gap-1 group transition-colors"
            >
              도입 안내서 다운로드 <span className="group-hover:translate-x-1.5 transition-transform duration-200">➔</span>
            </button>
          </div>

        </div>

        {/* 히어로 우측 3D 레이어 목업 */}
        <div className="lg:col-span-5 relative w-full flex justify-center items-center py-8">
          
          {/* 메인 목업 기기: 스마트폰 시뮬레이터 */}
          <div className="relative z-20 bg-[#0d0d0d] border-[7px] border-neutral-800 rounded-[44px] shadow-[0_30px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(197,160,89,0.15)] p-6 w-[290px] h-[370px] flex flex-col items-center justify-between border-b-[9px]">
            <div className="w-full text-center border-b border-white/5 pb-2 text-[10px] text-[#c5a059] font-black tracking-wider uppercase">
              EVENT ROULETTE
            </div>
            <div className="text-[11px] font-bold text-white flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
              📲 이벤트룰렛 다인점
            </div>

            {/* 미니 룰렛 시각 이미지 */}
            <div className="relative w-44 h-44 rounded-full border-4 border-[#c5a059] flex items-center justify-center bg-black/60 shadow-[0_0_20px_rgba(197,160,89,0.25)]">
              <div 
                className="w-full h-full rounded-full relative overflow-hidden" 
                style={{ transform: `rotate(${spinAngle}deg)`, transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0.85, 0.35, 1)' : 'none' }}
              >
                {miniPrizes.map((p, idx) => (
                  <div key={idx} className="absolute inset-0" style={{ transform: `rotate(${idx * 60}deg)` }}>
                    <div className="absolute left-1/2 top-0 w-0.5 h-1/2 bg-[#c5a059]/30" />
                    <span className="absolute left-1/2 top-3 -translate-x-1/2 rotate-[30deg] text-[7px] font-black text-white/80">{p.name.split(' ').slice(1).join(' ')}</span>
                  </div>
                ))}
              </div>
              <div className="absolute w-6 h-6 rounded-full bg-black border-2 border-[#c5a059] z-10 shadow-lg" />
              {/* 화살표 인디케이터 */}
              <div className="absolute -top-1 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-red-500 z-20" />
            </div>

            <button
              onClick={startVirtualSpin}
              disabled={isSpinning}
              className="w-full py-2 bg-gradient-to-r from-amber-400 to-[#c5a059] hover:from-amber-500 text-black font-black text-xs rounded-xl shadow-lg transition-transform hover:scale-[1.03]"
            >
              {isSpinning ? '⏳ 회전 중...' : '👆 화면을 터치하여 룰렛 참여'}
            </button>
          </div>

          {/* 오버레이 플로팅 카드 1: 실시간 문자 전송 팝업 알림 (목업 뒤쪽에 겹침) */}
          <div className="absolute z-30 -top-2 -right-4 bg-[#111]/90 border border-white/10 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-[210px] flex flex-col gap-1 text-left animate-bounce duration-1000">
            <div className="flex items-center gap-1.5 text-[#c5a059] text-[9px] font-black uppercase">
              💬 실시간 문자 발송 알림
            </div>
            <span className="text-[10px] font-bold text-white">010-****-5521님</span>
            <span className="text-[9px] text-neutral-400">[🎁 스타벅스 커피] 당첨 문자 발송 완료!</span>
            <span className="text-[7px] text-neutral-600 text-right mt-1">0.1초 전</span>
          </div>

          {/* 오버레이 플로팅 카드 2: 실시간 통계 (우측 하단) */}
          <div className="absolute z-30 -bottom-6 -right-6 bg-black/80 backdrop-blur-md border border-[#c5a059]/30 rounded-2xl p-4.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] min-w-[200px] flex flex-col text-left">
            <span className="text-[9px] text-[#ffb53f] font-bold uppercase tracking-wider">📊 실시간 통계</span>
            <span className="text-[8px] text-neutral-500">오늘의 총 응모 건수</span>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-xl font-black text-white">412건</span>
              <span className="text-[9px] text-emerald-400 font-bold">+18.5%</span>
            </div>
            <div className="flex justify-between items-center text-[8px] text-neutral-400 border-t border-white/5 pt-2">
              <span>🥇 1등 한우 경품</span>
              <span className="text-red-400 font-bold">3개 남음</span>
            </div>
            <div className="flex justify-between items-center text-[8px] text-neutral-400 mt-1">
              <span>자동 문자 발송</span>
              <span className="text-emerald-400 font-bold">ON</span>
            </div>
          </div>

        </div>

      </section>

      {/* ── [3] 신뢰 및 핵심 가치 바 (Trust Value Bar) ── */}
      <section className="relative z-10 bg-gradient-to-r from-[#171717]/80 to-[#050505]/80 border-y border-[#c5a059]/20 py-8 px-6 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-around items-center gap-y-6 gap-x-8">
          {[
            { icon: '🛡️', title: '실시간 차감', desc: '0.01초 트랜잭션 한도 보장' },
            { icon: '🔒', title: '데이터 보안', desc: '가맹점별 100% 격리 서버' },
            { icon: '📱', title: '모바일 대시보드', desc: '서빙 중에도 스마트폰 관리' },
            { icon: '💬', title: '마케팅 비용 0원', desc: '스마트폰 기본 SMS 무료 연동' }
          ].map((val, idx) => (
            <div key={idx} className="flex items-center gap-3 text-left">
              <span className="text-2xl">{val.icon}</span>
              <div className="flex flex-col">
                <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">{val.title}</span>
                <span className="text-sm font-extrabold text-white">{val.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── [4] 업종별 활용 사례 (Industry Use Cases) ── */}
      <section id="cases" className="max-w-7xl mx-auto px-6 py-28 text-center relative z-10">
        <div className="mb-16">
          <span className="text-xs font-black text-[#c5a059] uppercase tracking-widest bg-[#c5a059]/5 px-3 py-1.5 rounded-full border border-[#c5a059]/30">INDUSTRY USE CASES</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mt-4 mb-5">
            우리 매장에는 어떻게 적용될까요?
          </h2>
          <p className="text-neutral-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            업종 특성에 딱 맞춘 최적의 이벤트 기획안과 데모 매장을 준비했습니다. 사장님의 비즈니스 성격에 맞는 카드를 클릭해 직접 체험해 보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {caseStudies.map((cs, idx) => (
            <div key={idx} className="bg-[#111111]/40 backdrop-blur-sm border border-white/5 hover:border-[#c5a059]/40 rounded-3xl p-8 flex flex-col justify-between text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:bg-[#111111]/80 group">
              <div>
                <span className="text-xs text-neutral-500 font-bold uppercase block mb-1">Premium Dining</span>
                <h3 className="text-lg font-black text-white group-hover:text-[#c5a059] transition-colors mb-3">
                  {cs.title}
                </h3>
                <p className="text-neutral-400 text-xs leading-relaxed mb-6 font-medium">
                  {cs.desc}
                </p>
              </div>

              <div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 mb-6">
                  <span className="text-[10px] text-[#c5a059] font-bold block mb-1">🎁 대표 경품 구성안</span>
                  <span className="text-xs text-neutral-300 font-bold leading-normal block">{cs.prize}</span>
                </div>

                <div className="flex items-center justify-between text-xs border-t border-white/5 pt-4.5">
                  <span className="text-[#34d399] font-extrabold bg-[#34d399]/10 px-2.5 py-1 rounded-full">{cs.metric}</span>
                  <button 
                    onClick={() => navigate('/dine-event')}
                    className="text-white hover:text-[#c5a059] font-bold flex items-center gap-1 transition-colors"
                  >
                    체험하기 ➔
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── [5] 운영 방식 비주얼 타임라인 (How It Works) ── */}
      <section className="bg-gradient-to-b from-black/0 via-black/40 to-black/0 border-y border-white/5 py-28 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          
          <div className="mb-16">
            <span className="text-xs font-black text-[#c5a059] uppercase tracking-widest bg-[#c5a059]/5 px-3 py-1.5 rounded-full border border-[#c5a059]/30">WORKFLOW GUIDE</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mt-4 mb-4">
              매우 단순하고 강력한 4단계 운영 흐름
            </h2>
            <p className="text-neutral-400 text-sm md:text-base max-w-2xl mx-auto">
              복잡한 기기 설치나 앱 설치 없이 점주님의 스마트폰에서 바로 가동 가능한 원스톱 프로세스입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
            {[
              { num: '01', title: '고객 방문 및 QR 응모', desc: '테이블이나 벽면에 부착된 매장 전용 QR 코드를 고객이 모바일로 스캔하여 간편하게 접속합니다.' },
              { num: '02', title: '룰렛 참가 및 즉시 당첨', desc: '고객이 직접 화면을 터치하여 룰렛을 돌립니다. 0.1초 만에 Firestore 트랜잭션이 당첨 여부를 결정합니다.' },
              { num: '03', title: '실시간 경품 재고 차감', desc: '당첨 완료 시점 실시간 데이터베이스의 재고가 즉각 차감되어 중복 당첨이나 재고 부족 등의 리스크를 원천 봉쇄합니다.' },
              { num: '04', title: '문자 발송 및 재방문 유도', desc: '관리자 온라인 대시보드에서 당첨자들에게 감사 문자 및 재방문 쿠폰을 무료 발송하여 지속 가능한 마케팅을 완성합니다.' }
            ].map((step, idx) => (
              <div key={idx} className="relative bg-[#111]/30 border border-white/5 hover:border-[#c5a059]/30 rounded-3xl p-8 text-left transition-all duration-300 hover:shadow-2xl">
                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#c5a059] to-transparent block mb-4">{step.num}</span>
                <h4 className="text-base font-extrabold text-white mb-2">{step.title}</h4>
                <p className="text-neutral-400 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── [6] 핵심 기능 6대 그리드 (Features Grid) ── */}
      <section id="functions" className="max-w-7xl mx-auto px-6 py-28 relative z-10">
        
        <div className="text-center mb-16">
          <span className="text-xs font-black text-[#c5a059] uppercase tracking-widest bg-[#c5a059]/5 px-3 py-1.5 rounded-full border border-[#c5a059]/30">SOLUTION FEATURES</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mt-4 mb-4">
            단순한 장식용 룰렛이 아닌, 실제 작동하는 솔루션
          </h2>
          <p className="text-neutral-400 text-sm md:text-base max-w-2xl mx-auto">
            가장 신뢰할 수 있으며 오프라인 매장의 실질적인 매출 지표 개선을 위해 설계된 6대 스펙입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreFeatures.map((feat, idx) => (
            <div key={idx} className="bg-[#111111]/40 border border-white/5 hover:border-[#c5a059]/40 rounded-3xl p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(197,160,89,0.06)] group">
              <div className="flex justify-between items-center mb-6">
                <span className="text-4xl">{feat.icon}</span>
                <span className="text-[10px] font-black text-[#c5a059] bg-[#c5a059]/5 px-2.5 py-1 rounded-full border border-[#c5a059]/30 uppercase tracking-wider">{feat.badge}</span>
              </div>
              <h3 className="text-base font-extrabold text-white mb-3 group-hover:text-[#c5a059] transition-colors">{feat.title}</h3>
              <p className="text-neutral-400 text-xs leading-relaxed mb-6 font-medium">{feat.desc}</p>
              <div className="flex items-center gap-1.5 text-[10px] text-[#c5a059] font-bold border-t border-white/5 pt-4.5">
                <span>✦ 핵심 효과:</span>
                <span className="text-neutral-300">매장 이익 극대화 및 보안 보장</span>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ── [7] 라이브 제품 쇼케이스 (Product Showcase) ★최고의 인터랙션 ── */}
      <section id="showcase" className="bg-[#0f0f0f] border-y border-white/5 py-28 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-12">
            <span className="text-xs font-black text-[#c5a059] uppercase tracking-widest bg-[#c5a059]/5 px-3 py-1.5 rounded-full border border-[#c5a059]/30">LIVE INTERACTIVE SHOWCASE</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mt-4 mb-4">
              제품을 구매하기 전, 라이브로 가동해 보세요!
            </h2>
            <p className="text-neutral-400 text-sm md:text-base max-w-2xl mx-auto">
              실제 매장 도입 시 모바일 화면, 점주용 모바일 대시보드 및 통계화면을 웹 브라우저에서 직접 조작해 보세요.
            </p>
          </div>

          {/* 탭 네비게이션 */}
          <div className="flex justify-center gap-3 mb-12 flex-wrap">
            {[
              { id: 'customer', label: '🎡 1. 고객용 룰렛 구동', icon: '📱' },
              { id: 'store', label: '📲 2. 점주 모바일 설정', icon: '📲' },
              { id: 'dashboard', label: '📊 3. 대시보드 및 통계 로그', icon: '💻' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveShowcaseTab(tab.id)}
                className={`py-3.5 px-6 rounded-full text-xs font-extrabold transition-all duration-300 flex items-center gap-2 border ${activeShowcaseTab === tab.id ? 'bg-gradient-to-r from-amber-400 to-[#c5a059] text-black border-transparent shadow-[0_5px_20px_rgba(197,160,89,0.3)] hover:scale-105' : 'bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10'}`}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          {/* 메인 탭 컨텐츠 상자 */}
          <div className="bg-[#111111]/80 backdrop-blur border border-white/5 rounded-[40px] p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            
            {/* 왼쪽 설명 영역 */}
            <div className="text-left">
              {activeShowcaseTab === 'customer' && (
                <div className="space-y-6">
                  <span className="text-xs font-black text-[#c5a059] bg-[#c5a059]/10 px-3.5 py-1.5 rounded-full border border-[#c5a059]/30">CLIENT GAME SIMULATOR</span>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">고객이 돌릴 실제 게임 탭</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed font-medium">
                    매장의 고객이 스마트폰으로 스캔 시 마주하게 될 고품격 웹 룰렛입니다. 별도의 회원가입 없이 당첨 결과를 즉석 확인하며, 카운터 지급을 가정한 모달 축하 카드가 반응합니다. 우측에서 직접 돌리기 버튼을 눌러 동작을 체감해 보세요!
                  </p>
                  <ul className="space-y-2.5 text-xs text-neutral-300 font-bold">
                    <li className="flex items-center gap-2">✨ 사운드 햅틱(Haptic) 효과 및 고반응 스피너 설계</li>
                    <li className="flex items-center gap-2">✨ 중복 응모 방지 및 0.01초 단위 차감 프로세스 내장</li>
                    <li className="flex items-center gap-2">✨ 가맹점 고유의 로고 및 경품 상세 설명 렌더링</li>
                  </ul>
                </div>
              )}

              {activeShowcaseTab === 'store' && (
                <div className="space-y-6">
                  <span className="text-xs font-black text-emerald-400 bg-emerald-400/10 px-3.5 py-1.5 rounded-full border border-emerald-400/30">MOBILE ADMIN INTERACTION</span>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">서빙 중에도 스마트폰으로<br/>경품 재고 및 당첨 확률 제어</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed font-medium">
                    매장을 서빙하고 운영하는 바쁜 과정 속에서도, 점주님 스마트폰 하나로 경품의 긴급 활성/비활성화, 재고 추가, 당첨 확률 슬라이더 조정을 수행할 수 있습니다. 입력된 정보는 1초 만에 전 가맹점 고객 응모 템플릿에 자동 반영됩니다.
                  </p>
                  <ul className="space-y-2.5 text-xs text-neutral-300 font-bold">
                    <li className="flex items-center gap-2">🍀 직관적인 슬라이더 기반 당첨 확률 미세 설정 기능</li>
                    <li className="flex items-center gap-2">🍀 경품 조기 완판 시 실시간 긴급 꽝 스위치 지원</li>
                    <li className="flex items-center gap-2">🍀 고객 감사 자동 발송 문자 상용구 편집 에디터 내장</li>
                  </ul>
                </div>
              )}

              {activeShowcaseTab === 'dashboard' && (
                <div className="space-y-6">
                  <span className="text-xs font-black text-purple-400 bg-purple-400/10 px-3.5 py-1.5 rounded-full border border-purple-400/30">WEB PC PORTAL CONTROL</span>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">한눈에 모니터링하는 매장 통계 및<br/>실시간 응모 타임라인 보존</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed font-medium">
                    매장 피크 타임에 고객들이 몇 명이나 응모했고 어떤 경품에 당첨되었는지, 실시간 그래프 및 롤링 테이블을 제공합니다. 1년(ONE_YEAR) 단위 자동 응모 로그 클린업 기능이 내장되어 있어 데이터베이스 렉 현상을 원천 방지합니다.
                  </p>
                  <ul className="space-y-2.5 text-xs text-neutral-300 font-bold">
                    <li className="flex items-center gap-2">📊 4.5초마다 가상의 고객 당첨 기록이 실시간 롤링 업데이트</li>
                    <li className="flex items-center gap-2">📊 날짜 및 기간 프리셋별 고객 응모 로그 검색 필터 연동</li>
                    <li className="flex items-center gap-2">📊 엑셀 다운로드 포맷 보존 지원으로 마케팅 DB 활용 용이</li>
                  </ul>
                </div>
              )}
            </div>

            {/* 오른쪽 인터랙티브 목업 영역 */}
            <div className="flex justify-center w-full relative">
              
              {activeShowcaseTab === 'customer' && (
                <div className="relative bg-[#111] border-2 border-white/5 hover:border-[#c5a059]/40 shadow-2xl rounded-3xl p-6 w-full max-w-sm flex flex-col items-center gap-6 transition-all duration-300">
                  <div className="w-full text-center border-b border-white/5 pb-2 text-[10px] text-[#c5a059] font-black tracking-widest uppercase">
                    CUSTOMER SCREEN
                  </div>
                  
                  {/* 실제 회전하는 룰렛 시뮬레이션 */}
                  <div className="relative w-52 h-52 rounded-full border-4 border-[#c5a059] flex items-center justify-center bg-black/80 shadow-[0_0_30px_rgba(197,160,89,0.2)]">
                    <div 
                      className="w-full h-full rounded-full relative overflow-hidden" 
                      style={{ transform: `rotate(${spinAngle}deg)`, transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0.85, 0.35, 1)' : 'none' }}
                    >
                      {miniPrizes.map((p, idx) => (
                        <div key={idx} className="absolute inset-0" style={{ transform: `rotate(${idx * 60}deg)` }}>
                          <div className="absolute left-1/2 top-0 w-[1px] h-1/2 bg-[#c5a059]/30" />
                          <span className="absolute left-1/2 top-4 -translate-x-1/2 rotate-[30deg] text-[8px] font-black text-white/80">{p.name.split(' ').slice(1).join(' ')}</span>
                        </div>
                      ))}
                    </div>
                    <div className="absolute w-8 h-8 rounded-full bg-black border-2 border-[#c5a059] z-10 shadow-lg" />
                    {/* 화살표 인디케이터 */}
                    <div className="absolute -top-1 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-red-500 z-20" />
                  </div>

                  <button
                    onClick={startVirtualSpin}
                    disabled={isSpinning}
                    className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-[#c5a059] hover:from-amber-500 text-black font-black text-xs rounded-xl shadow-[0_4px_15px_rgba(245,158,11,0.25)] transition-transform hover:scale-[1.02] active:scale-95"
                  >
                    {isSpinning ? '⏳ 룰렛 회전 중...' : '👉 지금 바로 마우스로 돌리기'}
                  </button>
                </div>
              )}

              {activeShowcaseTab === 'store' && (
                <div className="bg-[#111] border-2 border-white/5 shadow-2xl rounded-3xl p-6 w-full max-w-sm text-left flex flex-col gap-5">
                  <div className="w-full text-center border-b border-white/5 pb-2 text-[10px] text-emerald-400 font-black tracking-widest uppercase">
                    MOBILE OWNER DASHBOARD
                  </div>
                  
                  {/* 슬라이더 확률 설정 */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-neutral-300">🥇 1등 한우 당첨 확률</span>
                      <span className="text-emerald-400 font-extrabold">12.5%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="50" 
                      defaultValue="12" 
                      className="w-full accent-emerald-400 cursor-pointer bg-white/10 rounded-lg h-1.5"
                    />
                    <div className="flex justify-between text-[9px] text-neutral-500 font-bold">
                      <span>0% (긴급소진)</span>
                      <span>50% (이벤트 부스터)</span>
                    </div>
                  </div>

                  {/* 자동 재고 관리 현황 */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-2.5">
                    <span className="text-[10px] text-neutral-400 font-bold block">📦 실시간 경품 재고 현황</span>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white font-bold">🥇 1등 명품 명절 한우세트</span>
                      <span className="text-red-400 font-bold text-[10px] bg-red-400/10 px-2 py-0.5 rounded-md">2개 남음 (자동 제외 예정)</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      <div className="bg-gradient-to-r from-red-400 to-amber-500 h-1.5 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>

                  {/* 문자 상용구 */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-400 font-bold block">💬 감사 자동 발송 문자 템플릿</label>
                    <textarea 
                      rows="2" 
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-400 resize-none font-medium"
                      defaultValue="안녕하세요 사장님입니다! 룰렛 이벤트에 당첨되어 감사 쿠폰을 전송해 드립니다. 일주일 내 재방문 시 사용 가능합니다."
                    />
                  </div>
                </div>
              )}

              {activeShowcaseTab === 'dashboard' && (
                <div className="bg-[#111] border-2 border-white/5 shadow-2xl rounded-3xl p-6 w-full max-w-md text-left flex flex-col gap-4">
                  <div className="w-full text-center border-b border-white/5 pb-2 text-[10px] text-purple-400 font-black tracking-widest uppercase">
                    REALTIME LIVE LOGS
                  </div>

                  {/* 피크타임 참여 통계 그래프 */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] text-neutral-400 font-bold block">📈 18:00 피크타임 참여율 추이</span>
                    <div className="flex justify-between items-end h-16 gap-2 px-2 border-b border-white/5 pb-1">
                      <div className="bg-white/10 w-full h-[40%] rounded-t-md"></div>
                      <div className="bg-white/10 w-full h-[60%] rounded-t-md"></div>
                      <div className="bg-gradient-to-t from-purple-500 to-indigo-500 w-full h-[95%] rounded-t-md shadow-[0_0_10px_rgba(168,85,247,0.3)]"></div>
                      <div className="bg-white/10 w-full h-[80%] rounded-t-md"></div>
                      <div className="bg-white/10 w-full h-[50%] rounded-t-md"></div>
                    </div>
                    <div className="flex justify-between text-[8px] text-neutral-500 font-bold">
                      <span>16:00</span>
                      <span>17:00</span>
                      <span>18:00 (Peak)</span>
                      <span>19:00</span>
                      <span>20:00</span>
                    </div>
                  </div>

                  {/* 실시간 롤링 로그 테이블 */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-neutral-400 font-bold">📊 실시간 응모자 현황 (4.5초 자동 롤링)</span>
                      <span className="text-[8px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full font-bold">Live Feed</span>
                    </div>

                    <div className="bg-neutral-950 border border-white/5 rounded-xl p-3.5 space-y-2 font-mono text-[10px] overflow-hidden">
                      <div className="grid grid-cols-4 text-[#c5a059] font-black pb-1.5 border-b border-white/5">
                        <span>시간</span>
                        <span>전화번호</span>
                        <span className="col-span-2">당첨 결과</span>
                      </div>
                      
                      <div className="space-y-2.5">
                        {liveLogs.map((log, idx) => (
                          <div 
                            key={idx} 
                            className={`grid grid-cols-4 items-center ${log.isBig ? 'text-[#ffb53f] font-black bg-[#ffb53f]/5 px-1 py-0.5 rounded-md' : 'text-neutral-300'}`}
                          >
                            <span>{log.time}</span>
                            <span>{log.phone}</span>
                            <span className="col-span-2 flex items-center gap-1.5">
                              {log.prize}
                              {log.isBig && <span className="text-[8px] bg-red-500 text-white px-1 py-0.2 rounded font-black">대박!</span>}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* ── [8] 3대 요금제 및 기능 비교표 (Pricing Grid & Table) ── */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-28 relative z-10">
        
        <div className="text-center mb-16">
          <span className="text-xs font-black text-[#c5a059] uppercase tracking-widest bg-[#c5a059]/5 px-3 py-1.5 rounded-full border border-[#c5a059]/30">TRANSPARENT PRICING</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mt-4 mb-4">
            가입비 0원, 합리적인 요금 플랜
          </h2>
          <p className="text-neutral-400 text-sm md:text-base max-w-2xl mx-auto">
            초기 가입 세팅비가 완전히 면제되며 사장님 가맹점 규모와 요구 기능에 맞추어 결제 가능합니다.
          </p>
        </div>

        {/* 요금제 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-20">
          {pricing.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative bg-[#111111]/50 backdrop-blur border rounded-[32px] p-8 md:p-10 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 ${plan.popular ? 'border-[#c5a059] shadow-[0_0_40px_rgba(197,160,89,0.18)] bg-[#111111]/80' : 'border-white/5 hover:border-white/10 shadow-2xl'}`}
            >
              
              {plan.popular && (
                <span className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-[#c5a059] text-black text-[9px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                  Best Choice
                </span>
              )}

              <div className="text-left">
                <h3 className="text-lg font-black text-white mb-2">{plan.name}</h3>
                <p className="text-neutral-500 text-xs leading-relaxed mb-6 font-semibold">{plan.desc}</p>
                <div className="flex items-baseline gap-1.5 mb-8">
                  <span className="text-3xl font-black text-white">{plan.price}</span>
                  {plan.price !== '별도 문의' && <span className="text-xs text-neutral-500 font-bold">/ 월</span>}
                </div>

                <ul className="space-y-4 text-xs font-bold text-neutral-300 border-t border-white/5 pt-6">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-[#c5a059] text-sm">✓</span> {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setShowLeadModal(true)}
                className={`w-full py-4 mt-8 rounded-2xl text-xs font-extrabold transition-all duration-300 ${plan.popular ? 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-black shadow-lg hover:scale-[1.02]' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}`}
              >
                {plan.price === '별도 문의' ? '커스텀 상담 신청하기 ➔' : '스타터 플랜 상담하기 ➔'}
              </button>

            </div>
          ))}
        </div>

        {/* 요금제 상세 비교 스펙 시트 표 */}
        <div className="mb-8 text-center">
          <span className="text-xs font-black text-[#c5a059] uppercase tracking-wider">📋 요금제별 제공 기능 상세 비교표</span>
        </div>

        <div className="overflow-x-auto bg-[#111111]/30 border border-white/5 rounded-3xl p-6 shadow-2xl">
          <table className="w-full text-left border-collapse text-xs md:text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-[#c5a059]/40 text-[#c5a059] font-black">
                <th className="py-4.5 px-4">제공 스펙 리스트</th>
                <th className="py-4.5 px-4 text-neutral-400">Starter (스타터)</th>
                <th className="py-4.5 px-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-[#c5a059] font-extrabold">Pro Gold (점주 추천)</th>
                <th className="py-4.5 px-4 text-white">Enterprise (프랜차이즈)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: '매장 대기열 가동 개수', s: '1개 매장', p: '1개 매장', e: '무제한 지점 통합' },
                { name: '경품 재고 제어', s: '수동 에디터', p: '자동 실시간 차감 트랜잭션', e: '실시간 자동 차감 + CRM 연동' },
                { name: '공지 및 템플릿 관리', s: '기본 2개 지원', p: '무제한 실시간 배포 지원', e: '지점별 개별 도메인 로고 커스텀' },
                { name: '문자 발송 요금', s: '지원하지 않음', p: '무제한 전송 (수수료 0원)', e: '대량 SMS 연동 및 전담 서버 구축' },
                { name: '응모 고객 데이터 보존', s: '최근 7일', p: '최근 1년 보관 및 자동 정리', e: '영구 보관 및 엑셀 일괄 다운로드' },
                { name: '기술 지원 형태', s: '이메일 접수 지원', p: '24시간 카카오 실시간 채널', e: '24시간 긴급 전담 엔지니어 배정' }
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200">
                  <td className="py-4 px-4 font-black text-white">{row.name}</td>
                  <td className="py-4 px-4 text-neutral-400 font-semibold">{row.s}</td>
                  <td className="py-4 px-4 text-[#c5a059] font-black">{row.p}</td>
                  <td className="py-4 px-4 text-neutral-200 font-semibold">{row.e}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </section>

      {/* ── [9] 사장님 FAQ 아코디언 (FAQ Card Block) ── */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-28 relative z-10">
        
        <div className="text-center mb-16">
          <span className="text-xs font-black text-[#c5a059] uppercase tracking-widest bg-[#c5a059]/5 px-3 py-1.5 rounded-full border border-[#c5a059]/30">FAQ CENTER</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mt-4 mb-4 break-keep">
            🤔 사장님들이 가장 많이 걱정하시는 질문들
          </h2>
          <p className="text-neutral-400 text-sm md:text-base max-w-2xl mx-auto">
            솔루션 도입 시 가장 많이 유입되는 질문과 매장 보안 관련 세부 답변을 투명하게 안내해 드립니다.
          </p>
        </div>

        <div className="space-y-4">
          {faqList.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-[#c5a059] bg-[#111111]/60 shadow-[0_4px_30px_rgba(197,160,89,0.06)]' : 'border-white/5 hover:border-white/15 bg-[#111111]/30 hover:bg-[#111111]/50'}`}
              >
                {/* 질문 헤더 클릭 */}
                <div 
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="px-6 py-5 flex justify-between items-center cursor-pointer select-none text-left"
                >
                  <span className={`text-sm md:text-base font-black transition-colors ${isOpen ? 'text-[#c5a059]' : 'text-white'}`}>
                    {faq.q}
                  </span>
                  <span className={`text-base transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#c5a059]' : 'text-neutral-500'}`}>
                    ▼
                  </span>
                </div>

                {/* 답변 콘텐츠 슬라이드 */}
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 border-t border-white/5 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-6 py-5 text-neutral-400 text-xs md:text-sm leading-relaxed text-left font-medium">
                    {faq.a}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </section>

      {/* ── [10] 최종 전환 유도 CTA (Full Gradient Banner) ── */}
      <section className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="relative bg-gradient-to-br from-[#121212] via-[#080808] to-[#121212] border-2 border-[#c5a059] shadow-[0_0_60px_rgba(197,160,89,0.18)] rounded-[40px] py-16 px-8 md:py-20 md:px-12 text-center overflow-hidden">
          
          {/* 배너 배경 흐림 빛 조명 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#c5a059] rounded-full filter blur-[180px] opacity-10 pointer-events-none" />

          <span className="text-xs font-black text-[#c5a059] uppercase tracking-widest block mb-4">GET STARTED NOW</span>
          <h2 className="text-3xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto mb-6 break-keep">
            지금 바로 사장님의 오프라인 매장에<br/>
            놀라운 대기열 혁신을 안겨주세요
          </h2>
          
          <p className="text-neutral-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            초기 세팅 리스크 대행 없이, 가입비 단 5분이면 매장 고유의 아름다운 룰렛 이벤트와 고객 번호 자동 문자 발송 환경이 가동됩니다.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/dine-event')}
              className="px-8 py-4 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-black font-black text-sm md:text-base rounded-full shadow-[0_8px_25px_rgba(245,158,11,0.3)] transition-transform hover:scale-105"
            >
              🎡 5분 만에 무료 매장 개설하기
            </button>
            <button
              onClick={() => setShowLeadModal(true)}
              className="px-8 py-4 bg-white/5 border border-white/10 hover:border-white/20 text-white font-bold text-sm md:text-base rounded-full transition-all duration-300"
            >
              📞 1대1 도입 무료 컨설팅 요청
            </button>
          </div>

        </div>
      </section>

      {/* ── [11] 신뢰도 높은 푸터 (Footer) ── */}
      <footer className="bg-black border-t border-white/5 py-16 px-6 relative z-10 text-left text-neutral-500 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* 회사 소개 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <span className="text-2xl">🎡</span>
              <span className="text-lg font-black tracking-tight">이벤트룰렛</span>
            </div>
            <p className="leading-relaxed font-medium text-neutral-400">
              이벤트룰렛은 오프라인 점주님의 집객 마케팅을 실시간으로 고도화하고, 독립적인 테넌트 격리 기술을 제공하는 고품격 멀티 테넌트 SaaS 서비스입니다.
            </p>
          </div>

          {/* 주요 서비스 링크 */}
          <div className="space-y-4">
            <h4 className="text-white font-extrabold text-sm tracking-wide">💡 주요 기능</h4>
            <ul className="space-y-2.5 font-semibold text-neutral-400">
              <li><a href="#intro" className="hover:text-white transition-colors">실시간 룰렛 스피너</a></li>
              <li><a href="#functions" className="hover:text-white transition-colors">Firestore 트랜잭션 제어</a></li>
              <li><a href="#cases" className="hover:text-white transition-colors">업종별 커스텀 템플릿</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">대량 발송 SMS 자동화</a></li>
            </ul>
          </div>

          {/* 파트너십 */}
          <div className="space-y-4">
            <h4 className="text-white font-extrabold text-sm tracking-wide">📞 비즈니스 문의</h4>
            <ul className="space-y-2.5 font-semibold text-neutral-400">
              <li><a href="mailto:support@event-roulette.io" className="hover:text-[#c5a059] transition-colors">📩 도입 및 기술 제휴 신청 메일</a></li>
              <li><span>💬 카카오톡 플러스친구: @이벤트룰렛</span></li>
              <li><span>📞 대표번호: 1644-0000 (평일 10:00-18:00)</span></li>
              <li><a href="/privacy" className="hover:text-white transition-colors font-extrabold text-white">개인정보처리방침</a></li>
            </ul>
          </div>

          {/* 비즈니스 고지 */}
          <div className="space-y-4">
            <h4 className="text-white font-extrabold text-sm tracking-wide">🏢 주식회사 수퍼솔루션</h4>
            <p className="leading-relaxed font-semibold text-neutral-500">
              대표이사: 홍길동 | 서울특별시 강남구 테헤란로 456, 12층<br/>
              사업자등록번호: 220-88-00000 | 통신판매신고: 제 2026-서울강남-0000호<br/>
              이메일: support@event-roulette.io<br/>
              © {new Date().getFullYear()} 주식회사 수퍼솔루션. All rights reserved.
            </p>
          </div>

        </div>

        {/* 푸터 하단 스크립트 */}
        <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-wrap justify-between items-center gap-4">
          <span className="text-[10px] font-medium text-neutral-600">본 플랫폼은 분할된 보안 방화벽 데이터 인프라 하에 무결하게 보장 운영되고 있습니다.</span>
          <span className="text-[10px] font-bold text-[#c5a059] flex items-center gap-1">
            <span>✨</span> 다중 테넌트 매장 마케팅 마스터피스
          </span>
        </div>

      </footer>

    </div>
  );
};

export default CompanyIntro;
