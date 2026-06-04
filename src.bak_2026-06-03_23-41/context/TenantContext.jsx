import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection } from 'firebase/firestore';

// 테넌트 컨텍스트 생성
const TenantContext = createContext(null);

export const TenantProvider = ({ children }) => {
  const { tenantId } = useParams();
  const [loading, setLoading] = useState(true);
  const [tenantMeta, setTenantMeta] = useState({
    status: 'active',
    adminPasscode: '1234'
  });
  const [tenantConfig, setTenantConfig] = useState({
    brandName: 'DineEvent',
    brandNameKr: '다인이벤트',
    themeColor: '#C5A059', // 기본 시그니처 골드 테마
  });

  const activeTenant = tenantId || 'dine-event';

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        // 1. 마스터 테넌트 메타정보 조회
        const masterRef = doc(db, 'tenants', activeTenant);
        const masterSnap = await getDoc(masterRef);
        if (masterSnap.exists()) {
          const mData = masterSnap.data();
          setTenantMeta({
            status: mData.status || 'active',
            adminPasscode: mData.adminPasscode || '1234'
          });
        } else {
          setTenantMeta({
            status: 'active',
            adminPasscode: '1234'
          });
        }

        // 2. 홈 설정 정보 조회 (가맹점별 settings/home)
        const tenantHomeRef = doc(db, 'tenants', activeTenant, 'settings', 'home');
        const tenantHomeDoc = await getDoc(tenantHomeRef);
        
        if (tenantHomeDoc.exists()) {
          setTenantConfig(tenantHomeDoc.data());
        } else {
          // 폴백: 단일 테넌트 시절 글로벌 settings/home 조회
          const defaultHomeRef = doc(db, 'settings', 'home');
          const defaultHomeDoc = await getDoc(defaultHomeRef);
          if (defaultHomeDoc.exists()) {
            setTenantConfig(defaultHomeDoc.data());
          }
        }
      } catch (err) {
        console.error('Error fetching tenant config:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, [tenantId]);

  // 스마트 헬퍼 1: 테넌트 격리형 단일 문서(Doc) 참조 반환
  const getDocRef = (collectionName, docName) => {
    return doc(db, 'tenants', activeTenant, collectionName, docName);
  };

  // 스마트 헬퍼 2: 테넌트 격리형 컬렉션(Collection) 참조 반환
  const getColRef = (collectionName) => {
    return collection(db, 'tenants', activeTenant, collectionName);
  };

  // 스마트 헬퍼 3: 조회용 폴백 (문서 읽기)
  const fetchDocWithFallback = async (collectionName, docName) => {
    const tenantRef = doc(db, 'tenants', activeTenant, collectionName, docName);
    const tenantSnap = await getDoc(tenantRef);
    if (tenantSnap.exists()) {
      return tenantSnap;
    }
    // 폴백: 기존 단일 매장 글로벌 경로 조회
    const fallbackRef = doc(db, collectionName, docName);
    return await getDoc(fallbackRef);
  };

  return (
    <TenantContext.Provider value={{ 
      tenantId: activeTenant, 
      tenantConfig, 
      tenantMeta,
      loading,
      getDocRef,
      getColRef,
      fetchDocWithFallback
    }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);
