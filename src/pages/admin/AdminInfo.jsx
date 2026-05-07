import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AdminInfo = () => {
  const [homeSettings, setHomeSettings] = useState({ 
    topLabel: 'PREMIUM DINING EXPERIENCE',
    title: '다인이벤트의 특별한\\n미식 축제에 초대합니다', 
    subtitle: '최고급 식재료와 셰프의 장인정신이 깃든 시즌 메뉴를 지금 바로 만나보세요.', 
    heroImage: '' 
  });
  
  const [locationSettings, setLocationSettings] = useState({ address: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const homeDoc = await getDoc(doc(db, 'settings', 'home'));
        if (homeDoc.exists()) setHomeSettings(prev => ({...prev, ...homeDoc.data()}));

        const locDoc = await getDoc(doc(db, 'settings', 'location'));
        if (locDoc.exists()) setLocationSettings(locDoc.data());
      } catch (err) {
        console.error("Data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setHomeSettings({...homeSettings, heroImage: reader.result});
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      await setDoc(doc(db, 'settings', 'home'), homeSettings);
      await setDoc(doc(db, 'settings', 'location'), locationSettings);
      alert('클라우드에 설정이 저장되었습니다! 모든 기기에 즉시 반영됩니다.');
    } catch (err) {
      alert('저장 실패: Firestore 설정을 확인해주세요.');
      console.error(err);
    }
  };

  if (loading) return <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>데이터 불러오는 중...</div>;

  return (
    <div className="glass" style={{ padding: '2rem' }}>
      <h3 style={{ marginBottom: '2rem', color: 'var(--primary)' }}>🏠 식당 및 사이트 문구 관리 [v2.5-ULTIMATE-STABLE]</h3>
      
      <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h4 style={{ color: 'var(--primary)', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>홈 화면 문구</h4>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>상단 강조 문구</label>
            <input type="text" value={homeSettings.topLabel} onChange={(e) => setHomeSettings({...homeSettings, topLabel: e.target.value})} style={{ width: '100%', background: '#000', border: '1px solid #333', padding: '0.8rem', color: '#fff', borderRadius: '8px' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>메인 대제목</label>
            <textarea value={homeSettings.title} onChange={(e) => setHomeSettings({...homeSettings, title: e.target.value})} style={{ width: '100%', background: '#000', border: '1px solid #333', padding: '0.8rem', color: '#fff', borderRadius: '8px', height: '80px' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>메인 소제목</label>
            <textarea value={homeSettings.subtitle} onChange={(e) => setHomeSettings({...homeSettings, subtitle: e.target.value})} style={{ width: '100%', background: '#000', border: '1px solid #333', padding: '0.8rem', color: '#fff', borderRadius: '8px', height: '60px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>메인 배경 이미지</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input type="file" accept="image/*" onChange={handleFileUpload} />
              {homeSettings.heroImage && <button onClick={() => setHomeSettings({...homeSettings, heroImage: ''})} style={{ background: '#ff4444', color: '#fff', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}>삭제</button>}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h4 style={{ color: 'var(--primary)', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>위치 정보 관리</h4>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>식당 주소</label>
            <input type="text" value={locationSettings.address} onChange={(e) => setLocationSettings({address: e.target.value})} style={{ width: '100%', background: '#000', border: '1px solid #333', padding: '1rem', color: '#fff', borderRadius: '8px' }} />
          </div>
        </div>
      </div>

      <button className="btn-primary" onClick={handleSave} style={{ width: '100%', marginTop: '3rem', padding: '1rem', fontSize: '1rem' }}>클라우드에 저장하기</button>
    </div>
  );
};

export default AdminInfo;
