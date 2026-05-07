import React, { useState } from 'react';

const MobileAdminInfo = ({ 
  homeSettings, setHomeSettings, 
  locationSettings, setLocationSettings, 
  menuImages, handleImageUpload, 
  handleSave, saving 
}) => {
  const [activeModal, setActiveModal] = useState(null); 

  const leftItems = [
    { id: 'brandName', label: '매장 이름', icon: '🏠' },
    { id: 'address', label: '매장 주소', icon: '📍' },
    { id: 'heroImage', label: '메인 배경', icon: '🖼️' },
    { id: 'menu1', label: '메뉴 1', icon: '🍴' },
    { id: 'menu2', label: '메뉴 2', icon: '🍴' },
  ];

  const rightItems = [
    { id: 'topLabel', label: '강조 문구', icon: '✨' },
    { id: 'title', label: '대제목', icon: '📢' },
    { id: 'subtitle', label: '소제목', icon: '📝' },
  ];

  const closeModal = () => setActiveModal(null);

  const renderButton = (item) => (
    <div 
      key={item.id} 
      className="mockup-style-button" 
      onClick={() => setActiveModal(item.id)}
    >
      <span className="mockup-icon">{item.icon}</span>
      <span className="mockup-label">{item.label}</span>
    </div>
  );

  return (
    <div className="mobile-admin-container" style={{ padding: '0 0.8rem 150px 0.8rem', animation: 'fadeIn 0.5s ease-out' }}>
      
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {leftItems.map(renderButton)}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {rightItems.map(renderButton)}
        </div>
      </div>

      {activeModal && (
        <>
          <div className="modal-overlay" onClick={closeModal} />
          <div className="bottom-sheet">
            <div className="sheet-handle" />
            <div className="sheet-content">
              <div className="modal-inner">
                <h4 className="modal-title">
                  {[...leftItems, ...rightItems].find(i => i.id === activeModal)?.label} 수정
                </h4>

                <div className="input-group">
                  {activeModal === 'brandName' && (
                    <input type="text" value={homeSettings.brandName} onChange={(e) => setHomeSettings({...homeSettings, brandName: e.target.value})} autoFocus />
                  )}
                  {activeModal === 'address' && (
                    <input type="text" value={locationSettings.address} onChange={(e) => setLocationSettings({...locationSettings, address: e.target.value})} autoFocus />
                  )}
                  {activeModal === 'heroImage' && (
                    <div className="image-upload-zone">
                      <input type="file" accept="image/*" onChange={(e) => { handleImageUpload(e, 'hero'); closeModal(); }} />
                      {homeSettings.heroImage && <img src={homeSettings.heroImage} alt="" className="preview-img" />}
                    </div>
                  )}
                  {activeModal === 'menu1' && (
                    <div className="image-upload-zone">
                      <input type="file" accept="image/*" onChange={(e) => { handleImageUpload(e, 'menu1'); closeModal(); }} />
                      {menuImages.image1 && <img src={menuImages.image1} alt="" className="preview-img" />}
                    </div>
                  )}
                  {activeModal === 'menu2' && (
                    <div className="image-upload-zone">
                      <input type="file" accept="image/*" onChange={(e) => { handleImageUpload(e, 'menu2'); closeModal(); }} />
                      {menuImages.image2 && <img src={menuImages.image2} alt="" className="preview-img" />}
                    </div>
                  )}
                  {activeModal === 'topLabel' && (
                    <input type="text" value={homeSettings.topLabel} onChange={(e) => setHomeSettings({...homeSettings, topLabel: e.target.value})} autoFocus />
                  )}
                  {activeModal === 'title' && (
                    <input type="text" value={homeSettings.title} onChange={(e) => setHomeSettings({...homeSettings, title: e.target.value})} autoFocus />
                  )}
                  {activeModal === 'subtitle' && (
                    <textarea value={homeSettings.subtitle} onChange={(e) => setHomeSettings({...homeSettings, subtitle: e.target.value})} style={{ minHeight: '120px' }} autoFocus />
                  )}
                </div>

                <button className="premium-gold-confirm-btn" onClick={closeModal}>수정 완료</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 우측 하단 고광택 황금빛 저장 버튼 */}
      <div className="floating-save-container">
        <button className="premium-gold-btn-final" onClick={handleSave} disabled={saving}>
          <span className="btn-text-main">{saving ? '저장중' : '변경내용저장'}</span>
          <span className="btn-icon-gold">💾</span>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .mockup-style-button {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(197, 160, 89, 0.4);
          border-radius: 12px;
          padding: 1rem 0.5rem;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          min-height: 55px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        .mockup-style-button:active { background: rgba(197, 160, 89, 0.1); transform: scale(0.96); }
        .mockup-icon { font-size: 1.1rem; }
        .mockup-label { color: #fff; font-size: 0.85rem; font-weight: 700; letter-spacing: -0.5px; }

        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); z-index: 2000; animation: fadeIn 0.3s ease; }
        .bottom-sheet { position: fixed; bottom: 0; left: 0; width: 100%; background: #0f0f0f; border-radius: 25px 25px 0 0; z-index: 2001; padding: 1rem 1rem 3rem 1rem; box-shadow: 0 -10px 50px rgba(0,0,0,1); animation: slideUp 0.4s cubic-bezier(0.23, 1, 0.32, 1); border-top: 1px solid rgba(197, 160, 89, 0.3); }
        .sheet-handle { width: 40px; height: 4px; background: #333; border-radius: 10px; margin: 0 auto 1.5rem auto; }
        .modal-title { color: var(--primary); margin-bottom: 1.5rem; font-size: 1.1rem; text-align: center; font-weight: 900; }
        .input-group input, .input-group textarea { width: 100%; background: #000; border: 1px solid #222; border-radius: 12px; padding: 1.1rem; color: #fff; font-size: 1rem; outline: none; }
        .image-upload-zone { display: flex; flex-direction: column; gap: 10px; align-items: center; }
        .preview-img { width: 120px; height: 120px; object-fit: cover; border-radius: 15px; border: 2px solid var(--primary); box-shadow: 0 0 20px rgba(197,160,89,0.3); }

        /* 고광택 골드 버튼 공통 스타일 */
        .premium-gold-btn-final, .premium-gold-confirm-btn {
          background: linear-gradient(135deg, #fceabb 0%, #fccd4d 40%, #f8b500 50%, #fccd4d 60%, #fbdf93 100%);
          color: #000;
          border: 1px solid #ffeb3b;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-weight: 900;
          box-shadow: 0 0 25px rgba(255, 215, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4);
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .premium-gold-confirm-btn { width: 100%; padding: 1.1rem; font-size: 1rem; margin-top: 1.5rem; }
        
        .floating-save-container { position: fixed; bottom: 35px; right: 20px; z-index: 1000; animation: fadeInUp 0.6s cubic-bezier(0.23, 1, 0.32, 1); }
        .premium-gold-btn-final { padding: 0.9rem 1.4rem; font-size: 0.9rem; }
        .btn-text-main { letter-spacing: -0.5px; }
        .btn-icon-gold { font-size: 1rem; }

        .premium-gold-btn-final:active, .premium-gold-confirm-btn:active { transform: scale(0.94); filter: brightness(1.1); }
        .premium-gold-btn-final:disabled { opacity: 0.6; filter: grayscale(0.5); }

        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
};

export default MobileAdminInfo;
