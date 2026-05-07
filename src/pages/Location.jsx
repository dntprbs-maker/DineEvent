import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Location = () => {
  const [address, setAddress] = useState('서울특별시 강남구 테헤란로 123, 다인타워 1층');

  useEffect(() => {
    const fetchLoc = async () => {
      try {
        const locDoc = await getDoc(doc(db, 'settings', 'location'));
        if (locDoc.exists()) setAddress(locDoc.data().address);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLoc();
  }, []);

  return (
    <section className="container" style={{ padding: '8rem 0', textAlign: 'center', minHeight: '100vh' }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>{address}</p>
      
      <div className="glass" style={{ width: '100%', height: '450px', overflow: 'hidden', marginBottom: '4rem' }}>
        <div style={{ background: '#1a1a1a', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
            [ {address} ]<br/>
            위치에 대한 구글 지도 연동 영역
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Link to="/" className="btn-primary" style={{ textDecoration: 'none' }}>
          메인으로 돌아가기
        </Link>
      </div>
    </section>
  );
};

export default Location;
