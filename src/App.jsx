import React, { useState, useEffect } from 'react'
import { 
  createBrowserRouter, 
  RouterProvider, 
  Navigate, 
  useLocation, 
  useNavigate, 
  Outlet 
} from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Event from './pages/Event'
import Location from './pages/Location'
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

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

// 스와이프 내비게이션 핸들러
const SwipeNavigation = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const pages = ['/', '/menu', '/event', '/location'];
  const isAdminPath = location.pathname.startsWith('/admin');
  const minSwipeDistance = 70;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || isAdminPath) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    const currentIndex = pages.indexOf(location.pathname);
    if (isLeftSwipe && currentIndex < pages.length - 1) navigate(pages[currentIndex + 1]);
    else if (isRightSwipe && currentIndex > 0) navigate(pages[currentIndex - 1]);
  };

  return (
    <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} style={{ minHeight: '100vh' }}>
      {children}
    </div>
  );
};

const GlobalStyle = () => (
  <style dangerouslySetInnerHTML={{__html: `
    * { box-sizing: border-box; }
    body { overflow-x: hidden; touch-action: pan-y; }
    @media (max-width: 768px) {
      .app-footer { padding: 2.5rem 1rem !important; }
      .footer-copyright { font-size: 0.75rem !important; word-break: keep-all !important; line-height: 1.5 !important; }
      .admin-open-link { font-size: 0.7rem !important; padding: 0.4rem 0.8rem !important; }
    }
  `}} />
);

// [NEW] Root Layout for Public Pages
const RootLayout = () => {
  const location = useLocation();
  const [brandName, setBrandName] = useState('DINE EVENT');

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const homeDoc = await getDoc(doc(db, 'settings', 'home'));
        if (homeDoc.exists() && homeDoc.data().brandName) setBrandName(homeDoc.data().brandName);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBrand();
  }, []);

  return (
    <SwipeNavigation>
      <div className="app">
        <ScrollToTop />
        <GlobalStyle />
        <Navbar />
        <main style={{ paddingTop: '80px' }}>
          <Outlet />
        </main>
        <footer className="app-footer" style={{ padding: '4rem 2rem', textAlign: 'center', borderTop: '1px solid #111', background: '#000' }}>
          <p className="footer-copyright" style={{ color: '#444', fontSize: '0.85rem', maxWidth: '300px', margin: '0 auto' }}>
            &copy; {new Date().getFullYear()} {brandName}. All rights reserved.
          </p>
          <div style={{ marginTop: '1.5rem' }}>
            <a 
              href="/admin" 
              target="_blank" 
              rel="noopener noreferrer"
              className="admin-open-link"
              style={{ 
                display: 'inline-block', textDecoration: 'none', background: 'transparent', border: '1px solid #222', color: '#333', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.3s ease', zIndex: 99999, position: 'relative'
              }}
            >
              관리자 센터 새 창으로 열기
            </a>
          </div>
        </footer>
      </div>
    </SwipeNavigation>
  );
};

// [NEW] Admin Root to bypass Navbar/Footer
const AdminRoot = () => (
  <div className="admin-app">
    <GlobalStyle />
    <AdminLayout />
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "menu", element: <Menu /> },
      { path: "event", element: <Event /> },
      { path: "location", element: <Location /> },
    ]
  },
  {
    path: "/admin",
    element: <AdminRoot />,
    children: [
      { index: true, element: <Navigate to="/admin/info" replace /> },
      { path: "info", element: <AdminInfo /> },
      { path: "menu", element: <AdminMenu /> },
      { path: "event", element: <AdminEvent /> },
      { path: "messages", element: <AdminMessages /> },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />
}

export default App
