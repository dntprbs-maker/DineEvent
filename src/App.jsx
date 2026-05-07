import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Event from './pages/Event'
import Location from './pages/Location'

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout'
import AdminInfo from './pages/admin/AdminInfo'
import AdminMenu from './pages/admin/AdminMenu'
import AdminEvent from './pages/admin/AdminEvent'
import AdminMessages from './pages/admin/AdminMessages'

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// 전역 스타일 추가 (입력창 넘침 방지)
const GlobalStyle = () => (
  <style dangerouslySetInnerHTML={{__html: `
    * { box-sizing: border-box; }
    input, textarea, select { max-width: 100%; }
    body { overflow-x: hidden; }
  `}} />
);

const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="app">
      <GlobalStyle />
      {!isAdminPath && <Navbar />}
      
      <main style={{ paddingTop: isAdminPath ? '0' : '80px' }}>
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/event" element={<Event />} />
          <Route path="/location" element={<Location />} />

          {/* Admin Routes (Nested) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/info" replace />} />
            <Route path="info" element={<AdminInfo />} />
            <Route path="menu" element={<AdminMenu />} />
            <Route path="event" element={<AdminEvent />} />
            <Route path="messages" element={<AdminMessages />} />
          </Route>
        </Routes>
      </main>

      {!isAdminPath && (
        <footer style={{ padding: '4rem', textAlign: 'center', borderTop: '1px solid #222' }}>
          <p style={{ color: 'var(--text-muted)' }}>&copy; 2026 DINE EVENT. All rights reserved.</p>
          <button 
            onClick={() => {
              window.open('/admin', '_blank', 'width=1200,height=900');
            }} 
            style={{ marginTop: '2rem', background: 'transparent', border: '1px solid #333', color: '#444', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            관리자 센터 새 창으로 열기
          </button>
        </footer>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  )
}

export default App
