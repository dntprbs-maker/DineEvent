import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import '../CompanyIntroV2.css'; // 기존 CSS 공유


/**
 * IntroLayout — 회사 소개 페이지 공통 레이아웃
 * - 상단 고정 네비게이션 (페이지 전환 방식)
 * - <Outlet /> 을 통해 각 섹션 페이지 렌더링
 * - 공통 푸터
 */
const IntroLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 현재 경로 기준으로 활성 메뉴 판별
  const currentPath = location.pathname;

  // 네비 메뉴 항목 정의
  const navItems = [
    { label: '서비스 소개', path: '/' },
    { label: '활용사례',   path: '/intro/cases' },
    { label: '핵심기능',   path: '/intro/functions' },
    { label: '요금제',     path: '/intro/pricing' },
    { label: 'FAQ',        path: '/intro/faq' },
  ];

  return (
    <div className="v2-root">
      {/* 배경 후광 */}
      <div className="v2-glow" />

      {/* ── 상단 고정 네비게이션 ── */}
      <nav className="v2-nav">
        {/* 로고 클릭 → 홈(서비스 소개)으로 이동 */}
        <div
          className="v2-nav-logo"
          onClick={() => navigate('/')}
        >
          <span className="v2-nav-logo-icon">🎡</span>
          <span className="v2-nav-logo-text">이벤트 룰렛</span>
        </div>

        <div className="v2-nav-links">
          {navItems.map((item) => {
            // 현재 경로와 메뉴 경로가 일치하면 활성(골드) 표시
            const isActive =
              item.path === '/'
                ? currentPath === '/'
                : currentPath.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`v2-nav-link ${isActive ? 'v2-nav-link--active' : ''}`}
                style={{ textDecoration: 'none' }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── 페이지 전환 시 슬라이드 인 애니메이션 ── */}
      <main
        key={currentPath} // 경로 바뀔 때마다 리렌더(애니메이션 재실행)
        style={{ animation: 'introPageIn 0.35s ease forwards' }}
      >
        <Outlet />
      </main>

      {/* ── 공통 푸터 ── */}
      <footer className="v2-footer">
        <div className="v2-footer-inner">
          <div>
            <div className="v2-footer-logo">
              <span>🎡</span>
              <span>이벤트 룰렛</span>
            </div>
            <p className="v2-footer-text">
              오프라인 매장의 효율적인 스마트 마케팅을 위한 독립 테넌트 기반의 안전한 룰렛 솔루션
            </p>
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
          <span
            onClick={() => navigate('/master-admin')}
            style={{ cursor: 'pointer' }}
            title="슈퍼 관리자 로그인"
          >
            © {new Date().getFullYear()} 주식회사 이벤트룰렛. All rights reserved.
          </span>
          <span className="v2-footer-gold">✦ Premium Gold SaaS V2 Edition</span>
        </div>
      </footer>

      {/* 페이지 전환 애니메이션 CSS */}
      <style>{`
        @keyframes introPageIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default IntroLayout;
