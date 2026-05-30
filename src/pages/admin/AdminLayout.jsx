import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useTenant } from '../../context/TenantContext';

const AdminLayout = () => {
  const { tenantId } = useTenant();
  
  // 사용자의 요청에 따라 '메뉴관리' 탭을 목록에서 제거하여 숨깁니다.
  const navItems = [
    { path: `/${tenantId}/admin/info`, label: '식당관리', icon: '🏠', color: '#4ade80', glow: 'rgba(74, 222, 128, 0.5)' },
    { path: `/${tenantId}/admin/event`, label: '이벤트', icon: '⚙️', color: '#fcd34d', glow: 'rgba(252, 211, 77, 0.5)' },
    { path: `/${tenantId}/admin/messages`, label: '고객 관리', icon: '👥', color: '#c084fc', glow: 'rgba(192, 132, 252, 0.5)' },
  ];

  const isMobile = useIsMobile(768);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{ minHeight: '100vh', background: '#050505' }}>
      {/* Header Section */}
      <div style={{ 
        position: 'fixed',
        top: 0, 
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 1000, 
        background: 'rgba(5, 5, 5, 0.98)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: isMobile ? '1rem 0' : '2rem 0'
      }}>
        <div className={isMobile ? "" : "container"}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: isMobile ? '1rem' : '2rem',
            padding: isMobile ? '0 1rem' : '0' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button 
                onClick={() => navigate(-1)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  backdropFilter: 'blur(10px)'
                }}
              >
                ←
              </button>
              <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: 0, fontWeight: '900', letterSpacing: '-0.02em' }}>
                사장님 관리 센터
              </h2>
            </div>
            <NavLink to={`/${tenantId}`} style={{ 
              textDecoration: 'none', padding: '8px 20px', borderRadius: '12px', fontSize: '13px', 
              background: 'rgba(255,255,255,0.05)', color: '#666', border: '1px solid rgba(255,255,255,0.1)'
            }}>나가기</NavLink>
          </div>
          
          <nav style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: isMobile ? '10px' : '25px',
            padding: isMobile ? '0 1rem' : '0',
            width: '100%',
          }}>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  padding: isMobile ? '10px 8px' : '15px 30px',
                  borderRadius: '25px',
                  fontSize: isMobile ? '12px' : '15px',
                  fontWeight: '900',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: isActive 
                    ? `linear-gradient(135deg, ${item.color}22, #000)` 
                    : 'rgba(255,255,255,0.03)',
                  color: isActive ? '#fff' : '#888',
                  border: isActive 
                    ? `2px solid ${item.color}` 
                    : '2px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: isMobile ? '0' : '15px',
                  boxShadow: isActive ? `0 0 30px ${item.glow}` : 'none',
                  transform: isActive ? 'scale(1.02)' : 'none',
                  backdropFilter: 'blur(15px)',
                  position: 'relative',
                  overflow: 'hidden'
                })}
              >
                {({ isActive }) => (
                  <>
                    {/* 글로시 광택 효과 */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
                      background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), transparent)',
                      zIndex: 0
                    }} />
                    
                    {!isMobile && (
                      <div style={{ 
                        width: '36px', 
                        height: '36px', 
                        borderRadius: '10px',
                        background: isActive ? item.color : '#222',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                        zIndex: 1,
                        transition: 'all 0.3s'
                      }}>
                        {item.icon}
                      </div>
                    )}
                    <span style={{ zIndex: 1, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* 헤더 높이만큼 콘텐츠 영역을 아래로 밀어내기 */}
      <div className="admin-layout-wrapper" style={{ paddingTop: isMobile ? '130px' : '175px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
