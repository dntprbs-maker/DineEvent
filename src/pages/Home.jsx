import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import heroImg from '../assets/hero.png';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Home = () => {
  const [settings, setSettings] = useState({ 
    brandName: '다인이벤트',
    topLabel: 'PREMIUM DINING EXPERIENCE',
    title: '특별한 미식 축제에 초대합니다', 
    subtitle: '최고급 식재료와 셰프의 장인정신이 깃든 시즌 메뉴를 지금 바로 만나보세요.',
    heroImage: ''
  });

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const homeDoc = await getDoc(doc(db, 'settings', 'home'));
        if (homeDoc.exists()) {
          const data = homeDoc.data();
          setSettings(prev => ({
            ...prev,
            brandName: data.brandName || prev.brandName,
            topLabel: data.topLabel || prev.topLabel,
            title: data.title || prev.title,
            subtitle: data.subtitle || prev.subtitle,
            heroImage: data.heroImage || ''
          }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchHome();
  }, []);

  const displayImage = settings.heroImage || heroImg;

  return (
    <header className="hero" style={{ 
      backgroundImage: `url(${displayImage})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center',
      backgroundAttachment: 'scroll',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 1rem'
    }}>
      <div className="hero-overlay"></div>
      <div className="hero-content container" style={{ width: '100%', maxWidth: '100vw', padding: '0 0.5rem' }}>
        
        {/* 상단 라벨: 모바일에서 너무 길어지지 않게 조정 */}
        <span className="fade-in" style={{ 
          color: 'var(--primary)', 
          fontWeight: '600', 
          letterSpacing: 'clamp(2px, 1.5vw, 6px)', 
          fontSize: 'clamp(0.7rem, 2vw, 0.9rem)', 
          marginBottom: '1rem', 
          display: 'block',
          textShadow: '0 0 10px rgba(197, 160, 89, 0.5)' 
        }}>
          {settings.topLabel}
        </span>

        {/* 1. 식당 이름: 좁은 화면에서도 넘치지 않도록 clamp 적용 */}
        <div className="fade-in" style={{ marginBottom: '1rem' }}>
          <h2 style={{ 
            fontSize: 'clamp(2.2rem, 12vw, 5.5rem)', 
            fontWeight: '900', 
            color: '#fff', 
            margin: 0, 
            lineHeight: 1.1, 
            letterSpacing: '-1px',
            textTransform: 'uppercase',
            background: 'linear-gradient(to bottom, #ffffff 40%, var(--primary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))',
            wordBreak: 'keep-all'
          }}>
            {settings.brandName}
          </h2>
        </div>

        {/* 2. 대제목 및 소제목: 모바일 가독성 최적화 */}
        <h1 className="hero-title fade-in" style={{ 
          fontSize: 'clamp(1.4rem, 6vw, 2.8rem)', 
          marginTop: '0.8rem',
          lineHeight: '1.3',
          wordBreak: 'keep-all'
        }}>
          {settings.title}
        </h1>
        <p className="hero-subtitle fade-in" style={{ 
          fontSize: 'clamp(0.85rem, 3vw, 1.1rem)', 
          maxWidth: '500px', 
          margin: '1rem auto 2.5rem',
          lineHeight: '1.6',
          opacity: 0.9,
          padding: '0 1rem'
        }}>
          {settings.subtitle}
        </p>
        
        <div className="fade-in">
          <Link to="/event" className="btn-primary" style={{ 
            textDecoration: 'none', 
            display: 'inline-block', 
            padding: 'clamp(0.9rem, 3vw, 1.4rem) clamp(2.5rem, 8vw, 5rem)', 
            fontSize: 'clamp(1rem, 3vw, 1.2rem)', 
            borderRadius: '50px',
            boxShadow: '0 0 50px rgba(255, 215, 0, 0.4)'
          }}>
            이벤트 참여하기 ✨
          </Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .fade-in { animation: fadeInUp 1.2s ease-out forwards; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 400px) {
          .hero-content { padding-top: 2rem; }
        }
      `}} />
    </header>
  );
};

export default Home;
