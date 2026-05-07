import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isAdmin = location.search.includes('admin');

  return (
    <nav className="navbar" style={{ position: 'fixed', top: 0, width: '100%', padding: '0.8rem 1rem', zIndex: 1000, background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(10px)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <h2 style={{ color: 'var(--primary)', letterSpacing: '1px', fontSize: '1.1rem', margin: 0 }}>DINE EVENT</h2>
        </Link>
        <div className="nav-links-scroll" style={{ 
          display: 'flex', 
          gap: '0.8rem', 
          flexWrap: 'nowrap', 
          padding: '0.4rem 0',
          justifyContent: 'flex-end',
          flex: 1,
          overflowX: 'auto',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch'
        }}>
          <style dangerouslySetInnerHTML={{__html: `.nav-links-scroll::-webkit-scrollbar { display: none; }`}} />
          <Link to="/" style={{ color: location.pathname === '/' ? 'var(--primary)' : '#fff', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600, flexShrink: 0 }}>HOME</Link>
          <Link to="/menu" style={{ color: location.pathname === '/menu' ? 'var(--primary)' : '#fff', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600, flexShrink: 0 }}>MENU</Link>
          <Link to="/event" style={{ color: location.pathname === '/event' ? 'var(--primary)' : '#fff', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600, flexShrink: 0 }}>EVENT</Link>
          <Link to="/location" style={{ color: location.pathname === '/location' ? 'var(--primary)' : '#fff', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600, flexShrink: 0 }}>MAP</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
