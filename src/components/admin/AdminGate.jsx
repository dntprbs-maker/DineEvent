import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth, tenantAdminEmail } from '../../context/AuthContext';

// 사장님 관리 센터 진입 게이트 — Firebase Auth 로그인 필수
// 패스코드 UX는 유지하되, 내부적으로는 가맹점 ID 기반 이메일 계정으로 인증합니다.
const AdminGate = ({ children }) => {
  const { tenantId } = useTenant();
  const { user, loading, login, logout, isTenantAdmin } = useAuth();
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div style={{
        background: '#050505', color: '#666', minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        인증 상태 확인 중...
      </div>
    );
  }

  if (isTenantAdmin(tenantId)) {
    return children;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!passcode || passcode.length < 6) {
      setAuthError('비밀코드는 6자리 이상입니다.');
      return;
    }
    setSubmitting(true);
    setAuthError('');
    try {
      // 다른 계정으로 로그인돼 있으면 먼저 로그아웃 후 재시도
      if (user) await logout();
      await login(tenantAdminEmail(tenantId), passcode);
      // 성공 시 onAuthStateChanged가 adminInfo를 갱신하며 자동으로 통과됨
    } catch (err) {
      console.error('관리자 로그인 실패:', err);
      setAuthError('❌ 비밀코드가 올바르지 않습니다. 다시 입력해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      background: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #050505 100%)',
      color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Outfit', 'Inter', sans-serif", padding: '1rem'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(197, 160, 89, 0.3)',
        borderRadius: '24px', padding: '3rem 2.5rem', width: '100%', maxWidth: '400px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
        <h2 style={{
          fontSize: '1.6rem', fontWeight: '900', letterSpacing: '-0.5px', marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, #fff 40%, #C5A059 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          사장님 관리 센터
        </h2>
        <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '2.5rem', wordBreak: 'keep-all' }}>
          매장(ID: {tenantId}) 관리자 전용 공간입니다. 발급받은 비밀코드를 입력해 주세요.
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="password"
            placeholder="관리자 비밀코드 (6자리 이상)"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            style={{
              width: '100%', padding: '1rem', background: '#000', border: '1px solid #333',
              borderRadius: '12px', color: '#fff', fontSize: '1rem', outline: 'none', textAlign: 'center',
              letterSpacing: '3px'
            }}
            autoFocus
          />

          {authError && (
            <p style={{ color: '#ff4d4d', fontSize: '0.8rem', margin: 0, fontWeight: 'bold' }}>
              {authError}
            </p>
          )}

          <button type="submit" disabled={submitting} style={{
            padding: '1rem', borderRadius: '12px',
            background: 'linear-gradient(135deg, #fceabb 0%, #fccd4d 50%, #f8b500 100%)',
            color: '#000', border: 'none', fontWeight: '900', fontSize: '1rem',
            cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.6 : 1,
            boxShadow: '0 5px 20px rgba(248, 181, 0, 0.2)'
          }}>
            {submitting ? '확인 중...' : '관리 센터 입장'}
          </button>
        </form>

        <a href={`/${tenantId}`} style={{
          display: 'inline-block', color: '#666', marginTop: '1.5rem',
          fontSize: '0.85rem', textDecoration: 'underline'
        }}>
          매장 홈페이지로 돌아가기
        </a>
      </div>
    </div>
  );
};

export default AdminGate;
