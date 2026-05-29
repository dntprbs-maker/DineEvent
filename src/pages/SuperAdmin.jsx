import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { 
  collection, getDocs, setDoc, doc, deleteDoc, updateDoc, addDoc,
  query, orderBy, serverTimestamp 
} from 'firebase/firestore';
import TenantTable from '../components/admin/TenantTable';

const SuperAdmin = () => {
  const navigate = useNavigate();

  // 1. 보안용 비밀번호 상태 관리 (마스터 계정 비밀코드)
  const [isAuthenticated, setIsAuthenticated] = useState(true); // 개발 및 UI 편집을 위해 로그인 임시 패스
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // 2. 대시보드 상태 관리
  const [tenants, setTenants] = useState([]);
  const [loadingTenants, setLoadingTenants] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [entries, setEntries] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState(false);
  // 응모내역 팝업 검색어
  const [entrySearch, setEntrySearch] = useState('');

  // 3. 신규 가맹점 생성 폼 상태 관리
  const [newStore, setNewStore] = useState({
    id: '',
    brandName: '',
    address: '',
    adminPasscode: '1234' // 디폴트 비밀코드
  });
  const [provisioning, setProvisioning] = useState(false);
  const [provisionSuccess, setProvisionSuccess] = useState('');
  const [activeView, setActiveView] = useState('none'); // 'none', 'provision', 'storeList'
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // 보안 로그인 수행
  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === '9999') {
      setIsAuthenticated(true);
      setAuthError('');
      fetchTenants();
    } else {
      setAuthError('❌ 비밀코드가 올바르지 않습니다. 다시 입력해 주세요.');
    }
  };

  // 모든 테넌트(가맹점) 목록 가져오기
  const fetchTenants = async () => {
    setLoadingTenants(true);
    try {
      const q = query(collection(db, 'tenants'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTenants(list);

      if (list.length > 0 && !selectedTenantId) {
        setSelectedTenantId(list[0].id);
      }
    } catch (err) {
      console.error("Error fetching tenants:", err);
    } finally {
      setLoadingTenants(false);
    }
  };

  // 로그인 우회 시 가맹점 목록 자동 불러오기
  useEffect(() => {
    if (isAuthenticated) {
      fetchTenants();
    }
  }, []);

  // 팝업 모달이 열려있는 동안 배경 페이지 스크롤 차단
  useEffect(() => {
    if (isLogModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // 컴포넌트가 언마운트될 때도 반드시 복원
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLogModalOpen]);

  // 디폴트 테넌트 시딩 함수 (레거시 데모 복구용)
  const handleSeedLegacy = async () => {
    try {
      setLoadingTenants(true);
      await setDoc(doc(db, 'tenants', 'dine-event'), {
        brandName: '다인이벤트 데모점',
        address: '서울 강남구 테헤란로 427',
        adminPasscode: '1234',
        status: 'active',
        createdAt: serverTimestamp()
      });
      await fetchTenants();
      alert('기본 데모 가맹점(dine-event)이 성공적으로 생성되었습니다.');
    } catch (err) {
      console.error(err);
      alert('시딩 중 오류가 발생했습니다.');
    }
  };

  // 선택된 가맹점의 이벤트 응모(참가) 로그 가져오기
  useEffect(() => {
    if (!selectedTenantId || !isAuthenticated) return;
    const fetchEntries = async () => {
      setLoadingEntries(true);
      try {
        const q = query(collection(db, 'tenants', selectedTenantId, 'entries'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setEntries(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingEntries(false);
      }
    };
    fetchEntries();
  }, [selectedTenantId, isAuthenticated]);

  // 가맹점 신규 발급 & 프로비저닝 (DineEvent 특화 시딩 데이터 포함)
  const handleProvisionStore = async (e) => {
    e.preventDefault();
    if (!newStore.id || !newStore.brandName || !newStore.address || !newStore.adminPasscode) {
      alert('모든 가맹점 정보를 입력해 주세요.');
      return;
    }
    
    // 아이디 영문+대시 규격 필터링
    const idRegex = /^[a-z0-9-]+$/;
    if (!idRegex.test(newStore.id)) {
      alert('가맹점 영문 코드는 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.');
      return;
    }

    setProvisioning(true);
    setProvisionSuccess('');
    try {
      const tenantRef = doc(db, 'tenants', newStore.id);
      
      // 1. 마스터 테넌트 컬렉션 등록
      await setDoc(tenantRef, {
        brandName: newStore.brandName,
        address: newStore.address,
        adminPasscode: newStore.adminPasscode.trim(),
        status: 'active',
        createdAt: serverTimestamp()
      });

      // 2. 가맹점 기본 홈 설정 데이터 프로비저닝 (DineEvent 스타일)
      await setDoc(doc(db, `tenants/${newStore.id}/settings`, 'home'), {
        brandName: newStore.brandName,
        topLabel: 'PREMIUM DINING & SPECIAL EVENT',
        title: '특별한 미식 축제에 여러분을 초대합니다',
        subtitle: '엄선된 식재료와 셰프의 예술적 감각이 어우러진 최고의 시그니처 요리를 만나보세요.',
        heroImage: ''
      });

      // 3. 가맹점 기본 매장 정보 세팅
      await setDoc(doc(db, `tenants/${newStore.id}/settings`, 'location'), {
        address: newStore.address,
        phone: '02-1234-5678',
        hours: '11:00 ~ 22:00 (연중무휴)'
      });

      // 4. 가맹점 초기 웰컴 공지사항 자동 시딩 (공지 팝업 가동 보장)
      const noticeId = `welcome_${Date.now()}`;
      const defaultNoticeContent = `🎉 저희 [ ${newStore.brandName} ] 에 방문해 주신 고객분들께 진심으로 감사드립니다! \n\n다양하고 혜택이 가득한 매장 한정 이벤트 소식을 이곳에서 전해드릴 예정이오니, 많은 성원과 참여 부탁드립니다. ✨`;
      
      await setDoc(doc(db, `tenants/${newStore.id}/notices`, noticeId), {
        content: defaultNoticeContent,
        isPinned: true,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '2030-12-31',
        createdAt: new Date().toISOString()
      });

      // 4-1. 초기 웰컴 공지사항을 '공지 템플릿'에도 기본으로 등록
      const templateId = `template_${Date.now()}`;
      await setDoc(doc(db, `tenants/${newStore.id}/noticeTemplates`, templateId), {
        content: defaultNoticeContent,
        createdAt: serverTimestamp()
      });

      // 5. 가맹점 초기 맛있는 대표 메뉴 3개 시딩
      const menu1Id = `menu_${Date.now()}_1`;
      await setDoc(doc(db, `tenants/${newStore.id}/menus`, menu1Id), {
        name: '🥇 셰프 추천 안심 스테이크',
        price: '48,000원',
        category: 'Main',
        description: '최상급 부위만을 엄선하여 고유의 육즙과 부드러운 풍미를 극대화한 스테이크',
        image: '',
        createdAt: new Date().toISOString()
      });

      const menu2Id = `menu_${Date.now()}_2`;
      await setDoc(doc(db, `tenants/${newStore.id}/menus`, menu2Id), {
        name: '🍝 정통 리얼 까르보나라 파스타',
        price: '19,000원',
        category: 'Pasta',
        description: '고소한 이탈리안 베이컨 판체타와 진한 계란 노른자로 맛을 낸 정통 파스타',
        image: '',
        createdAt: new Date().toISOString()
      });

      const menu3Id = `menu_${Date.now()}_3`;
      await setDoc(doc(db, `tenants/${newStore.id}/menus`, menu3Id), {
        name: '🍷 프리미엄 셀렉션 하우스 와인',
        price: '9,000원',
        category: 'Beverage',
        description: '매장의 미식 요리와 가장 아름답게 페어링되는 소믈리에 추천 하우스 와인',
        image: '',
        createdAt: new Date().toISOString()
      });

      setProvisionSuccess(`🎉 매장 [${newStore.brandName}] 이 성공적으로 프로비저닝되었습니다!`);
      setNewStore({ id: '', brandName: '', address: '', adminPasscode: '1234' });
      await fetchTenants();
    } catch (err) {
      console.error(err);
      alert('가맹점 프로비저닝 중 에러가 발생했습니다: ' + err.message);
    } finally {
      setProvisioning(false);
    }
  };

  // 특정 가맹점의 특정 응모 내역 삭제
  const handleDeleteEntry = async (entryId) => {
    if (!window.confirm('이 당첨 로그를 정말로 삭제하시겠습니까?')) return;
    try {
      await deleteDoc(doc(db, 'tenants', selectedTenantId, 'entries', entryId));
      setEntries(entries.filter(e => e.id !== entryId));
      alert('삭제 완료되었습니다.');
    } catch (err) {
      console.error(err);
      alert('삭제 중 실패했습니다.');
    }
  };

  // 500galbi 매장에 더미 응모 데이터 50개 삽입 (개발/테스트용)
  const handleSeedEntries = async () => {
    const tenantId = '500galbi';
    // 응모 가능한 상품 목록 (실제 룰렛 상품에 맞게 조정)
    const prizes = [
      '1등 샴페인 교환권', '2등 시그니처 머그', '3등 수제 케이크',
      '4등 아메리카노 1잔', '5등 프리미엄 초콜릿', '다음 기회에(꽝)'
    ];
    // 010-5555-xxxx 형태의 임의 전화번호 생성
    const randomPhone = () => `010-5555-${String(Math.floor(1000 + Math.random() * 9000))}`;
    // 최근 30일 내 임의 타임스탬프
    const randomTs = () => {
      const now = Date.now();
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      return { seconds: Math.floor((now - Math.random() * thirtyDays) / 1000), nanoseconds: 0 };
    };
    try {
      const colRef = collection(db, 'tenants', tenantId, 'entries');
      for (let i = 0; i < 50; i++) {
        const prize = prizes[Math.floor(Math.random() * prizes.length)];
        await addDoc(colRef, {
          phone: randomPhone(),
          prize,
          prizeName: prize,
          createdAt: randomTs(),
        });
      }
      alert('500소갈비 매장에 더미 응모 데이터 50개가 추가되었습니다!');
    } catch (err) {
      console.error(err);
      alert('시드 데이터 삽입 실패: ' + err.message);
    }
  };

  // [NEW] 매장 정지 및 운영 재개 토글 함수
  const handleToggleStoreStatus = async (targetTenant) => {
    const nextStatus = targetTenant.status === 'active' ? 'suspended' : 'active';
    const confirmMsg = nextStatus === 'suspended' 
      ? `[${targetTenant.brandName}] 매장의 DineEvent 서비스를 즉각 '정지'하시겠습니까?\n고객과 관리자 페이지의 접속이 일체 차단됩니다.`
      : `[${targetTenant.brandName}] 매장의 DineEvent 서비스를 정상 '운영 재개'하시겠습니까?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      await updateDoc(doc(db, 'tenants', targetTenant.id), {
        status: nextStatus
      });
      alert('상태가 정상 변경되었습니다.');
      await fetchTenants();
    } catch (err) {
      console.error("Error toggling status:", err);
      alert('가맹점 상태 제어 도중 에러가 발생했습니다.');
    }
  };

  // [NEW] 매장 데이터 완파/초기화 함수 (DineEvent 에 맞춘 초기화)
  const handleResetStoreData = async (targetTenant) => {
    const doubleCheck = window.prompt(
      `⚠️ 경고! [${targetTenant.brandName}] 매장의 모든 당첨 로그를 일괄 삭제하고 기본 설정으로 포맷합니다.\n진행하시려면 가맹점 ID인 [ ${targetTenant.id} ] 을 입력창에 입력해 주세요.`
    );

    if (doubleCheck !== targetTenant.id) {
      alert('가맹점 ID가 다릅니다. 초기화를 취소합니다.');
      return;
    }

    try {
      setLoadingEntries(true);
      // 1. entries 하위 로그 전체 쿼리 및 일괄 삭제
      const entriesRef = collection(db, 'tenants', targetTenant.id, 'entries');
      const snap = await getDocs(entriesRef);
      for (const d of snap.docs) {
        await deleteDoc(doc(db, 'tenants', targetTenant.id, 'entries', d.id));
      }

      // 2. 홈 설정 초기 템플릿 복구 (DineEvent 스타일)
      await setDoc(doc(db, `tenants/${targetTenant.id}/settings`, 'home'), {
        brandName: targetTenant.brandName,
        topLabel: 'PREMIUM DINING & SPECIAL EVENT',
        title: '특별한 미식 축제에 여러분을 초대합니다',
        subtitle: '엄선된 식재료와 셰프의 예술적 감각이 어우러진 최고의 시그니처 요리를 만나보세요.',
        heroImage: ''
      });

      setEntries([]);
      alert(`🎉 [${targetTenant.brandName}] 가맹점의 이벤트 기록이 완벽하게 초기화되었습니다!`);
    } catch (err) {
      console.error("Reset store error:", err);
      alert('초기화 작업 중 문제가 발생했습니다: ' + err.message);
    } finally {
      setLoadingEntries(false);
    }
  };

  // [NEW] 가맹점 영구 삭제 함수 (설정, 메뉴, 공지, 당첨 로그 일괄 삭제 및 라이선스 회수)
  const handleDeleteStore = async (targetTenant) => {
    // 1. 파괴적 작업 방지를 위한 2차 텍스트 검증 장치 제공
    const doubleCheck = window.prompt(
      `🚨 초비상 경고! [${targetTenant.brandName}] 매장의 모든 설정, 메뉴, 공지사항, 당첨 로그를 포함한 가맹점 인프라 전체를 영구 삭제합니다.\n이 작업은 절대 되돌릴 수 없습니다.\n진행하시려면 가맹점 ID인 [ ${targetTenant.id} ] 을 입력창에 정확히 입력해 주세요.`
    );

    if (doubleCheck !== targetTenant.id) {
      alert('가맹점 ID가 올바르지 않습니다. 가맹점 삭제를 취소합니다.');
      return;
    }

    try {
      setLoadingTenants(true);

      // 2. 서브컬렉션 데이터 순차적 일괄 제거 (고아 다큐먼트 발생 방지)
      
      // 2-1. entries (이벤트 응모 로그) 삭제
      const entriesRef = collection(db, 'tenants', targetTenant.id, 'entries');
      const entriesSnap = await getDocs(entriesRef);
      for (const d of entriesSnap.docs) {
        await deleteDoc(doc(db, 'tenants', targetTenant.id, 'entries', d.id));
      }

      // 2-2. menus (가맹점 대표 메뉴) 삭제
      const menusRef = collection(db, 'tenants', targetTenant.id, 'menus');
      const menusSnap = await getDocs(menusRef);
      for (const d of menusSnap.docs) {
        await deleteDoc(doc(db, 'tenants', targetTenant.id, 'menus', d.id));
      }

      // 2-3. notices (가맹점 공지사항) 삭제
      const noticesRef = collection(db, 'tenants', targetTenant.id, 'notices');
      const noticesSnap = await getDocs(noticesRef);
      for (const d of noticesSnap.docs) {
        await deleteDoc(doc(db, 'tenants', targetTenant.id, 'notices', d.id));
      }

      // 2-4. settings (가맹점 환경설정) 삭제
      const settingsRef = collection(db, 'tenants', targetTenant.id, 'settings');
      const settingsSnap = await getDocs(settingsRef);
      for (const d of settingsSnap.docs) {
        await deleteDoc(doc(db, 'tenants', targetTenant.id, 'settings', d.id));
      }

      // 3. 최상위 tenants 다큐먼트 영구 삭제
      await deleteDoc(doc(db, 'tenants', targetTenant.id));

      alert(`🎉 [${targetTenant.brandName}] 가맹점의 모든 데이터와 라이선스가 안전하게 영구 삭제되었습니다.`);
      
      // 4. 삭제한 가맹점이 현재 선택되어 있었다면 선택 초기화
      if (selectedTenantId === targetTenant.id) {
        setSelectedTenantId('');
      }
      
      // 5. 갱신된 가맹점 리스트 새로고침
      await fetchTenants();
    } catch (err) {
      console.error("Delete store error:", err);
      alert('가맹점 삭제 작업 중 문제가 발생했습니다: ' + err.message);
    } finally {
      setLoadingTenants(false);
    }
  };


  // ── 로그인 이전 뷰 (슈퍼관리자 패스코드 확인) ──
  if (!isAuthenticated) {
    return (
      <div style={{
        background: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #050505 100%)',
        color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Outfit', 'Inter', sans-serif"
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(197, 160, 89, 0.3)',
          borderRadius: '24px', padding: '3rem 2.5rem', width: '100%', maxWidth: '400px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍽️</div>
          <h2 style={{
            fontSize: '1.8rem', fontWeight: '900', letterSpacing: '-0.5px', marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #fff 40%, #C5A059 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            다인이벤트 마스터
          </h2>
          <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '2.5rem' }}>
            DineEvent 전체 가맹점 및 고객 내역을 제어하는 마스터 권한 영역입니다.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ textAlign: 'left' }}>
              <label style={{ color: '#C5A059', fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
                슈퍼관리자 비밀코드
              </label>
              <input 
                type="password" 
                placeholder="마스터 비밀코드를 입력하세요" 
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                style={{
                  width: '100%', padding: '1rem', background: '#000', border: '1px solid #333',
                  borderRadius: '12px', color: '#fff', fontSize: '1rem', outline: 'none', textAlign: 'center',
                  letterSpacing: '5px'
                }}
                autoFocus
              />
            </div>
            
            {authError && (
              <p style={{ color: '#ff4d4d', fontSize: '0.8rem', margin: 0, fontWeight: 'bold' }}>
                {authError}
              </p>
            )}

            <button type="submit" style={{
              padding: '1rem', borderRadius: '12px', background: 'linear-gradient(135deg, #fceabb 0%, #fccd4d 50%, #f8b500 100%)',
              color: '#000', border: 'none', fontWeight: '900', fontSize: '1rem', cursor: 'pointer',
              boxShadow: '0 5px 20px rgba(248, 181, 0, 0.2)'
            }}>
              로그인 및 연결
            </button>
          </form>

          <button 
            onClick={() => navigate('/dine-event')}
            style={{
              background: 'transparent', border: 'none', color: '#666', marginTop: '1.5rem',
              cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline'
            }}
          >
            데모 매장으로 이동하기
          </button>
        </div>
      </div>
    );
  }

  // ── 로그인 이후 메인 관리자 뷰 ──
  return (
    <div style={{
      background: '#0a0a0a', color: '#fff', minHeight: '100vh',
      fontFamily: "'Outfit', 'Inter', sans-serif"
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem 1.5rem'
      }}>
      
      {/* 상단 통합 제어바 */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingBottom: '1.5rem', borderBottom: '1px solid #222', marginBottom: '2.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '2rem' }}>🍽️</span>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '900', margin: 0, color: '#C5A059' }}>
              MASTER ADMIN CONTROL PANEL
            </h1>
            <span style={{ fontSize: '0.75rem', color: '#666' }}>다인이벤트 시스템 마스터 콘솔</span>
          </div>
        </div>
        <button 
          onClick={() => setIsAuthenticated(false)}
          style={{
            background: 'rgba(255,77,77,0.1)', border: '1px solid #ff4d4d', color: '#ff4d4d',
            padding: '0.5rem 1.2rem', borderRadius: '50px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold'
          }}
        >
          안전 로그아웃
        </button>
      </div>

      {/* 시스템 종합 상태보드 */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px', marginBottom: '3rem'
      }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #222', padding: '1.5rem', borderRadius: '16px' }}>
          <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>입점 가맹점 수</span>
          <span style={{ fontSize: '2rem', fontWeight: '900', color: '#C5A059' }}>{tenants.length}개 점</span>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #222', padding: '1.5rem', borderRadius: '16px' }}>
          <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>선택된 매장 응모 로그 수</span>
          <span style={{ fontSize: '2rem', fontWeight: '900', color: '#fff' }}>{entries.length}건</span>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #222', padding: '1.5rem', borderRadius: '16px' }}>
          <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>인프라 가동 상태</span>
          <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#4caf50', display: 'flex', alignItems: 'center', gap: '5px' }}>
            🟢 ACTIVE (정상)
          </span>
        </div>
      </div>

      {/* 뷰 토글 버튼 영역 */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '2rem', justifyContent: 'center' }}>
        <button 
          onClick={() => setActiveView(activeView === 'provision' ? 'none' : 'provision')}
          style={{ 
            padding: '1rem 2rem', 
            background: activeView === 'provision' ? '#C5A059' : '#222', 
            color: activeView === 'provision' ? '#000' : '#fff', 
            borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem',
            transition: 'all 0.3s'
          }}
        >
          🚀 가맹점 원클릭 발급
        </button>
        <button 
          onClick={() => setActiveView(activeView === 'storeList' ? 'none' : 'storeList')}
          style={{ 
            padding: '1rem 2rem', 
            background: activeView === 'storeList' ? '#C5A059' : '#222', 
            color: activeView === 'storeList' ? '#000' : '#fff', 
            borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem',
            transition: 'all 0.3s'
          }}
        >
          📋 입점 매장 리스트 및 현황
        </button>
      </div>

      {/* 가맹점 원클릭 발급 뷰 */}
      {activeView === 'provision' && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          {/* 가맹점 신규 프로비저닝 */}
          <div style={{
            background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(197, 160, 89, 0.2)',
            borderRadius: '20px', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <h3 style={{ color: '#C5A059', fontWeight: '900', marginTop: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🚀</span> DineEvent 가맹점 원클릭 발급
            </h3>
            
            <form onSubmit={handleProvisionStore} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px' }}>가맹점 영문 ID 코드 (소문자, 숫자, 하이픈만)</label>
                <input 
                  type="text" 
                  placeholder="예: goodcafe, best-din" 
                  value={newStore.id}
                  onChange={(e) => setNewStore({...newStore, id: e.target.value.toLowerCase()})}
                  style={{ width: '100%', padding: '0.8rem', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 2 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px' }}>가맹점명 (식당/브랜드명)</label>
                  <input 
                    type="text" 
                    placeholder="예: 굿카페 신림점" 
                    value={newStore.brandName}
                    onChange={(e) => setNewStore({...newStore, brandName: e.target.value})}
                    style={{ width: '100%', padding: '0.8rem', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px' }}>사장님 비밀코드</label>
                  <input 
                    type="text" 
                    placeholder="1234" 
                    value={newStore.adminPasscode}
                    onChange={(e) => setNewStore({...newStore, adminPasscode: e.target.value})}
                    style={{ width: '100%', padding: '0.8rem', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', textAlign: 'center' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px' }}>가맹점 위치 (주소)</label>
                <input 
                  type="text" 
                  placeholder="예: 서울 관악구 신림로 340" 
                  value={newStore.address}
                  onChange={(e) => setNewStore({...newStore, address: e.target.value})}
                  style={{ width: '100%', padding: '0.8rem', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                />
              </div>

              {provisionSuccess && (
                <p style={{ color: '#4caf50', fontSize: '0.85rem', fontWeight: 'bold', margin: 0 }}>
                  {provisionSuccess}
                </p>
              )}

              <button 
                type="submit" 
                disabled={provisioning}
                style={{
                  width: '100%', padding: '0.9rem', background: '#C5A059', color: '#000',
                  border: 'none', borderRadius: '8px', fontWeight: '900', fontSize: '0.95rem', cursor: 'pointer',
                  opacity: provisioning ? 0.6 : 1
                }}
              >
                {provisioning ? '🔄 가맹점 구성 인프라 구축 중...' : '즉시 가맹점 개설 및 매장 포맷팅'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 매장 리스트 (단일 컬럼) */}
      {activeView === 'storeList' && (
        <div style={{
          maxWidth: '900px', margin: '0 auto'
        }}>
          
          {/* 등록된 가맹점 관리 목록 — 정렬 가능한 테이블 */}
          <TenantTable
            tenants={tenants}
            loadingTenants={loadingTenants}
            selectedTenantId={selectedTenantId}
            onRowClick={(t) => { setSelectedTenantId(t.id); setIsLogModalOpen(true); }}
            onSeedLegacy={handleSeedLegacy}
            onToggleStatus={(e, t) => { e.stopPropagation(); handleToggleStoreStatus(t); }}
            onResetData={(e, t) => { e.stopPropagation(); handleResetStoreData(t); }}
            onDelete={(e, t) => { e.stopPropagation(); handleDeleteStore(t); }}
          />
        </div>
      )}

      {/* 우측: 선택한 가맹점의 응모 및 당첨 현황 로그 모니터링 (모달 팝업) */}
      {isLogModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.85)', zIndex: 9999,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }} onClick={() => setIsLogModalOpen(false)}>
          {/* 모달 컨테이너: overflow:hidden으로 내부에서만 스크롤 */}
          <div style={{
            background: '#111', border: '1px solid #333',
            borderRadius: '20px', width: '100%', maxWidth: '800px',
            height: '85vh', overflow: 'hidden',
            position: 'relative', boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
            display: 'flex', flexDirection: 'column'
          }} onClick={(e) => e.stopPropagation()}>

            {/* ─── 스크롤 시 고정되는 헤더 영역 ─── */}
            <div style={{
              flexShrink: 0,
              background: '#111',
              borderBottom: '1px solid #2a2a2a',
              padding: '1.5rem 2rem 1rem',
              borderRadius: '20px 20px 0 0',
            }}>
              {/* 제목 + 응모로그 카드(좌측) + 닫기 버튼(우측 끝) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', gap: '12px' }}>
                {/* 왼쪽: 제목 + 응모 로그 수 카드 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '100px', flexShrink: 0 }}>
                  <h3 style={{ color: '#fff', fontWeight: '900', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>📝</span> 실시간 당첨 및 이벤트 응모 내역 제어
                  </h3>
                  {/* 응모 로그 수 카드 — 제목 바로 오른쪽 */}
                  <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid #2a2a2a',
                    borderRadius: '8px',
                    padding: '5px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap',
                  }}>
                    <span style={{ fontSize: '0.65rem', color: '#666' }}>응모 로그</span>
                    <span style={{ fontSize: '1rem', fontWeight: '900', color: '#fff', lineHeight: 1 }}>
                      {loadingEntries ? '...' : `${entries.length}건`}
                    </span>
                  </div>
                </div>
                {/* 닫기 버튼 — 우측 끝 */}
                <button
                  onClick={() => setIsLogModalOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: '#888', fontSize: '1.8rem', cursor: 'pointer', transition: 'color 0.2s', lineHeight: 1, flexShrink: 0 }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
                >
                  ✕
                </button>
              </div>
              {/* 매장명 + 검색창 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                {/* 매장명만 표기 */}
                <span style={{ color: '#C5A059', fontWeight: 'bold', fontSize: '1rem' }}>
                  {tenants.find(t => t.id === selectedTenantId)?.brandName || selectedTenantId || '없음'}
                </span>
                {/* 검색창 — 고정 크기·고정 위치 */}
                <div style={{ position: 'relative', width: '320px', flexShrink: 0 }}>
                  <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#555', fontSize: '0.85rem', pointerEvents: 'none' }}>🔍</span>
                  <input
                    type="text"
                    placeholder="전화번호 · 닉네임 · 일시 검색..."
                    value={entrySearch}
                    onChange={e => setEntrySearch(e.target.value)}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      padding: '7px 28px 7px 30px',
                      background: '#0a0a0a', border: '1px solid #333',
                      borderRadius: '8px', color: '#fff', fontSize: '0.82rem',
                      outline: 'none', transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = '#C5A059'}
                    onBlur={e => e.target.style.borderColor = '#333'}
                  />
                  {entrySearch && (
                    <button
                      onClick={() => setEntrySearch('')}
                      style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', fontSize: '0.9rem', lineHeight: 1 }}
                    >✕</button>
                  )}
                </div>
              </div>
            </div>

            {/* ─── 스크롤 영역: thead sticky로 헤더와 데이터 열이 자동 일치 ─── */}
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {loadingEntries ? (
                <div style={{ color: '#666', textAlign: 'center', padding: '3rem' }}>해당 매장 당첨 데이터 실시간 수신 중...</div>
              ) : entries.length === 0 ? (
                <div style={{ color: '#555', textAlign: 'center', padding: '4rem', fontSize: '0.9rem' }}>
                  당첨 및 응모 내역이 존재하지 않습니다.<br/>이벤트에 고객이 응모를 진행하면 로그가 자동 적재됩니다.
                </div>
              ) : (() => {
                // 검색어로 필터링
                const q = entrySearch.trim().toLowerCase();
                const filtered = q
                  ? entries.filter(e =>
                      (e.phone || '').toLowerCase().includes(q) ||
                      (e.name || '').toLowerCase().includes(q) ||
                      (e.date || '').includes(q)
                    )
                  : entries;

                return (
                  <table style={{
                    width: '100%',
                    /* separate + spacing:0 → sticky th 배경 비침 방지 */
                    borderCollapse: 'separate',
                    borderSpacing: 0,
                    fontSize: '0.85rem',
                    textAlign: 'left',
                    tableLayout: 'fixed',
                  }}>
                    {/* colgroup으로 열 너비 지정 — 헤더/데이터 자동 일치 */}
                    <colgroup>
                      <col style={{ width: '22%' }} /> {/* 일시 */}
                      <col style={{ width: '13%' }} /> {/* 닉네임 */}
                      <col style={{ width: '22%' }} /> {/* 연락처 */}
                      <col />                          {/* 획득 상품 */}
                      <col style={{ width: '56px' }} />{/* 동작 */}
                    </colgroup>
                    <thead>
                      <tr>
                        {['일시', '닉네임', '연락처 (ID)', '획득 상품', '동작'].map((label, i) => (
                          <th
                            key={label}
                            style={{
                              padding: '10px 16px',
                              color: '#666',
                              fontSize: '0.8rem',
                              fontWeight: 'bold',
                              textAlign: i === 4 ? 'center' : 'left',
                              /* sticky: 스크롤 시 헤더 고정 */
                              position: 'sticky',
                              top: 0,
                              background: '#111',
                              zIndex: 2,
                              /* border-collapse:separate일 때 구분선은 box-shadow로 */
                              boxShadow: '0 1px 0 #2a2a2a',
                            }}
                          >
                            {label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#555', fontSize: '0.9rem' }}>
                            검색 결과가 없습니다.
                          </td>
                        </tr>
                      ) : filtered.map(entry => {
                        const dateStr = entry.createdAt?.seconds
                          ? new Date(entry.createdAt.seconds * 1000).toLocaleString()
                          : (entry.date || '대기 중');
                        return (
                          <tr key={entry.id} style={{ borderBottom: '1px solid #1e1e1e', color: '#ddd' }}>
                            {/* 1: 일시 */}
                            <td style={{ padding: '12px 16px', fontSize: '0.75rem', color: '#888', borderBottom: '1px solid #1e1e1e' }}>{dateStr}</td>
                            {/* 2: 닉네임 */}
                            <td style={{ padding: '12px 16px', color: '#aaa', fontSize: '0.8rem', borderBottom: '1px solid #1e1e1e' }}>
                              {entry.name || <span style={{ color: '#444' }}>-</span>}
                            </td>
                            {/* 3: 연락처 */}
                            <td style={{ padding: '12px 16px', fontWeight: 'bold', borderBottom: '1px solid #1e1e1e' }}>{entry.phone}</td>
                            {/* 4: 획득 상품 */}
                            <td style={{ padding: '12px 16px', color: '#C5A059', borderBottom: '1px solid #1e1e1e' }}>{entry.prizeName || entry.prize}</td>
                            {/* 5: 동작 */}
                            <td style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '1px solid #1e1e1e' }}>
                              <button
                                onClick={() => handleDeleteEntry(entry.id)}
                                style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '1rem' }}
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default SuperAdmin;
