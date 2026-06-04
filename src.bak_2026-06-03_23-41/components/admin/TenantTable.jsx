import { useState, useMemo } from 'react';

/**
 * 정렬 가능한 입점 매장 테이블 컴포넌트
 * - 헤더 클릭으로 오름/내림차순 정렬
 * - 가입순 번호 표기
 * - 행 클릭 → 응모 내역 팝업 열기
 */

// 헤더 셀 렌더러 (정렬 아이콘 포함)
const SortableHeader = ({ label, field, sortField, sortAsc, onClick, style = {} }) => {
  const isActive = sortField === field;
  return (
    <th
      onClick={() => onClick(field)}
      style={{
        padding: '10px 12px',
        color: isActive ? '#C5A059' : '#666',
        fontWeight: 'bold',
        fontSize: '0.75rem',
        cursor: 'pointer',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        borderBottom: '2px solid #2a2a2a',
        transition: 'color 0.2s',
        background: 'transparent',
        ...style,
      }}
    >
      {label}{' '}
      <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>
        {isActive ? (sortAsc ? '▲' : '▼') : '⇅'}
      </span>
    </th>
  );
};

const TenantTable = ({
  tenants,
  loadingTenants,
  selectedTenantId,
  onRowClick,
  onSeedLegacy,
  onToggleStatus,
  onResetData,
  onDelete,
}) => {
  // 정렬 상태: 기본값 가입일 오름차순(가입순)
  const [sortField, setSortField] = useState('createdAt');
  const [sortAsc, setSortAsc] = useState(true);
  // 검색어 상태
  const [searchQuery, setSearchQuery] = useState('');

  // 헤더 클릭 시 정렬 필드 및 방향 전환
  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc((prev) => !prev);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // 정렬된 테넌트 목록 (useMemo로 최적화)
  const sortedTenants = useMemo(() => {
    const arr = [...tenants];
    arr.sort((a, b) => {
      let va, vb;
      if (sortField === 'createdAt') {
        // Firestore Timestamp 또는 숫자(seconds) 처리
        va = a.createdAt?.seconds ?? a.createdAt ?? 0;
        vb = b.createdAt?.seconds ?? b.createdAt ?? 0;
      } else if (sortField === 'brandName') {
        va = (a.brandName || '').toLowerCase();
        vb = (b.brandName || '').toLowerCase();
      } else if (sortField === 'address') {
        va = (a.address || '').toLowerCase();
        vb = (b.address || '').toLowerCase();
      } else if (sortField === 'status') {
        va = a.status || 'active';
        vb = b.status || 'active';
      } else {
        va = a[sortField] ?? '';
        vb = b[sortField] ?? '';
      }
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ? 1 : -1;
      return 0;
    });
    return arr;
  }, [tenants, sortField, sortAsc]);

  // 검색어로 필터링된 최종 목록
  const filteredTenants = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return sortedTenants;
    return sortedTenants.filter(t =>
      (t.brandName || '').toLowerCase().includes(q) ||
      (t.address || '').toLowerCase().includes(q) ||
      (t.id || '').toLowerCase().includes(q)
    );
  }, [sortedTenants, searchQuery]);

  // 가입순 번호를 위해 가입일 기준 원본 인덱스 맵 생성
  const joinOrderMap = useMemo(() => {
    const byJoin = [...tenants].sort((a, b) => {
      const ta = a.createdAt?.seconds ?? a.createdAt ?? 0;
      const tb = b.createdAt?.seconds ?? b.createdAt ?? 0;
      return ta - tb;
    });
    const map = {};
    byJoin.forEach((t, i) => { map[t.id] = i + 1; });
    return map;
  }, [tenants]);

  // 날짜 포맷 함수
  const formatDate = (createdAt) => {
    if (!createdAt) return '-';
    const ts = createdAt.seconds ? createdAt.seconds * 1000 : createdAt;
    const d = new Date(ts);
    if (isNaN(d)) return '-';
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid #222',
      borderRadius: '20px',
      padding: '2rem',
    }}>
      {/* 헤더 영역 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '12px', flexWrap: 'wrap' }}>
        <h3 style={{ color: '#fff', fontWeight: '900', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <span>📋</span> 입점 매장 리스트
          <span style={{ fontSize: '0.8rem', color: '#555', fontWeight: 'normal', marginLeft: '6px' }}>
            {searchQuery ? `${filteredTenants.length} / ${tenants.length}개` : `총 ${tenants.length}개`}
          </span>
        </h3>
        {/* 검색창 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 200px', maxWidth: '360px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#555', fontSize: '0.9rem', pointerEvents: 'none' }}>🔍</span>
            <input
              type="text"
              placeholder="매장명 또는 주소 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '8px 32px 8px 32px',
                background: '#0a0a0a', border: '1px solid #333',
                borderRadius: '8px', color: '#fff', fontSize: '0.85rem',
                outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#C5A059'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}
                title="검색어 지우기"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        {tenants.length === 0 && (
          <button
            onClick={onSeedLegacy}
            style={{ background: '#333', border: 'none', color: '#C5A059', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0 }}
          >
            기본 데모 추가 (Seed)
          </button>
        )}
      </div>

      {/* 본문 */}
      {loadingTenants ? (
        <div style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>가맹점 데이터 목록 불러오는 중...</div>
      ) : tenants.length === 0 ? (
        <div style={{ color: '#666', textAlign: 'center', padding: '2rem', fontSize: '0.9rem' }}>
          현재 입점 가맹점이 없습니다.<br />위 가맹점 발급 폼으로 매장을 개설해 주세요.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr>
                {/* 번호 — 가입순 고정, 정렬 불가 */}
                <th style={{ padding: '10px 12px', color: '#444', fontWeight: 'bold', fontSize: '0.75rem', borderBottom: '2px solid #2a2a2a', width: '40px', textAlign: 'center' }}>#</th>
                <SortableHeader label="매장명 / 주소" field="brandName" sortField={sortField} sortAsc={sortAsc} onClick={handleSort} />
                <SortableHeader label="가입일" field="createdAt" sortField={sortField} sortAsc={sortAsc} onClick={handleSort} style={{ width: '100px' }} />
                <SortableHeader label="상태" field="status" sortField={sortField} sortAsc={sortAsc} onClick={handleSort} style={{ width: '70px', textAlign: 'center' }} />
                {/* 액션 버튼 — 정렬 없음 */}
                <th style={{ padding: '10px 12px', color: '#444', fontWeight: 'bold', fontSize: '0.75rem', borderBottom: '2px solid #2a2a2a', textAlign: 'right' }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenants.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#555', fontSize: '0.9rem' }}>검색 결과가 없습니다.</td></tr>
              ) : filteredTenants.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => onRowClick(t)}
                  style={{
                    cursor: 'pointer',
                    borderBottom: '1px solid #1a1a1a',
                    background: selectedTenantId === t.id ? 'rgba(197, 160, 89, 0.06)' : 'transparent',
                    opacity: t.status === 'suspended' ? 0.6 : 1,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedTenantId !== t.id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  }}
                  onMouseLeave={(e) => {
                    if (selectedTenantId !== t.id) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {/* 번호 (가입순) */}
                  <td style={{ padding: '12px', textAlign: 'center', color: '#444', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {joinOrderMap[t.id]}
                  </td>

                  {/* 매장명 + ID + 주소 한 줄 */}
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                      <span style={{ fontWeight: 'bold', color: selectedTenantId === t.id ? '#C5A059' : '#fff' }}>
                        {t.brandName}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#444', background: '#111', padding: '1px 5px', borderRadius: '3px' }}>
                        {t.id}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#666' }}>
                      {t.address || '-'}
                    </div>
                  </td>

                  {/* 가입일 */}
                  <td style={{ padding: '12px', color: '#666', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                    {formatDate(t.createdAt)}
                  </td>

                  {/* 상태 뱃지 */}
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '20px',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                      background: t.status === 'suspended' ? 'rgba(255,77,77,0.1)' : 'rgba(76,175,80,0.1)',
                      color: t.status === 'suspended' ? '#ff4d4d' : '#4caf50',
                      border: `1px solid ${t.status === 'suspended' ? 'rgba(255,77,77,0.3)' : 'rgba(76,175,80,0.3)'}`,
                    }}>
                      {t.status === 'suspended' ? '🔴 정지' : '🟢 운영중'}
                    </span>
                  </td>

                  {/* 액션 버튼 */}
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'flex-end', flexWrap: 'nowrap' }}>
                      <a
                        href={`/${t.id}`} target="_blank" rel="noreferrer"
                        style={{ padding: '5px 8px', background: '#222', color: '#fff', fontSize: '0.7rem', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold', whiteSpace: 'nowrap' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        홈➔
                      </a>
                      <a
                        href={`/${t.id}/admin`} target="_blank" rel="noreferrer"
                        style={{ padding: '5px 8px', background: 'rgba(197,160,89,0.1)', color: '#C5A059', border: '1px solid rgba(197,160,89,0.2)', fontSize: '0.7rem', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold', whiteSpace: 'nowrap' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        관리🛠️
                      </a>
                      <button
                        onClick={(e) => onToggleStatus(e, t)}
                        style={{ padding: '5px 8px', fontSize: '0.7rem', background: t.status === 'suspended' ? '#4caf50' : '#d32f2f', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }}
                      >
                        {t.status === 'suspended' ? '재개' : '정지'}
                      </button>
                      <button
                        onClick={(e) => onResetData(e, t)}
                        style={{ padding: '5px 8px', fontSize: '0.7rem', background: 'transparent', border: '1px solid #d32f2f', color: '#d32f2f', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }}
                        title="데이터 초기화"
                      >
                        초기화⚠️
                      </button>
                      <button
                        onClick={(e) => onDelete(e, t)}
                        style={{ padding: '5px 8px', fontSize: '0.8rem', background: 'rgba(255,77,77,0.1)', border: '1px solid rgba(255,77,77,0.2)', color: '#ff4d4d', borderRadius: '5px', cursor: 'pointer' }}
                        title="가맹점 완전 삭제"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TenantTable;
