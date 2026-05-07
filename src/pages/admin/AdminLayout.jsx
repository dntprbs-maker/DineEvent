import { NavLink, Outlet } from 'react-router-dom';
import { useIsMobile } from '../../hooks/useIsMobile';

const AdminLayout = () => {
  // 사용자의 요청에 따라 '메뉴관리' 탭을 목록에서 제거하여 숨깁니다.
  const navItems = [
    { path: '/admin/info', label: '식당관리', icon: '🏠' },
    { path: '/admin/event', label: '이벤트', icon: '⚙️' },
    { path: '/admin/messages', label: '응모내역', icon: '📋' },
  ];

  const isMobile = useIsMobile(768);

  return (
    <div style={{ minHeight: '100vh', background: '#050505' }}>
      {/* Header Section */}
      <div style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, 
        background: '#050505', 
        borderBottom: isMobile ? '1px solid #111' : '1px solid #222',
        padding: isMobile ? '0.5rem 0 0.15rem 0' : '1.5rem 0 1rem 0'
      }}>
        <div className={isMobile ? "" : "container"}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: isMobile ? '0.4rem' : '1.5rem',
            padding: isMobile ? '0 1rem' : '0' 
          }}>
            <h2 style={{ 
              fontSize: isMobile ? 'clamp(1rem, 5vw, 1.4rem)' : '1.4rem', 
              color: '#fff', 
              margin: 0, 
              fontWeight: '800', 
              textAlign: 'left',
              whiteSpace: 'nowrap'
            }}>
              사장님 관리 센터
            </h2>
            <NavLink to="/" style={{ 
              textDecoration: 'none', 
              padding: isMobile ? '0.3rem 0.6rem' : '0.4rem 1rem', 
              borderRadius: '6px', 
              fontSize: isMobile ? '0.7rem' : '0.8rem', 
              background: '#222', 
              color: '#888',
              marginLeft: '10px'
            }}>나가기</NavLink>
          </div>
          
          <nav style={{
            display: 'flex',
            justifyContent: isMobile ? 'space-between' : 'flex-start',
            gap: isMobile ? '4px' : '0.8rem',
            padding: isMobile ? '0.15rem 1rem' : '0.5rem 0',
            width: '100%',
            background: isMobile ? 'transparent' : 'none',
            display: isMobile ? 'flex' : 'grid',
            gridTemplateColumns: isMobile ? 'none' : 'repeat(3, 1fr)'
          }}>
            {!isMobile && <style dangerouslySetInnerHTML={{__html: `.admin-nav-scroll::-webkit-scrollbar { display: none; }`}} />}
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  padding: isMobile ? '0.4rem 0.2rem' : '0.8rem 0.4rem',
                  borderRadius: isMobile ? '0' : '10px',
                  fontSize: isMobile ? 'clamp(0.7rem, 3.5vw, 0.85rem)' : '0.85rem',
                  fontWeight: '700',
                  transition: 'all 0.3s ease',
                  background: isMobile ? 'transparent' : (isActive ? 'var(--primary)' : 'rgba(255,255,255,0.05)'),
                  color: isActive ? (isMobile ? 'var(--primary)' : '#000') : '#888',
                  borderBottom: isMobile && isActive ? '2px solid var(--primary)' : 'none',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  flexDirection: isMobile ? 'row' : 'column',
                  alignItems: 'center',
                  gap: isMobile ? '3px' : '5px',
                  flex: isMobile ? 1 : 'none'
                })}
              >
                <span style={{ fontSize: isMobile ? 'clamp(0.9rem, 4vw, 1.1rem)' : 'inherit' }}>{item.icon}</span>
                <span style={{ display: isMobile ? 'inline' : 'inline' }}>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="admin-layout-wrapper">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
