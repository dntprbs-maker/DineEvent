

import { useNavigate, useParams } from 'react-router-dom';

/**
 * NewLanding.jsx
 * 
 * 프로젝트명(서비스명)을 'DineEvent'에서 'Event Roulette'으로 전면 수정했습니다.
 * 사용자가 실 서비스명과 프로젝트명의 불일치로 겪는 혼선을 제거했습니다.
 * 
 * * 내부 동작 경로 파라미터(tenantId)의 기본값은 Firestore 데이터 보존을 위해 'dine-event'를 유지하되,
 *   화면에 표시되는 모든 브랜드 텍스트, 로고 및 회사 기본값은 'Event Roulette' 및 '이벤트룰렛'으로 수정했습니다.
 */
const NewLanding = () => {
  const navigate = useNavigate();
  const { tenantId = 'dine-event' } = useParams();

  const handleGoDemo = () => {
    navigate(`/${tenantId}`);
  };

  const handleGoAdmin = () => {
    navigate(`/master-admin`);
  };

  return (
    <div className="new-landing-container min-h-screen pb-48" style={{
      backgroundColor: '#020202', // 프리미엄 다크 블랙
      color: '#ffffff',
      fontFamily: "'Pretendard', 'Outfit', sans-serif",
      overflowX: 'hidden'
    }}>
      
      {/* ── 1. 프리미엄 헤더 (Sticky Navigation) ── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-[rgba(197,160,89,0.25)] bg-[rgba(2,2,2,0.92)] shadow-lg">
        <div className="max-w-7xl mx-auto px-10 h-24 flex items-center justify-between">
          {/* 로고: DineEvent -> Event Roulette 로 변경 */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-2xl animate-pulse">🎡</span>
            <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-white via-[#e5c17b] to-[#c5a059] bg-clip-text text-transparent">
              Event Roulette
            </span>
          </div>

          {/* 중앙 네비게이션 */}
          <nav className="hidden md:flex items-center gap-12 text-sm font-bold text-gray-200">
            <a href="#features" className="hover:text-[#c5a059] transition-colors duration-300">서비스 기능</a>
            <a href="#solutions" className="hover:text-[#c5a059] transition-colors duration-300">이벤트 솔루션</a>
            <a href="#pricing" className="hover:text-[#c5a059] transition-colors duration-300">이용 플랜</a>
            <span className="text-gray-700">|</span>
            <span onClick={handleGoDemo} className="hover:text-[#c5a059] transition-colors duration-300 cursor-pointer">데모 룰렛 체험</span>
          </nav>

          {/* 우측 로그인 및 체험 버튼 */}
          <div className="flex items-center gap-6">
            <button 
              onClick={handleGoAdmin}
              className="text-xs md:text-sm font-bold text-gray-400 hover:text-[#c5a059] transition-colors duration-300"
            >
              로그인
            </button>
            <button 
              onClick={handleGoDemo}
              className="px-8 py-3.5 text-xs md:text-sm font-black rounded-full text-black bg-gradient-to-r from-[#fceabb] via-[#fccd4d] to-[#f8b500] border border-[#ffeb3b] shadow-[0_0_20px_rgba(255,215,0,0.25)] hover:scale-105 hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transition-all duration-300 cursor-pointer"
            >
              무료로 시작하기
            </button>
          </div>
        </div>
      </header>

      {/* ── 본문 카드 리스트 (웅장한 간격 유지) ── */}
      <div className="max-w-7xl mx-auto px-10 mt-24 space-y-36 md:space-y-44">

        {/* ── 2. 히어로 섹션 (럭셔리 입체 글래스 카드) ── */}
        <section className="relative overflow-hidden bg-[rgba(26,26,26,0.92)] backdrop-blur-3xl border border-[rgba(197,160,89,0.32)] border-t-4 border-t-[#c5a059] rounded-[64px] px-8 py-12 md:px-16 md:py-20 lg:px-20 lg:py-24 shadow-[0_50px_100px_rgba(0,0,0,0.98),0_0_70px_rgba(197,160,89,0.08)]">
          {/* 금빛 성운 배경 장식 */}
          <div className="absolute -top-[300px] -left-[300px] w-[600px] h-[600px] bg-[rgba(197,160,89,0.12)] rounded-full blur-[160px] pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
            {/* 왼쪽: 텍스트 및 조작 버튼 */}
            <div className="lg:col-span-6 space-y-6 md:space-y-8 text-left">
              <div className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black text-[#c5a059] bg-[rgba(197,160,89,0.12)] border border-[rgba(197,160,89,0.35)] tracking-widest uppercase">
                👑 PREMIUM EVENT PLATFORM
              </div>
              
              {/* DineEvent -> Event Roulette 로 변경 */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.2] tracking-tight">
                이벤트를 성장시키는<br />
                가장 스마트한<br />
                <span className="bg-gradient-to-r from-[#fceabb] via-[#fccd4d] to-[#f8b500] bg-clip-text text-transparent">
                  이벤트 룰렛 솔루션
                </span>
              </h1>

              {/* DineEvent -> Event Roulette 로 변경 */}
              <div className="bg-[rgba(0,0,0,0.45)] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-6 md:p-8 text-gray-200 font-medium text-sm md:text-base leading-relaxed word-break-keep-all shadow-inner">
                🚀 복잡한 오프라인 이벤트 등록과 실시간 당첨 통계 제어는 혁신적으로 단축하고, 매장 방문 단골 고객 응대에만 완벽히 집중해 보세요. Event Roulette이 차별화된 가맹점 성장을 약속합니다.
              </div>

              {/* 액션 버튼 그룹 */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button 
                  onClick={handleGoDemo}
                  className="px-8 py-4 text-xs md:text-sm font-black rounded-full text-black bg-gradient-to-r from-[#fceabb] via-[#fccd4d] to-[#f8b500] border border-[#ffeb3b] shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:scale-105 hover:shadow-[0_0_35px_rgba(255,215,0,0.5)] transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  무료로 시작하기 <span>➔</span>
                </button>
                <a 
                  href="#features"
                  className="px-8 py-4 text-xs md:text-sm font-black rounded-full text-white bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.18)] hover:bg-[rgba(255,255,255,0.18)] hover:text-[#c5a059] transition-all duration-300 text-center"
                >
                  서비스 둘러보기
                </a>
              </div>
            </div>

            {/* 오른쪽: 라이브 대시보드 그래픽 */}
            <div className="lg:col-span-6 relative flex justify-center items-center py-6">
              {/* 대시보드 카드 */}
              <div className="relative w-full max-w-md bg-[rgba(20,20,20,0.95)] border-2 border-[rgba(197,160,89,0.38)] rounded-[28px] p-6 md:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.95)] space-y-6">
                <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.1)] pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                  </div>
                  <span className="text-[10px] font-black text-[#c5a059] tracking-widest">LIVE DATA STATUS</span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-[rgba(255,255,255,0.04)] p-4 rounded-xl border border-[rgba(255,255,255,0.08)]">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">방문자</span>
                    <div className="text-sm font-black text-white mt-1">1,240명</div>
                  </div>
                  <div className="bg-[rgba(255,255,255,0.04)] p-4 rounded-xl border border-[rgba(255,255,255,0.08)]">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">응모수</span>
                    <div className="text-sm font-black text-white mt-1">840회</div>
                  </div>
                  <div className="bg-[rgba(255,255,255,0.04)] p-4 rounded-xl border border-[rgba(255,255,255,0.08)]">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">전환율</span>
                    <div className="text-sm font-black text-[#e5c17b] mt-1">67.7%</div>
                  </div>
                </div>

                {/* 그래프 막대 */}
                <div className="bg-[rgba(0,0,0,0.5)] p-5 rounded-xl border border-[rgba(255,255,255,0.05)] space-y-3">
                  <div className="h-24 w-full flex items-end justify-between gap-2 pt-2">
                    <div className="w-full bg-[rgba(197,160,89,0.25)] rounded-t-lg h-[40%] hover:bg-[#c5a059] transition-all"></div>
                    <div className="w-full bg-[rgba(197,160,89,0.35)] rounded-t-lg h-[60%] hover:bg-[#c5a059] transition-all"></div>
                    <div className="w-full bg-[rgba(197,160,89,0.45)] rounded-t-lg h-[50%] hover:bg-[#c5a059] transition-all"></div>
                    <div className="w-full bg-gradient-to-t from-[#fccd4d] to-[#f8b500] rounded-t-lg h-[95%] shadow-[0_0_20px_rgba(248,181,0,0.5)]"></div>
                    <div className="w-full bg-[rgba(197,160,89,0.7)] rounded-t-lg h-[70%] hover:bg-[#c5a059] transition-all"></div>
                  </div>
                </div>

                <div className="bg-[rgba(255,255,255,0.03)] p-4 rounded-xl border border-[rgba(255,255,255,0.05)] flex justify-between items-center text-xs text-white">
                  <span className="font-extrabold text-gray-200">🎉 테이블 7번 1등 당첨 (골드쿠폰)</span>
                  <span className="text-[#e5c17b] font-black">방금 전</span>
                </div>
              </div>

              {/* 모바일 폰 뷰 */}
              <div className="absolute -bottom-8 -right-8 w-36 bg-[#080808] border-2 border-[rgba(197,160,89,0.4)] rounded-[28px] p-4 shadow-[0_30px_70px_rgba(0,0,0,0.98)] hidden sm:block transform rotate-6 hover:rotate-0 transition-all duration-500">
                <div className="w-12 h-3 bg-[#222] rounded-full mx-auto mb-4"></div>
                <div className="h-20 w-20 mx-auto rounded-full border border-dashed border-[#c5a059] flex items-center justify-center animate-[spin_20s_linear_infinite]">
                  <span className="text-xl">🎡</span>
                </div>
                <div className="w-full mt-4 py-2 text-[10px] font-black text-center text-black bg-[#c5a059] rounded-full shadow-lg cursor-pointer">
                  START!
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. 협력사 로고 (독립형 미니 카드) ── */}
        <section className="bg-[rgba(26,26,26,0.92)] backdrop-blur-xl border border-[rgba(197,160,89,0.32)] rounded-[28px] py-12 px-10 shadow-[0_30px_60px_rgba(0,0,0,0.9)]">
          <div className="text-center space-y-8">
            <p className="text-xs text-[#c5a059] font-black uppercase tracking-widest">
              10,000+ 가맹점 및 글로벌 파트너 브랜드와 함께 이뤄냅니다
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 opacity-85 hover:opacity-100 transition-opacity duration-300">
              <span className="px-5 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl text-sm font-black text-white shadow-md">SAMSUNG</span>
              <span className="px-5 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl text-sm font-black text-white shadow-md">LG</span>
              <span className="px-5 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl text-sm font-black text-white shadow-md">SK Telecom</span>
              <span className="px-5 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl text-sm font-black text-white shadow-md">kakao</span>
              <span className="px-5 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl text-sm font-black text-white shadow-md">HYUNDAI</span>
              <span className="px-5 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl text-sm font-black text-white shadow-md">coupang</span>
            </div>
          </div>
        </section>

        {/* ── 4. 특징 섹션 (독립형 대형 글래스 카드) ── */}
        <section id="features" className="relative overflow-hidden bg-[rgba(26,26,26,0.92)] backdrop-blur-3xl border border-[rgba(197,160,89,0.35)] border-t-4 border-t-[#c5a059] rounded-[48px] px-8 py-12 md:px-16 md:py-20 lg:px-20 lg:py-24 shadow-[0_50px_100px_rgba(0,0,0,0.98),0_0_70px_rgba(197,160,89,0.08)] space-y-20">
          
          {/* 타이틀 영역 */}
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-[#c5a059] uppercase tracking-widest">WHY EVENT ROULETTE</span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">왜 Event Roulette인가요?</h2>
            
            <div className="bg-[rgba(0,0,0,0.45)] border border-[rgba(255,255,255,0.08)] rounded-[20px] py-4 px-8 text-white font-semibold text-sm md:text-base leading-relaxed inline-block word-break-keep-all shadow-inner">
              💡 단순한 룰렛 돌리기가 아닙니다. 가맹점 전용 데이터 완전 고립과 실시간 응모 마케팅의 정점을 선사합니다.
            </div>
          </div>

          {/* 4가지 특징 카드 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 카드 1 */}
            <div className="bg-[rgba(255,255,255,0.04)] p-8 rounded-[24px] border border-[rgba(255,255,255,0.08)] hover:border-[#c5a059] hover:bg-[rgba(197,160,89,0.06)] transition-all duration-300 space-y-5 text-left group shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-[rgba(197,160,89,0.15)] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                ✨
              </div>
              <h3 className="text-lg font-black text-white">직관적인 사용성</h3>
              <p className="text-gray-200 font-medium text-xs md:text-sm leading-relaxed word-break-keep-all">
                사장님의 모바일 기기 화면 클릭 몇 번으로, 당첨 물량 등록과 확률 제어를 1초 만에 수정 및 적용합니다.
              </p>
            </div>

            {/* 카드 2 */}
            <div className="bg-[rgba(255,255,255,0.04)] p-8 rounded-[24px] border border-[rgba(255,255,255,0.08)] hover:border-[#c5a059] hover:bg-[rgba(197,160,89,0.06)] transition-all duration-300 space-y-5 text-left group shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-[rgba(197,160,89,0.15)] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h3 className="text-lg font-black text-white">강력한 자동화</h3>
              <p className="text-gray-200 font-medium text-xs md:text-sm leading-relaxed word-break-keep-all">
                이벤트 당첨 시 데이터 재고가 실시간 차감되며, 축하 기프티콘 및 마케팅 문자가 자동으로 일괄 전송됩니다.
              </p>
            </div>

            {/* 카드 3 */}
            <div className="bg-[rgba(255,255,255,0.04)] p-8 rounded-[24px] border border-[rgba(255,255,255,0.08)] hover:border-[#c5a059] hover:bg-[rgba(197,160,89,0.06)] transition-all duration-300 space-y-5 text-left group shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-[rgba(197,160,89,0.15)] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🧩
              </div>
              <h3 className="text-lg font-black text-white">유연한 확장성</h3>
              <p className="text-gray-200 font-medium text-xs md:text-sm leading-relaxed word-break-keep-all">
                럭셔리 골드 테마 디자인을 자유롭게 매핑하여 오프라인 매장의 격을 더욱 고급스럽게 가꾸어 줍니다.
              </p>
            </div>

            {/* 카드 4 */}
            <div className="bg-[rgba(255,255,255,0.04)] p-8 rounded-[24px] border border-[rgba(255,255,255,0.08)] hover:border-[#c5a059] hover:bg-[rgba(197,160,89,0.06)] transition-all duration-300 space-y-5 text-left group shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-[rgba(197,160,89,0.15)] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🔒
              </div>
              <h3 className="text-lg font-black text-white">데이터 격리</h3>
              <p className="text-gray-200 font-medium text-xs md:text-sm leading-relaxed word-break-keep-all">
                완벽하게 격리 가동되는 테넌트 데이터베이스 구조로 고객 개인 정보 유출의 리스크를 완벽 차단합니다.
              </p>
            </div>
          </div>
        </section>

        {/* ── 5. 맞춤형 솔루션 섹션 (독립형 대형 글래스 카드) ── */}
        <section id="solutions" className="relative overflow-hidden bg-[rgba(26,26,26,0.92)] backdrop-blur-3xl border border-[rgba(197,160,89,0.35)] border-t-4 border-t-[#c5a059] rounded-[48px] px-8 py-12 md:px-16 md:py-20 lg:px-20 lg:py-24 shadow-[0_50px_100px_rgba(0,0,0,0.98),0_0_70px_rgba(197,160,89,0.08)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* 왼쪽 카드: 타이틀 및 안내 */}
            <div className="lg:col-span-4 bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.1)] rounded-[28px] p-8 md:p-10 space-y-6 text-left lg:sticky lg:top-32 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
              <div className="space-y-4">
                <span className="text-xs font-bold text-[#c5a059] uppercase tracking-widest">SOLUTION</span>
                <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                  다양한 이벤트를 위한<br />맞춤형 솔루션
                </h2>
              </div>
              <p className="text-gray-200 font-medium text-xs md:text-sm leading-relaxed word-break-keep-all">
                세련된 다이닝부터 전국 단위 박람회까지, Event Roulette의 고성능 응모 룰렛 엔진이 최고의 마케팅 경험을 드립니다.
              </p>
              <button 
                onClick={handleGoDemo}
                className="w-full py-3.5 text-xs font-black rounded-full text-black bg-gradient-to-r from-[#fceabb] via-[#fccd4d] to-[#f8b500] hover:scale-105 transition-transform shadow-md cursor-pointer"
              >
                데모 솔루션 확인하기 ➔
              </button>
            </div>

            {/* 오른쪽: 6가지 세부 솔루션 카드 리스트 */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
              
              <div className="bg-[rgba(255,255,255,0.04)] p-6 md:p-8 rounded-[24px] border border-[rgba(255,255,255,0.08)] hover:border-[#c5a059] hover:bg-[rgba(197,160,89,0.05)] transition-all duration-300 space-y-4 text-left shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🍽️</span>
                  <h4 className="text-base font-black text-white mt-1">프리미엄 레스토랑</h4>
                </div>
                <p className="text-gray-200 font-medium text-xs md:text-sm leading-relaxed word-break-keep-all">특별 코스 기념 식사 상품권 추첨 프로모션으로 로열 고객 확보</p>
              </div>

              <div className="bg-[rgba(255,255,255,0.04)] p-6 md:p-8 rounded-[24px] border border-[rgba(255,255,255,0.08)] hover:border-[#c5a059] hover:bg-[rgba(197,160,89,0.05)] transition-all duration-300 space-y-4 text-left shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🛍️</span>
                  <h4 className="text-lg font-black text-white mt-1">브랜드 팝업스토어</h4>
                </div>
                <p className="text-gray-200 font-medium text-xs md:text-sm leading-relaxed word-break-keep-all">신상품 출시 현장 고객 참여 유도 및 한정판 스페셜 굿즈 당첨 배포</p>
              </div>

              <div className="bg-[rgba(255,255,255,0.04)] p-6 md:p-8 rounded-[24px] border border-[rgba(255,255,255,0.08)] hover:border-[#c5a059] hover:bg-[rgba(197,160,89,0.05)] transition-all duration-300 space-y-4 text-left shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🏢</span>
                  <h4 className="text-lg font-black text-white mt-1">기업 행사 & 세미나</h4>
                </div>
                <p className="text-gray-200 font-medium text-xs md:text-sm leading-relaxed word-break-keep-all">사내 파티 및 파트너 감사 추첨을 현장에서 모바일로 간편하게 가동</p>
              </div>

              <div className="bg-[rgba(255,255,255,0.04)] p-6 md:p-8 rounded-[24px] border border-[rgba(255,255,255,0.08)] hover:border-[#c5a059] hover:bg-[rgba(197,160,89,0.05)] transition-all duration-300 space-y-4 text-left shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">☕</span>
                  <h4 className="text-lg font-black text-white mt-1">프랜차이즈 카페</h4>
                </div>
                <p className="text-gray-200 font-medium text-xs md:text-sm leading-relaxed word-break-keep-all">음료 쿠폰 즉석 회전 룰렛으로 로컬 매장 재방문 비율 대폭 개선</p>
              </div>

              <div className="bg-[rgba(255,255,255,0.04)] p-6 md:p-8 rounded-[24px] border border-[rgba(255,255,255,0.08)] hover:border-[#c5a059] hover:bg-[rgba(197,160,89,0.05)] transition-all duration-300 space-y-4 text-left shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🎪</span>
                  <h4 className="text-lg font-black text-white mt-1">대규모 축제 & 박람회</h4>
                </div>
                <p className="text-gray-200 font-medium text-xs md:text-sm leading-relaxed word-break-keep-all">수만 명이 일시에 QR코드로 진입하는 야외 축제에서도 무하중 무중단</p>
              </div>

              <div className="bg-[rgba(255,255,255,0.04)] p-6 md:p-8 rounded-[24px] border border-[rgba(255,255,255,0.08)] hover:border-[#c5a059] hover:bg-[rgba(197,160,89,0.05)] transition-all duration-300 space-y-4 text-left shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🏛️</span>
                  <h4 className="text-lg font-black text-white mt-1">공공기관 & 비영리</h4>
                </div>
                <p className="text-gray-200 font-medium text-xs md:text-sm leading-relaxed word-break-keep-all">공정성과 신뢰도가 필수적인 응모 데이터 추첨 이력 검증 체계 가동</p>
              </div>

            </div>
          </div>
        </section>

        {/* ── 6. 하단 CTA 배너 ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#222222] via-[#080808] to-[#2f2516] border-2 border-[rgba(197,160,89,0.45)] rounded-[48px] p-12 md:p-24 text-center space-y-10 shadow-[0_60px_100px_rgba(0,0,0,0.98)]">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#c5a059] opacity-[0.08] rounded-full blur-[140px] pointer-events-none"></div>

          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
            더 나은 이벤트의 시작,<br />지금 Event Roulette을 시작하세요!
          </h2>
          
          <div className="max-w-3xl mx-auto bg-[rgba(0,0,0,0.55)] border border-[rgba(255,255,255,0.1)] rounded-[24px] p-6 md:p-8 shadow-inner">
            <p className="text-white font-bold text-sm md:text-base leading-relaxed word-break-keep-all">
              단 5분 만에 우리 매장만의 고품격 룰렛 추첨 이벤트를 론칭하고,<br className="hidden sm:inline" />방문하는 소중한 손님들에게 특별한 선물 응모와 재방문 기회를 직접 제공해 보세요.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 pt-4 relative z-10">
            <button 
              onClick={handleGoDemo}
              className="px-10 py-4.5 text-xs md:text-sm font-black rounded-full text-black bg-gradient-to-r from-[#fceabb] via-[#fccd4d] to-[#f8b500] border border-[#ffeb3b] shadow-[0_0_25px_rgba(255,215,0,0.45)] hover:scale-105 hover:shadow-[0_0_45px_rgba(255,215,0,0.65)] transition-all duration-300 cursor-pointer"
            >
              무료로 시작하기
            </button>
            <button 
              onClick={handleGoAdmin}
              className="px-10 py-4.5 text-xs md:text-sm font-black rounded-full text-white bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.18)] hover:bg-[rgba(255,255,255,0.2)] hover:text-[#c5a059] transition-all duration-300 cursor-pointer"
            >
              도입 안내서 요청
            </button>
          </div>
        </section>

      </div>

      {/* ── 7. 프리미엄 푸터 (Footer) ── */}
      <footer className="border-t border-[rgba(255,255,255,0.08)] bg-[#030303] py-20 text-gray-400 text-xs mt-36">
        <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 md:grid-cols-12 gap-16">
          <div className="md:col-span-5 space-y-6 text-left">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🎡</span>
              <span className="text-lg font-black tracking-wider bg-gradient-to-r from-white to-[#c5a059] bg-clip-text text-transparent">
                Event Roulette
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed text-xs md:text-sm max-w-sm word-break-keep-all font-semibold">
              Event Roulette은 오프라인 매장의 성장을 돕는 혁신적인 스마트 이벤트 솔루션입니다. 더 나은 고객 참여를 통해 더 큰 비즈니스 가치를 창출합니다.
            </p>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8 text-left">
            <div className="space-y-4">
              <h5 className="font-bold text-gray-200 uppercase tracking-widest text-xs">제품</h5>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-white transition-colors duration-300">주요 기능</a></li>
                <li><a href="#solutions" className="hover:text-white transition-colors duration-300">이벤트 유형</a></li>
                <li><span className="text-gray-400 hover:text-white transition-colors duration-300">템플릿 갤러리</span></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="font-bold text-gray-200 uppercase tracking-widest text-xs">회사</h5>
              <ul className="space-y-2">
                <li><span className="text-gray-400 hover:text-white transition-colors duration-300">회사 소개</span></li>
                <li><span className="text-gray-400 hover:text-white transition-colors duration-300">채용 안내</span></li>
                <li><span className="text-gray-400 hover:text-white transition-colors duration-300">브랜드 가이드</span></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="font-bold text-gray-200 uppercase tracking-widest text-xs">고객지원</h5>
              <ul className="space-y-2">
                <li><span className="text-gray-400 hover:text-white transition-colors duration-300">도움말 센터</span></li>
                <li><span className="text-gray-400 hover:text-white transition-colors duration-300">1:1 문의하기</span></li>
                <li><span className="text-gray-400 hover:text-white transition-colors duration-300">시스템 모니터링</span></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="font-bold text-gray-200 uppercase tracking-widest text-xs">정책</h5>
              <ul className="space-y-2">
                <li><span className="text-gray-400 hover:text-white transition-colors duration-300">개인정보 처리방침</span></li>
                <li><span className="text-gray-400 hover:text-white transition-colors duration-300">서비스 이용약관</span></li>
                <li><span className="text-gray-400 hover:text-white transition-colors duration-300">쿠키 설정</span></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-10 mt-16 pt-8 border-t border-[rgba(255,255,255,0.03)] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <p className="text-[10px] text-gray-400 leading-relaxed max-w-xl font-medium">
            상호명: Event Roulette | 대표자: 크린 | 이메일: info@clean-member.com | 전화번호: 02-1234-5678<br />
            주소: 서울특별시 강남구 테헤란로 123 | 사업자등록번호: 120-00-00000
          </p>
          <p className="text-[10px] text-gray-400 font-bold">
            &copy; {new Date().getFullYear()} Event Roulette. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default NewLanding;
