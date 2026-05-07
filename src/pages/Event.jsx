import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import RouletteGame from '../components/RouletteGame';

const Event = () => {
  return (
    <section style={{ background: '#0a0a0a', padding: '6rem 0', minHeight: '100vh' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        {/* 요청사항: 상단 제목 삭제 */}
        
        {/* 룰렛 컴포넌트 호출 */}
        <RouletteGame />

        <div style={{ marginTop: '4rem' }}>
          <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none', borderBottom: '1px solid var(--primary)', paddingBottom: '4px', fontSize: '0.9rem' }}>
            메인 페이지로 돌아가기
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Event;
