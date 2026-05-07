import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import heroImg from '../assets/hero.png';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Home = () => {
  const [settings, setSettings] = useState({ 
    topLabel: 'PREMIUM DINING EXPERIENCE',
    title: '다인이벤트의 특별한\\n미식 축제에 초대합니다', 
    subtitle: '최고급 식재료와 셰프의 장인정신이 깃든 시즌 메뉴를 지금 바로 만나보세요.',
    heroImage: ''
  });

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const homeDoc = await getDoc(doc(db, 'settings', 'home'));
        if (homeDoc.exists()) setSettings(prev => ({...prev, ...homeDoc.data()}));
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
      backgroundAttachment: 'scroll'
    }}>
      <div className="hero-overlay"></div>
      <div className="hero-content container">
        <span className="fade-in" style={{ color: 'var(--primary)', fontWeight: '600', letterSpacing: '4px', fontSize: '0.9rem', marginBottom: '1rem', display: 'block' }}>
          {settings.topLabel}
        </span>
        <h1 className="hero-title fade-in">{settings.title}</h1>
        <p className="hero-subtitle fade-in">{settings.subtitle}</p>
        <div className="fade-in">
          <Link to="/event" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>이벤트 참여하기</Link>
        </div>
      </div>
    </header>
  );
};

export default Home;
