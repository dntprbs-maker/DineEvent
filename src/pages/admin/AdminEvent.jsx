import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AdminEvent = () => {
  const [prizes, setPrizes] = useState([
    { text: '', totalCount: 0, currentCount: 0 },
    { text: '', totalCount: 0, currentCount: 0 },
    { text: '', totalCount: 0, currentCount: 0 },
    { text: '', totalCount: 0, currentCount: 0 }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrizes = async () => {
      try {
        const prizeDoc = await getDoc(doc(db, 'content', 'prizes'));
        if (prizeDoc.exists()) {
          setPrizes(prizeDoc.data().prizes || []);
        } else {
          const defaultP = [
            { text: '맥주 한 병', totalCount: 10, currentCount: 10 },
            { text: '골뱅이 안주 제공 (이벤트용)', totalCount: 5, currentCount: 5 },
            { text: '꽝', totalCount: 999, currentCount: 999 },
            { text: '사이다 한 병', totalCount: 20, currentCount: 20 }
          ];
          setPrizes(defaultP);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrizes();
  }, []);

  const handleSave = async () => {
    try {
      await setDoc(doc(db, 'content', 'prizes'), { prizes });
      alert('이벤트 설정이 클라우드에 저장되었습니다!');
    } catch (err) {
      alert('저장 실패');
    }
  };

  const updatePrize = (index, field, value) => {
    setPrizes(prev => {
      const n = prev.map((p, i) => {
        if (i === index) {
          const updated = { ...p, [field]: value };
          if (field === 'totalCount') updated.currentCount = value;
          return updated;
        }
        return p;
      });
      return n;
    });
  };

  if (loading) return <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>데이터 로딩 중...</div>;

  return (
    <div className="glass" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h3 style={{ color: 'var(--primary)', marginBottom: '2rem' }}>⚙️ 이벤트 관리 (Cloud)</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {prizes.map((p, i) => (
          <div key={i} className="glass" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-end', background: 'rgba(0,0,0,0.2)', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 100%' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>슬롯 {i + 1} 경품명</label>
              <input type="text" value={p.text} onChange={(e) => updatePrize(i, 'text', e.target.value)} style={{ width: '100%', background: '#000', border: '1px solid #333', padding: '0.8rem', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: '1 1 45%' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>전체 수량</label>
              <input type="number" value={p.totalCount} onChange={(e) => updatePrize(i, 'totalCount', parseInt(e.target.value) || 0)} style={{ width: '100%', background: '#000', border: '1px solid #333', padding: '0.8rem', color: '#fff', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: '1 1 45%' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.75rem', color: '#555' }}>잔여</label>
              <div style={{ padding: '0.8rem', background: '#111', borderRadius: '8px', textAlign: 'center', color: p.currentCount <= 0 ? '#ff4444' : 'var(--primary)', fontWeight: 'bold' }}>{p.currentCount}</div>
            </div>
          </div>
        ))}
      </div>
      <button className="btn-primary" onClick={handleSave} style={{ width: '100%', marginTop: '3rem', padding: '1.5rem', fontSize: '1.1rem' }}>이벤트 클라우드 저장</button>
    </div>
  );
};

export default AdminEvent;
