import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const navItems = [
    { path: '/admin/info', label: '🏠 식당관리' },
    { path: '/admin/menu', label: '🍴 메뉴관리' },
    { path: '/admin/event', label: '⚙️ 이벤트' },
    { path: '/admin/messages', label: '📋 응모내역' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#050505' }}>
      {/* Sticky Header Section */}
      <div style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        background: '#050505', 
        borderBottom: '1px solid #222',
        padding: '1.5rem 0 1rem 0'
      }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>사장님 관리 센터</h2>
            <NavLink to="/" style={{ textDecoration: 'none', padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.8rem', background: '#222', color: '#888' }}>나가기</NavLink>
          </div>
          
          {/* 한 줄 가로 스크롤 메뉴 */}
          {/* 한 줄 가로 스크롤 메뉴 */}
          <nav className="admin-nav-scroll" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.5rem',
            padding: '0.5rem 0',
            width: '100%'
          }}>
            <style dangerouslySetInnerHTML={{__html: `.admin-nav-scroll::-webkit-scrollbar { display: none; }`}} />
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  textDecoration: 'none',
                padding: '0.6rem 0.4rem',
                borderRadius: '8px',
                fontSize: '0.7rem',
                fontWeight: '600',
                flexShrink: 1, 
                  transition: 'all 0.3s ease',
                  background: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                  color: isActive ? '#000' : '#888',
                  border: '1px solid transparent',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                })}
              >
                {item.label}
              </NavLink>
            ))}
            <div style={{ minWidth: '1.5rem', flexShrink: 0 }}></div> {/* 마지막 아이템 뒤 여백 */}
          </nav>

        </div>
      </div>

      {/* Content Section: 1200px 고정 및 중앙 정렬 */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '3rem 2rem' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
