import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState(['주메뉴', '사이드', '음료 및 주류']); // [수정] 초기값 유지 후 DB에서 업데이트
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const menuDoc = await getDoc(doc(db, 'content', 'menu'));
        if (menuDoc.exists()) {
          const data = menuDoc.data();
          setMenuItems(data.items || []);
          // [핵심 수정] 관리자에서 추가한 카테고리 목록을 실시간으로 반영
          if (data.categories && data.categories.length > 0) {
            setCategories(data.categories);
          }
        }
      } catch (err) {
        console.error("Menu fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuData();
  }, []);

  if (loading) return <div className="container" style={{ padding: '10rem 0', textAlign: 'center', color: 'var(--primary)' }}>메뉴를 불러오는 중입니다...</div>;

  return (
    <section className="container" style={{ padding: '8rem 1.5rem', minHeight: '100vh' }}>
      {categories.map(cat => {
        // 해당 카테고리에 속한 메뉴만 필터링 (카테고리가 없는 메뉴는 기본적으로 '주메뉴'로 취급하거나 필터링)
        const filteredItems = menuItems.filter(item => (item.category || '주메뉴') === cat);
        if (filteredItems.length === 0) return null;

        return (
          <div key={cat} style={{ marginBottom: '5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--primary)', whiteSpace: 'nowrap' }}>{cat}</h3>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, #333, transparent)' }}></div>
            </div>
            
            {/* 사장님 요청: 3열 그리드 레이아웃 */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '2.5rem', 
              width: '100%',
              alignItems: 'start'
            }}>
              {filteredItems.map((item, i) => (
                <MenuCard key={i} name={item.name} price={Number(item.price || 0).toLocaleString()} desc={item.desc} img={item.img} />
              ))}
            </div>
          </div>
        );
      })}

      <div style={{ textAlign: 'center', marginTop: '6rem' }}>
        <Link to="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', padding: '1.2rem 4rem', fontSize: '1.1rem' }}>
          메인으로 돌아가기
        </Link>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 1024px) {
          div[style*="display: grid"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          div[style*="display: grid"] {
            grid-template-columns: repeat(1, 1fr) !important;
          }
        }
      `}} />
    </section>
  );
};

function MenuCard({ name, price, desc, img }) {
  return (
    <div className="menu-card glass" style={{ 
      padding: '1.5rem', 
      borderRadius: '20px', 
      width: '100%',
      transition: 'transform 0.3s ease',
      border: '1px solid rgba(255,255,255,0.05)'
    }}>
      <div style={{ 
        background: img ? `url(${img})` : 'rgba(255,255,255,0.02)', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '180px', 
        borderRadius: '15px', 
        marginBottom: '1.5rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        {!img && <span style={{ color: '#333', fontSize: '0.9rem', fontWeight: '900', letterSpacing: '2px' }}>DINE EVENT</span>}
      </div>
      <div style={{ textAlign: 'left' }}>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.6rem', color: '#fff', fontWeight: '700' }}>{name}</h4>
        <p style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '1.3rem', marginBottom: '1rem' }}>₩{price}</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', height: '3rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{desc}</p>
      </div>
    </div>
  )
}

export default Menu;
