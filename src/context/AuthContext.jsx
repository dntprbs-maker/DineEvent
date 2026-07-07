import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// 테넌트 관리자 계정은 가맹점 ID 기반 가상 이메일로 식별합니다.
// 예: dine-event → dine-event@admin.dineevent.app (실제 수신 가능한 메일 아님)
export const ADMIN_EMAIL_DOMAIN = 'admin.dineevent.app';
export const tenantAdminEmail = (tenantId) => `${tenantId}@${ADMIN_EMAIL_DOMAIN}`;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [adminInfo, setAdminInfo] = useState(null); // Firestore admins/{uid} 문서 데이터
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const snap = await getDoc(doc(db, 'admins', currentUser.uid));
          setAdminInfo(snap.exists() ? snap.data() : null);
        } catch (err) {
          console.error('admins 문서 조회 실패:', err);
          setAdminInfo(null);
        }
      } else {
        setAdminInfo(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  const isSuperAdmin = adminInfo?.role === 'super';
  const isTenantAdmin = (tenantId) =>
    isSuperAdmin || (adminInfo?.role === 'tenant' && adminInfo?.tenantId === tenantId);

  return (
    <AuthContext.Provider value={{ user, adminInfo, loading, login, logout, isSuperAdmin, isTenantAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
