import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import {
  collection, addDoc, getDocs, deleteDoc, doc, updateDoc,
  query, orderBy, serverTimestamp
} from 'firebase/firestore';

/**
 * AdminSmsManager — SMS 문자 템플릿 관리 컴포넌트
 * - 템플릿 등록 / 수정 / 삭제
 * - 삭제 시 모달 확인 팝업
 *
 * ※ smsTemplates 컬렉션은 전역(테넌트 비공유) 컬렉션입니다.
 */
const AdminSmsManager = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [newContent, setNewContent] = useState('');
  const [editContent, setEditContent] = useState('');

  // ✅ 수정: fetchTemplates를 useEffect보다 먼저 선언하여 "접근 전 선언" 오류 방지
  const fetchTemplates = async () => {
    try {
      const q = query(collection(db, 'smsTemplates'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      setTemplates(list);
    } catch (err) {
      console.error('템플릿 불러오기 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 새 템플릿 등록
  const handleAddTemplate = async () => {
    if (!newContent.trim()) {
      alert('템플릿 내용을 입력해 주세요.');
      return;
    }
    setSaving(true);
    try {
      await addDoc(collection(db, 'smsTemplates'), {
        content: newContent.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setNewContent('');
      await fetchTemplates();
      alert('템플릿이 성공적으로 등록되었습니다.');
    } catch (err) {
      console.error('템플릿 등록 오류:', err);
      alert('템플릿 등록 실패: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // 수정 모드 진입
  const startEdit = (template) => {
    setEditingId(template.id);
    setEditContent(template.content);
  };

  // 수정 내용 저장
  const handleUpdate = async () => {
    if (!editContent.trim()) {
      alert('수정할 내용을 입력해 주세요.');
      return;
    }
    try {
      await updateDoc(doc(db, 'smsTemplates', editingId), {
        content: editContent.trim(),
        updatedAt: serverTimestamp()
      });
      setEditingId(null);
      await fetchTemplates();
      alert('수정되었습니다.');
    } catch (err) {
      console.error('수정 오류:', err);
      alert('수정 실패: ' + err.message);
    }
  };

  // 삭제 버튼 클릭 → 모달 오픈
  const handleDeleteClick = (id) => {
    setDeleteTargetId(id);
  };

  // 삭제 확인 → Firestore 삭제 후 목록 새로고침
  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteDoc(doc(db, 'smsTemplates', deleteTargetId));
      setDeleteTargetId(null);
      await fetchTemplates();
    } catch (err) {
      console.error('삭제 오류:', err);
      alert('삭제 중 오류가 발생했습니다: ' + err.message);
    }
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(197, 160, 89, 0.2)',
    borderRadius: '20px',
    padding: '1.5rem',
    marginBottom: '1rem',
    position: 'relative',
    transition: 'all 0.3s ease'
  };

  const inputStyle = {
    width: '100%',
    padding: '1rem',
    background: '#000',
    border: '1px solid #333',
    color: '#fff',
    borderRadius: '12px',
    marginBottom: '1rem',
    outline: 'none',
    fontSize: '0.95rem',
    resize: 'vertical'
  };

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto', color: '#fff', paddingBottom: '120px' }}>
      <h2 style={{ color: '#c5a059', marginBottom: '2rem', textAlign: 'left', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px' }}>
        💬 문자 메세지 템플릿 관리
      </h2>

      {/* 신규 등록 폼 */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(197, 160, 89, 0.3)',
        borderRadius: '20px',
        padding: '2rem 1.5rem',
        marginBottom: '2.5rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <label style={{ display: 'block', color: '#c5a059', fontWeight: 'bold', marginBottom: '0.8rem', fontSize: '0.95rem' }}>✨ 새 템플릿 작성</label>
        <textarea
          placeholder="여기에 문자 메세지 내용을 입력하세요..."
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          style={{ ...inputStyle, height: '100px' }}
        />
        <button
          onClick={handleAddTemplate}
          disabled={saving}
          className="premium-gold-button"
          style={{ width: '100%', padding: '1.1rem', borderRadius: '15px', fontSize: '1rem', fontWeight: '900', background: 'linear-gradient(135deg, #fceabb 0%, #fccd4d 40%, #f8b500 50%, #fccd4d 60%, #fbdf93 100%)', color: '#000', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {saving ? '⏳ 등록 중...' : <><span>📌</span> 템플릿 저장</>}
        </button>
      </div>

      <h3 style={{ color: '#c5a059', fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.2rem' }}>
        📋 저장된 템플릿 목록
      </h3>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#c5a059' }}>데이터 로딩 중...</div>
      ) : templates.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666', background: 'rgba(255,255,255,0.02)', borderRadius: '15px' }}>등록된 템플릿이 없습니다.</div>
      ) : (
        <div>
          {templates.map(template => (
            <div key={template.id} style={cardStyle}>
              {editingId === template.id ? (
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#c5a059', fontWeight: 'bold', fontSize: '0.85rem' }}>✏️ 템플릿 수정</label>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    style={{ ...inputStyle, height: '100px' }}
                  />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={handleUpdate} style={{ flex: 1, padding: '0.8rem', background: '#c5a059', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}>저장</button>
                    <button onClick={() => setEditingId(null)} style={{ flex: 1, padding: '0.8rem', background: '#333', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}>취소</button>
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', marginBottom: '1.5rem', fontSize: '0.95rem', color: '#ddd' }}>{template.content}</p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => startEdit(template)} style={{ flex: 1, padding: '0.6rem', background: 'rgba(197, 160, 89, 0.1)', color: '#c5a059', border: '1px solid #c5a059', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>수정</button>
                    <button onClick={() => handleDeleteClick(template.id)} style={{ flex: 1, padding: '0.6rem', background: 'rgba(255, 77, 77, 0.1)', color: '#ff4d4d', border: '1px solid #ff4d4d', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>삭제</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── 삭제 확인 다이얼로그 ── */}
      {deleteTargetId && (
        <div
          onClick={() => setDeleteTargetId(null)}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)',
            zIndex: 9999999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#1a1a1a', borderRadius: '20px',
              border: '1px solid rgba(255, 77, 77, 0.4)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
              padding: '2rem', textAlign: 'center',
              width: '100%', maxWidth: '320px',
              animation: 'popupFadeIn 0.2s ease-out'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>🗑️</div>
            <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '900', marginBottom: '0.5rem' }}>
              템플릿 삭제
            </h4>
            <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              이 문자 템플릿을 삭제하시겠습니까?<br />
              <span style={{ color: '#ff6b6b', fontSize: '0.75rem' }}>삭제 후 복구가 불가능합니다.</span>
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setDeleteTargetId(null)}
                style={{
                  flex: 1, padding: '0.8rem', borderRadius: '10px',
                  background: '#222', border: '1px solid #333',
                  color: '#aaa', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem'
                }}
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  flex: 1, padding: '0.8rem', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #ff4d4d, #cc0000)',
                  border: '1px solid #ff6b6b',
                  color: '#fff', fontWeight: '900', cursor: 'pointer', fontSize: '0.9rem',
                  boxShadow: '0 0 15px rgba(255,77,77,0.3)'
                }}
              >
                삭제
              </button>
            </div>
          </div>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes popupFadeIn {
              from { opacity: 0; transform: scale(0.92) translateY(10px); }
              to   { opacity: 1; transform: scale(1)    translateY(0); }
            }
          `}} />
        </div>
      )}
    </div>
  );
};

export default AdminSmsManager;
