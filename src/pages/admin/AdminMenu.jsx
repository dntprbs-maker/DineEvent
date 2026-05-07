import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AdminMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState(['주메뉴', '사이드', '음료 및 주류']);
  const [activeTab, setActiveTab] = useState('전체'); // 기본값: 전체
  const [loading, setLoading] = useState(true);
  const [newCat, setNewCat] = useState('');

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const menuDoc = await getDoc(doc(db, 'content', 'menu'));
        if (menuDoc.exists()) {
          const data = menuDoc.data();
          setMenuItems(data.items || []);
          if (data.categories) setCategories(data.categories);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const handleSave = async () => {
    try {
      await setDoc(doc(db, 'content', 'menu'), { items: menuItems, categories: categories });
      alert('클라우드에 모든 설정이 저장되었습니다!');
    } catch (err) {
      alert('저장 실패');
    }
  };

  const addItem = () => {
    const targetCat = activeTab === '전체' ? (categories[0] || '주메뉴') : activeTab;
    setMenuItems([...menuItems, { name: '', price: '', desc: '', img: '', category: targetCat }]);
  };

  const removeItem = (index) => {
    const newList = [...menuItems];
    newList.splice(index, 1);
    setMenuItems(newList);
  };

  const updateItem = (index, field, value) => {
    const newList = [...menuItems];
    newList[index][field] = value;
    setMenuItems(newList);
  };

  const addCategory = () => {
    if (newCat && !categories.includes(newCat)) {
      setCategories([...categories, newCat]);
      setNewCat('');
    }
  };

  const deleteCategory = (cat) => {
    if (categories.length <= 1) return alert('최소 한 개의 카테고리는 필요합니다.');
    if (window.confirm(`${cat} 카테고리를 삭제하시겠습니까? 해당 카테고리의 메뉴들은 전체 목록에서 계속 확인 가능합니다.`)) {
      setCategories(categories.filter(c => c !== cat));
      setMenuItems(menuItems.map(item => item.category === cat ? { ...item, category: '' } : item));
      if (activeTab === cat) setActiveTab('전체');
    }
  };

  if (loading) return <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>데이터 로딩 중...</div>;

  const filteredItems = activeTab === '전체' ? menuItems : menuItems.filter(item => (item.category || '주메뉴') === activeTab);

  return (
    <div className="admin-content-inner" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div className="glass" style={{ padding: '2rem' }}>
        <h3 style={{ color: 'var(--primary)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🍴 메뉴 및 카테고리 통합 관리 (Cloud)
        </h3>

        {/* 카테고리 마스터 편집 */}
        <div style={{ marginBottom: '3rem', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '20px', border: '1px solid #222' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 'bold' }}>🏷️ 카테고리 설정</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {categories.map(cat => (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', background: '#111', border: '1px solid #333', padding: '0.6rem 1.2rem', borderRadius: '40px', gap: '0.8rem', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>{cat}</span>
                <button onClick={() => deleteCategory(cat)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}>×</button>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="text" value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="새 카테고리 입력" style={{ background: '#000', border: '1px solid #444', padding: '0.7rem 1.2rem', color: '#fff', borderRadius: '40px', fontSize: '0.9rem', width: '180px' }} />
              <button onClick={addCategory} style={{ background: 'var(--primary)', color: '#000', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '40px', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer' }}>추가</button>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '0.8rem' }}>
          <button 
            onClick={() => setActiveTab('전체')}
            style={{ 
              padding: '1rem 2.5rem', borderRadius: '15px', border: 'none', cursor: 'pointer', fontWeight: '800', fontSize: '1rem',
              background: activeTab === '전체' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              color: activeTab === '전체' ? '#000' : '#888',
              boxShadow: activeTab === '전체' ? '0 10px 20px rgba(197, 160, 89, 0.2)' : 'none',
              transition: 'all 0.3s'
            }}
          >
            전체 ({menuItems.length})
          </button>
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveTab(cat)}
              style={{ 
                padding: '1rem 2.5rem', borderRadius: '15px', border: 'none', cursor: 'pointer', fontWeight: '800', fontSize: '1rem',
                background: activeTab === cat ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                color: activeTab === cat ? '#000' : '#888',
                boxShadow: activeTab === cat ? '0 10px 20px rgba(197, 160, 89, 0.2)' : 'none',
                transition: 'all 0.3s',
                whiteSpace: 'nowrap'
              }}
            >
              {cat} ({menuItems.filter(item => item.category === cat).length})
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h4 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: '700' }}>[{activeTab}] 메뉴 편집 리스트</h4>
          <button className="btn-primary" onClick={addItem} style={{ padding: '0.8rem 1.8rem', fontSize: '0.95rem' }}>+ 새로운 메뉴 추가</button>
        </div>

        {/* 메뉴 리스트: 가로폭 제한 및 그리드 배치 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2rem' }}>
          {filteredItems.map((item, i) => {
            const realIndex = menuItems.indexOf(item);
            return (
              <div key={realIndex} className="glass" style={{ padding: '2rem', background: 'rgba(0,0,0,0.3)', border: '1px solid #333', borderRadius: '25px' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>메뉴 명칭</label>
                  <input type="text" value={item.name} onChange={(e) => updateItem(realIndex, 'name', e.target.value)} style={{ width: '100%', background: '#000', border: '1px solid #444', padding: '1.2rem', color: '#fff', borderRadius: '12px', fontSize: '1rem' }} placeholder="메뉴 이름" />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>판매 가격</label>
                    <input type="number" value={item.price} onChange={(e) => updateItem(realIndex, 'price', e.target.value)} style={{ width: '100%', background: '#000', border: '1px solid #444', padding: '1.2rem', color: '#fff', borderRadius: '12px', fontSize: '1rem' }} placeholder="가격(숫자)" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>소속 카테고리</label>
                    <select value={item.category || categories[0]} onChange={(e) => updateItem(realIndex, 'category', e.target.value)} style={{ width: '100%', background: '#000', border: '1px solid #444', padding: '1.2rem', color: '#fff', borderRadius: '12px', fontSize: '1rem', cursor: 'pointer' }}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>메뉴 설명 (짧은 문구)</label>
                  <textarea value={item.desc} onChange={(e) => updateItem(realIndex, 'desc', e.target.value)} style={{ width: '100%', height: '100px', background: '#000', border: '1px solid #444', padding: '1.2rem', color: '#fff', borderRadius: '12px', resize: 'none', fontSize: '0.95rem', lineHeight: '1.5' }} placeholder="메뉴에 대한 설명을 적어주세요" />
                </div>

                <button onClick={() => removeItem(realIndex)} style={{ width: '100%', background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', color: '#ff4444', padding: '1rem', borderRadius: '12px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold', transition: 'all 0.3s' }} onMouseOver={(e) => e.target.style.background='rgba(255,68,68,0.2)'} onMouseOut={(e) => e.target.style.background='rgba(255,68,68,0.1)'}>
                  🗑️ 이 메뉴 영구 삭제
                </button>
              </div>
            );
          })}
          {filteredItems.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem 0', color: '#444', fontSize: '1.1rem' }}>
              해당 카테고리에 등록된 메뉴가 없습니다.
            </div>
          )}
        </div>

        <button className="btn-primary" onClick={handleSave} style={{ width: '100%', marginTop: '5rem', padding: '2rem', fontSize: '1.4rem', borderRadius: '20px', boxShadow: '0 15px 30px rgba(197, 160, 89, 0.3)' }}>
          💾 모든 변경 사항 클라우드에 일괄 저장
        </button>
      </div>
    </div>
  );
};

export default AdminMenu;
