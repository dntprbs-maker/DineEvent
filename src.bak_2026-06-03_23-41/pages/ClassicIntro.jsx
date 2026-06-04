import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import b2bKiosk from '../assets/b2b_roulette_kiosk.png';

const ClassicIntro = () => {
  const navigate = useNavigate();

  // ── 상태 관리 ──
  const [activeFaq, setActiveFaq] = useState(null);
  const [showConsultModal, setShowConsultModal] = useState(false); // 무료 상담 신청 모달
  const [selectedCase, setSelectedCase] = useState(null); // 성공 사례 클릭 시 상세 팝업 모달
  const [consultSubmitted, setConsultSubmitted] = useState(false);

  // 상담 신청용 폼 필드
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [memo, setMemo] = useState('');

  // 성공 사례 포트폴리오 데이터 (시안 이미지 기준 1대1 매핑)
  const successCases = [
    {
      id: 1,
      title: '글로벌 마케팅 데이',
      tag: 'Global Marketing Day',
      metric: '50% 성공률',
      desc: '글로벌 마케팅 데이에 참여형 마케팅 솔루션을 도입하여 참여율 및 브랜드 리텐션을 폭발적으로 상승시켰습니다.',
      details: '세계적인 마케팅 포럼에서 이벤트룰렛을 통한 현장 참여형 럭키드로우 세션을 단독 가동하였습니다. 참가자들의 휴대폰 번호를 수집하는 과정에서 격리된 데이터 보안을 제공하고, 당첨자가 나오는 즉시 자동 알림 문자를 송출하여 현장 상담 부스로 자연스럽게 유도해 DB 수집 목표치를 150% 초과 달성하는 쾌거를 이루었습니다.',
      bgType: 'blue-map',
      color: 'from-[#0f2a4a] to-[#0a172c]'
    },
    {
      id: 2,
      title: '연말 기업 파티',
      tag: '2026 Year-end Party',
      metric: '50% 성공사례',
      desc: '연말 기업 파티의 활기찬 분위기 속에 당첨 룰렛 솔루션을 더하여 임직원의 화합과 폭발적인 현장 반응을 이끌어냈습니다.',
      details: '대기업 연말 사내 행사 및 VIP 네트워킹 파티에서 맞춤형 당첨 테이블을 운영하였습니다. 소진 한도 제어 시스템을 가동하여 예산 내의 한정판 경품이 조기에 무단 완판되지 않도록 정밀 제어하였으며, 0.01초 단위의 실시간 트랜잭션 차감 프로세스로 단 한 건의 기기 오작동이나 지급 누락 사고 없이 무결점으로 행사를 완료했습니다.',
      bgType: 'party-photo',
      color: 'from-[#2c2018] to-[#120d09]'
    },
    {
      id: 3,
      title: '팝업스토어 룰렛',
      tag: 'Popup Store Roulette',
      metric: '50% 상승률',
      desc: '팝업스토어 룰렛으로 방문객 유입 속도와 집객률을 높여 한정된 기간 내 폭발적인 마케팅 성과를 만들어 냈습니다.',
      details: '성수동 럭셔리 브랜드 팝업스토어 현장에 룰렛 키오스크 솔루션을 빌드했습니다. 팝업스토어 특유의 한정된 소진 한도를 매 시간대별로 미세 조절하고, 점주용 모바일 대시보드로 실시간 당첨 통계를 피크타임에도 안전하게 모니터링하여 브랜드 만족도 100%와 방문객의 인스타그램 업로드율 200% 증가 성과를 달성했습니다.',
      bgType: 'popup-kiosk',
      color: 'from-[#171a21] to-[#0a0c10]'
    }
  ];

  // 12대 제휴 협력사 리스트 (시안 이미지 하단 텍스트 기준)
  const partners = [
    { name: '안전교통', icon: '🚇' },
    { name: 'OO그룹', icon: '🏢' },
    { name: '부안교통', icon: '🚌' },
    { name: '당찬교통', icon: '🚕' },
    { name: '영안자보', icon: '🛡️' },
    { name: '부안관광', icon: '✈️' },
    { name: '무전부부', icon: '🤝' },
    { name: '경포전설', icon: '🏛️' },
    { name: '새안대명', icon: '🏨' },
    { name: 'OO그룹', icon: '🏢' },
    { name: '장업부산', icon: '⚓' },
    { name: '명근은행', icon: '🏦' }
  ];

  // 상담 신청 처리
  const handleConsultSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !company) {
      alert('성함, 연락처, 회사명은 필수 항목입니다.');
      return;
    }
    setConsultSubmitted(true);
    setTimeout(() => {
      alert('무료 상담 신청이 완료되었습니다. B2B 전문 전담 상담사가 기재해주신 연락처로 24시간 내에 제안서와 함께 연락드리겠습니다.');
      setName('');
      setPhone('');
      setCompany('');
      setMemo('');
      setConsultSubmitted(false);
      setShowConsultModal(false);
    }, 1200);
  };

  return (
    <div className="relative bg-white text-[#333] min-h-screen font-sans selection:bg-[#c5a059] selection:text-black overflow-x-hidden">
      
      {/* ── [1] B2B 명품 네비게이션 바 (B2B Deep Navy Navbar) ── */}
      <header className="sticky top-0 z-50 bg-[#0a1d37] text-white border-b border-[#c5a059]/20 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4.5 flex items-center justify-between">
          
          {/* 심볼 로고 (이벤트룰렛 황금 기어 로고) */}
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="relative w-8 h-8 flex items-center justify-center bg-gradient-to-br from-amber-400 to-[#c5a059] rounded-lg shadow-lg group-hover:rotate-45 transition-transform duration-500">
              <span className="text-white text-lg font-black">🎡</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-base font-extrabold tracking-tight leading-tight">Event</span>
              <span className="text-xs font-black text-[#c5a059] tracking-wider -mt-1 uppercase">Roulette</span>
            </div>
          </div>

          {/* 중앙 네비게이션 메뉴 (시안 매핑) */}
          <nav className="hidden md:flex items-center gap-8 font-semibold text-sm">
            <a href="#intro" className="text-[#c5a059] border-b-2 border-[#c5a059] pb-1 transition-all">회사소개</a>
            <a href="#features" className="text-neutral-300 hover:text-[#c5a059] transition-colors">서비스</a>
            <a href="#solutions" className="text-neutral-300 hover:text-[#c5a059] transition-colors">맞춤형 솔루션</a>
            <a href="#cases" className="text-neutral-300 hover:text-[#c5a059] transition-colors">성공사례</a>
            <a href="#testimonials" className="text-neutral-300 hover:text-[#c5a059] transition-colors">고객지원</a>
            <a href="#consult" className="text-neutral-300 hover:text-[#c5a059] transition-colors">문의하기</a>
          </nav>

          {/* 우측 행동 버튼 (시안 매핑) */}
          <div>
            <button
              onClick={() => setShowConsultModal(true)}
              className="text-xs md:text-sm font-black text-black bg-[#c5a059] hover:bg-[#e5c17b] rounded-full px-5 py-2.5 shadow-[0_2px_15px_rgba(197,160,89,0.3)] hover:scale-105 transition-all duration-300"
            >
              무료 상담 신청
            </button>
          </div>

        </div>
      </header>

      {/* ── [2] 히어로 섹션 (Hero Split Layout) ── */}
      <section id="intro" className="grid grid-cols-1 lg:grid-cols-2 bg-[#0c1f38] text-white overflow-hidden items-stretch min-h-[500px]">
        
        {/* 히어로 좌측: 슬로건 & 설명 카드 */}
        <div className="bg-[#0a182c]/95 p-12 md:p-20 flex flex-col justify-center items-start text-left relative z-10 border-r border-[#c5a059]/10">
          
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#133055]/30 via-transparent to-transparent pointer-events-none" />

          {/* 소형 주소 링크 배지 */}
          <a 
            href="https://dntprbs-event-roulette.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 border border-emerald-400/20 bg-emerald-400/5 rounded-full px-3 py-1 mb-6 hover:bg-emerald-400/10 transition-colors"
          >
            <span>🔗</span> www.event-roulette.co.kr
          </a>

          {/* 메인 타이틀 */}
          <h1 className="text-3xl md:text-5xl font-extrabold leading-[1.2] tracking-tight mb-6">
            신뢰할 수 있는 이벤트 성공 파트너,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-[#c5a059] filter drop-shadow-md">
              Event Roulette
            </span>
          </h1>

          {/* 서브 설명 */}
          <p className="text-neutral-300 text-sm md:text-base leading-relaxed mb-10 max-w-[520px]">
            검증된 솔루션으로 완벽한 순간을 설계합니다. 전국 가맹점별 독립 데이터 암호화 격리와 0.01초 단위 실시간 경품 재고 관리를 통해 완벽한 마케팅 성과를 선사합니다. (www.event-roulette.co.kr)
          </p>

          {/* 2대 아웃라인 버튼 (시안 매핑) */}
          <div className="flex flex-wrap gap-4 w-full sm:w-auto">
            <a
              href="#features"
              className="px-6 py-3.5 border border-white/40 hover:border-white/80 text-white font-extrabold text-xs md:text-sm rounded-full transition-all duration-300 bg-white/5 hover:bg-white/10 text-center"
            >
              서비스 자세히 보기
            </a>
            <button
              onClick={() => setShowConsultModal(true)}
              className="px-6 py-3.5 border border-[#c5a059]/50 hover:border-[#c5a059] text-[#c5a059] font-extrabold text-xs md:text-sm rounded-full transition-all duration-300 bg-[#c5a059]/5 hover:bg-[#c5a059]/10 text-center"
            >
              회사 소개서 다운로드
            </button>
          </div>

        </div>

        {/* 히어로 우측: 프리미엄 키오스크 연출 이미지 */}
        <div className="relative min-h-[350px] lg:min-h-full overflow-hidden flex justify-center items-center bg-[#071424]">
          <img 
            src={b2bKiosk} 
            alt="Event Roulette B2B Premium Touchscreen Kiosk" 
            className="w-full h-full object-cover object-center absolute inset-0 transition-transform duration-[6000ms] hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1f38]/60 via-transparent to-transparent pointer-events-none" />
        </div>

      </section>

      {/* ── [3] 핵심 가치 4대 그리드 바 (Core B2B 4-Pillars Grid) ── */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-12 -mt-8 relative z-20">
        <div className="bg-white border border-neutral-100 rounded-3xl shadow-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-neutral-100 overflow-hidden">
          {[
            { icon: '🤝', title: '전문가 팀', desc: '전문가로 구성된 맞춤형 이벤트 기획 및 설계 제공' },
            { icon: '🔧', title: '맞춤형 솔루션', desc: '가맹점별 타겟 맞춤형 이벤트 스피너 시뮬레이션 지원' },
            { icon: '🛡️', title: '안정적 운영', desc: '실시간 트랜잭션 보장 및 0.01초 무결점 재고 통제' },
            { icon: '📊', title: '데이터 분석', desc: '당첨 고객 분석에 기반한 최적의 마케팅 인사이트 도출' }
          ].map((val, idx) => (
            <div key={idx} className="p-8 text-center flex flex-col items-center gap-3 bg-white hover:bg-neutral-50/50 transition-colors duration-300">
              <span className="text-4xl filter drop-shadow-md">{val.icon}</span>
              <h4 className="text-base font-extrabold text-[#0a1d37]">{val.title}</h4>
              <p className="text-neutral-500 text-xs leading-relaxed max-w-[200px]">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── [4] 하단 분할 그리드 영역 (Bottom Split Content Layout) ── */}
      <section id="solutions" className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* ── [4-A] 좌측 컬럼: 결과로 증명하는 성공 사례 (7 cols) ── */}
        <div id="cases" className="lg:col-span-7 text-left space-y-8">
          
          <div>
            <span className="text-xs font-black text-[#c5a059] uppercase tracking-wider block mb-1">SUCCESS PORTFOLIO</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0a1d37] tracking-tight">
              결과로 증명하는 성공 사례
            </h2>
            <div className="w-16 h-1 bg-[#c5a059] mt-3 rounded-full" />
          </div>

          <div className="space-y-6">
            {successCases.map((sc) => (
              <div 
                key={sc.id} 
                onClick={() => setSelectedCase(sc)}
                className="group relative bg-white border border-neutral-100 hover:border-[#c5a059]/40 rounded-3xl p-6 flex flex-col md:flex-row gap-6 items-center shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                {/* 카드 그래픽 영역 */}
                <div className={`w-full md:w-44 h-32 rounded-2xl bg-gradient-to-br ${sc.color} text-white flex flex-col items-center justify-center p-4 relative overflow-hidden shadow-inner shrink-0`}>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/5 text-7xl font-black select-none pointer-events-none">
                    🎡
                  </div>
                  
                  {sc.bgType === 'blue-map' && (
                    <div className="text-center relative z-10">
                      <span className="text-xs font-semibold text-emerald-400 block mb-1">GLOBAL MAP</span>
                      <span className="text-sm font-black tracking-tight">{sc.title}</span>
                    </div>
                  )}

                  {sc.bgType === 'party-photo' && (
                    <div className="text-center relative z-10">
                      <span className="text-xs font-semibold text-[#ffb53f] block mb-1">VIP PARTY</span>
                      <span className="text-sm font-black tracking-tight">{sc.title}</span>
                    </div>
                  )}

                  {sc.bgType === 'popup-kiosk' && (
                    <div className="text-center relative z-10">
                      <span className="text-xs font-semibold text-cyan-400 block mb-1">POPUP BOOTH</span>
                      <span className="text-sm font-black tracking-tight">{sc.title}</span>
                    </div>
                  )}
                </div>

                {/* 카드 텍스트 영역 */}
                <div className="space-y-2.5 w-full">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <span className="text-xs text-neutral-400 font-bold tracking-wide uppercase">{sc.tag}</span>
                    <span className="text-xs font-black text-[#c5a059] bg-[#c5a059]/10 border border-[#c5a059]/30 px-3 py-1 rounded-full">
                      {sc.metric}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-[#0a1d37] group-hover:text-[#c5a059] transition-colors">
                    {sc.title}
                  </h3>
                  <p className="text-neutral-500 text-xs leading-relaxed font-medium">
                    {sc.desc}
                  </p>
                  <div className="text-xs text-[#0a1d37] font-bold group-hover:translate-x-1.5 transition-transform duration-300 flex items-center gap-1">
                    자세히 보기 <span className="text-sm">➔</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* ── [4-B] 우측 컬럼: 고객 후기 & 파트너사 로고 (5 cols) ── */}
        <div id="testimonials" className="lg:col-span-5 text-left space-y-12">
          
          {/* 고객들의 후기 소영역 */}
          <div className="space-y-8">
            <div>
              <span className="text-xs font-black text-[#c5a059] uppercase tracking-wider block mb-1">CLIENT TESTIMONIALS</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#0a1d37] tracking-tight">
                저희의 고객들이 말합니다
              </h2>
              <div className="w-16 h-1 bg-[#c5a059] mt-3 rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* 후기 1 */}
              <div className="bg-neutral-50 border border-neutral-100 rounded-3xl p-6 space-y-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0a1d37] text-white flex items-center justify-center font-bold text-sm shadow-md">
                    👩‍💼
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-[#0a1d37]">김민지 팀장</h4>
                    <span className="text-[10px] text-neutral-400 font-semibold">OO그룹 마케팅실</span>
                  </div>
                </div>
                <p className="text-neutral-600 text-xs leading-relaxed font-semibold italic">
                  "이벤트룰렛의 완벽한 실시간 재고 제어 덕분에 마케팅 성과를 200% 달성하고 안심하고 운영했습니다."
                </p>
              </div>

              {/* 후기 2 */}
              <div className="bg-neutral-50 border border-neutral-100 rounded-3xl p-6 space-y-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#c5a059] text-black flex items-center justify-center font-bold text-sm shadow-md">
                    👩‍💼
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-[#0a1d37]">김인지 팀장</h4>
                    <span className="text-[10px] text-neutral-400 font-semibold">OO그룹 브랜드전략</span>
                  </div>
                </div>
                <p className="text-neutral-600 text-xs leading-relaxed font-semibold italic">
                  "가맹점별 격리된 보안 기술과 간편한 모바일 관리자 기능 덕분에 고객 리텐션 만족도가 최고조에 달했습니다."
                </p>
              </div>

            </div>
          </div>

          {/* 파트너사 로고 소영역 */}
          <div className="space-y-6 pt-4 border-t border-neutral-100">
            <div>
              <span className="text-xs font-black text-neutral-400 uppercase tracking-widest block">TRUSTED PARTNERS</span>
            </div>

            {/* 12대 협력사 로고 텍스트 그리드 (시안 1대1 매핑) */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {partners.map((p, idx) => (
                <div 
                  key={idx} 
                  className="bg-neutral-50/80 border border-neutral-100 rounded-xl py-3 px-2 text-center flex flex-col items-center justify-center gap-1 hover:bg-white hover:border-[#c5a059]/30 transition-all duration-300 hover:shadow-sm cursor-pointer group"
                >
                  <span className="text-base group-hover:scale-110 transition-transform">{p.icon}</span>
                  <span className="text-[10px] font-black text-neutral-500 group-hover:text-[#0a1d37] transition-colors">{p.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </section>

      {/* ── [5] 성공 사례 상세 안내 모달 (Interactive Detail Popup) ── */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setSelectedCase(null)}>
          <div className="bg-white border-t-4 border-[#c5a059] rounded-3xl p-8 w-full max-w-[500px] relative text-left shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedCase(null)} className="absolute top-6 right-6 text-neutral-400 hover:text-[#0a1d37] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-neutral-400 font-extrabold uppercase">{selectedCase.tag}</span>
                <span className="text-xs font-black text-[#c5a059] bg-[#c5a059]/10 px-3 py-1 rounded-full">{selectedCase.metric}</span>
              </div>
              <h3 className="text-xl font-extrabold text-[#0a1d37]">{selectedCase.title}의 상세 성공 보고서</h3>
              <p className="text-neutral-600 text-xs md:text-sm leading-relaxed whitespace-pre-line font-medium bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                {selectedCase.details}
              </p>
              
              <button
                onClick={() => {
                  setSelectedCase(null);
                  setShowConsultModal(true);
                }}
                className="w-full py-3 bg-[#0a1d37] hover:bg-[#133055] text-white font-extrabold text-xs rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
              >
                이 성공 사례와 같은 솔루션 도입 문의하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── [6] 무료 상담 신청 전용 모달 (Lead Capture Modal) ── */}
      {showConsultModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setShowConsultModal(false)}>
          <div className="bg-white border-2 border-[#c5a059] rounded-3xl p-8 w-full max-w-[460px] relative text-left shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowConsultModal(false)} className="absolute top-6 right-6 text-neutral-400 hover:text-[#0a1d37] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>

            <div className="text-center mb-6">
              <span className="text-3xl">🎡</span>
              <h3 className="text-lg font-black text-[#0a1d37] mt-2">B2B 제휴 및 이벤트 솔루션 제안 요청</h3>
              <p className="text-neutral-500 text-[10px] mt-1">간단한 세부 제안 요건을 입력하시면 맞춤 견적 가이드를 문자/메일로 송출합니다.</p>
            </div>

            {consultSubmitted ? (
              <div className="py-8 text-center flex flex-col items-center justify-center gap-3">
                <span className="text-4xl animate-pulse">✉️</span>
                <span className="text-sm font-bold text-[#c5a059]">요청서 접수 완료 중...</span>
              </div>
            ) : (
              <form onSubmit={handleConsultSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-neutral-500 mb-1">성함 *</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 홍길동 팀장"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#c5a059] transition-colors text-black"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-neutral-500 mb-1">연락처 *</label>
                  <input
                    type="tel"
                    required
                    placeholder="예: 010-1234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#c5a059] transition-colors text-black"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-neutral-500 mb-1">회사명 / 부서명 *</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 주식회사 수퍼솔루션 마케팅본부"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#c5a059] transition-colors text-black"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-neutral-500 mb-1">세부 문의 내용 (선택)</label>
                  <textarea
                    rows="2"
                    placeholder="예: 팝업스토어 키오스크 단기 3일 대여 비용이 궁금합니다."
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#c5a059] transition-colors resize-none text-black"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3 bg-[#c5a059] hover:bg-[#e5c17b] text-black font-extrabold text-xs rounded-xl shadow-lg transition-transform hover:scale-[1.01]"
                >
                  제안서 및 상세 우대 단가 무료 상담 신청
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── [7] 기업 정밀 고지 푸터 (B2B Footer - 시안 매핑) ── */}
      <footer id="consult" className="bg-[#0a1d37] text-white border-t border-[#c5a059]/20 py-12 px-6 text-center text-xs">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* 하단 푸터 1대1 싱크 매핑 */}
          <p className="text-neutral-300 font-semibold tracking-wide leading-relaxed">
            © Event Roulette Corp. All rights reserved. | 대표: 홍길동 | 서울시 강남구 테헤란로 XXX | www.event-roulette.co.kr | Tel: 1234-5578 | <a href="#privacy" className="underline hover:text-[#c5a059] font-black">개인정보처리방침</a>
          </p>

          <div className="flex justify-center gap-4 text-[10px] text-neutral-400 font-bold">
            <span className="hover:text-white transition-colors cursor-pointer">서비스 이용약관</span>
            <span>|</span>
            <span className="hover:text-white transition-colors cursor-pointer">가맹 제휴 규격 안내서</span>
            <span>|</span>
            <span className="hover:text-white transition-colors cursor-pointer">0.01초 트랜잭션 보안 보증</span>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default ClassicIntro;
