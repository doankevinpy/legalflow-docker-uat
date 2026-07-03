import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { procedureCasesApi } from '../lib/procedureCasesApi';
import type { ProcedureCase, ProcedureChecklistItem } from '../types/procedure';

export default function ProcedureCaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const caseId = id || '';

  const [data, setData] = useState<ProcedureCase | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'documents' | 'ai_review' | 'checklist' | 'financial' | 'notes' | 'audit_log'
  >('overview');

  // New Note
  const [noteContent, setNoteContent] = useState<string>('');

  // New Checklist
  const [newChecklistTitle, setNewChecklistTitle] = useState<string>('');
  const [newChecklistGroup, setNewChecklistGroup] = useState<string>('Thành phần hồ sơ');

  const fetchDetail = async () => {
    if (!caseId) return;
    setLoading(true);
    try {
      const res = await procedureCasesApi.getCase(caseId);
      setData(res);
    } catch (err) {
      console.error('Error fetching procedure case detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [caseId]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    try {
      await procedureCasesApi.addNote(caseId, { content: noteContent });
      setNoteContent('');
      fetchDetail();
    } catch (err: any) {
      alert('Lỗi thêm ghi chú: ' + (err?.message || 'Không xác định'));
    }
  };

  const handleAddChecklist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistTitle.trim()) return;
    try {
      await procedureCasesApi.addChecklist(caseId, {
        checklistGroup: newChecklistGroup,
        title: newChecklistTitle,
      });
      setNewChecklistTitle('');
      fetchDetail();
    } catch (err: any) {
      alert('Lỗi thêm checklist: ' + (err?.message || 'Không xác định'));
    }
  };

  const handleToggleChecklist = async (item: ProcedureChecklistItem) => {
    try {
      await procedureCasesApi.updateChecklist(caseId, item.id, { isCompleted: !item.isCompleted });
      fetchDetail();
    } catch (err: any) {
      alert('Lỗi cập nhật checklist: ' + (err?.message || 'Không xác định'));
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Đang tải chi tiết hồ sơ...</div>;
  }

  if (!data) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="text-red-500 font-medium">Không tìm thấy thông tin hồ sơ thủ tục hành chính.</div>
        <button onClick={() => navigate('/procedure-cases')} className="px-4 py-2 bg-gray-200 rounded-lg text-sm font-medium">
          &larr; Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start border-b pb-4">
        <div>
          <button onClick={() => navigate('/procedure-cases')} className="text-sm text-blue-600 hover:underline mb-2 flex items-center gap-1 font-medium">
            &larr; Quay lại danh sách TTHC
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-mono text-gray-800">{data.caseCode}</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
              {data.status}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-700 mt-1">
            {data.procedureType?.name} &bull; Lĩnh vực: <span className="font-semibold">{data.field}</span>
          </p>
        </div>
      </div>

      {/* 7 Tabs Navigation */}
      <div className="flex border-b gap-1 bg-gray-50 p-1 rounded-t-xl overflow-x-auto text-sm font-medium">
        {[
          { key: 'overview', label: '1. Tổng quan' },
          { key: 'documents', label: '2. Tài liệu' },
          { key: 'ai_review', label: '3. AI rà soát' },
          { key: 'checklist', label: '4. Checklist' },
          { key: 'financial', label: '5. Nghĩa vụ tài chính' },
          { key: 'notes', label: '6. Ghi chú' },
          { key: 'audit_log', label: '7. Audit log' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`px-4 py-2.5 rounded-lg whitespace-nowrap transition ${
              activeTab === t.key
                ? 'bg-white text-blue-600 font-bold shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded-b-xl shadow-sm border border-gray-100 min-h-[400px]">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 text-sm">
            <h3 className="text-base font-bold text-gray-800 border-b pb-2">Thông tin người nộp &amp; tiếp nhận</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <span className="text-gray-500 block text-xs">Họ tên người nộp</span>
                <span className="font-semibold text-gray-800 text-base">{data.applicantName}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">Số điện thoại</span>
                <span className="font-medium text-gray-800">{data.applicantPhone || '---'}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">Ngày tiếp nhận</span>
                <span className="font-medium text-gray-800">{new Date(data.receivedAt).toLocaleString('vi-VN')}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 block text-xs">Địa chỉ</span>
                <span className="font-medium text-gray-800">{data.applicantAddress || '---'}</span>
              </div>
            </div>

            <h3 className="text-base font-bold text-gray-800 border-b pb-2 pt-4">Thông tin thửa đất / công trình</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border">
              <div>
                <span className="text-gray-500 block text-xs">Số tờ bản đồ</span>
                <span className="font-semibold text-gray-800">{data.landParcelSummary?.mapSheetNumber || '---'}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">Số thửa đất</span>
                <span className="font-semibold text-gray-800">{data.landParcelSummary?.parcelNumber || '---'}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">Diện tích</span>
                <span className="font-semibold text-gray-800">
                  {data.landParcelSummary?.area ? `${data.landParcelSummary.area} m²` : '---'}
                </span>
              </div>
            </div>

            {data.notes && (
              <div>
                <span className="text-gray-500 block text-xs">Ghi chú ban đầu</span>
                <div className="p-3 bg-blue-50/50 rounded-lg text-gray-700 mt-1">{data.notes}</div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-800">Danh sách tài liệu hồ sơ TTHC</h3>
            {(!data.documents || data.documents.length === 0) ? (
              <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed text-gray-500 text-sm">
                Chưa có tài liệu đính kèm cho hồ sơ này. (Nghiệp vụ upload/OCR tài liệu chuyên sâu sẽ triển khai ở phase tiếp theo).
              </div>
            ) : (
              <ul className="divide-y border rounded-xl">
                {data.documents.map((doc) => (
                  <li key={doc.id} className="p-4 flex justify-between items-center text-sm">
                    <div>
                      <span className="font-semibold text-gray-800 block">{doc.title}</span>
                      <span className="text-xs text-gray-500">Loại: {doc.documentType} &bull; Trạng thái: {doc.reviewStatus}</span>
                    </div>
                    {doc.fileUrl && (
                      <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs">
                        Xem file &rarr;
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* TAB 3: AI REVIEW (Placeholder conforming strictly to user rules) */}
        {activeTab === 'ai_review' && (
          <div className="space-y-6">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-sm">
              <div className="flex items-center gap-2 font-bold text-amber-800 uppercase tracking-wide text-sm">
                <span>⚠️</span>
                <span>BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA</span>
              </div>
              <p className="text-xs text-amber-700 mt-1">
                AI không kết luận thay cán bộ rằng hồ sơ đủ hay không đủ điều kiện. Cán bộ thẩm tra phải đối chiếu với tài liệu gốc theo nguyên tắc Human-in-the-Loop.
              </p>
            </div>

            <div className="p-12 text-center bg-gray-50 rounded-xl border border-dashed space-y-3">
              <div className="text-3xl">🤖</div>
              <h4 className="font-bold text-gray-700 text-base">Tính năng Trợ lý AI thẩm tra chuyên sâu chưa kích hoạt</h4>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Trong giai đoạn Phase 7C-A (Nền tảng kỹ thuật), module AI chuyên sâu chưa được kết nối. Hệ thống sẽ hỗ trợ tự động rà soát thành phần hồ sơ, đối chiếu thông tin và gợi ý phiếu thẩm tra tại các phase tiếp theo (Phase 7C-B / 7D).
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="space-y-6 text-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-gray-800">Checklist thẩm định thành phần hồ sơ</h3>
            </div>

            <form onSubmit={handleAddChecklist} className="flex gap-2 bg-gray-50 p-3 rounded-xl border">
              <input
                type="text"
                placeholder="Nhóm (VD: Pháp lý)"
                value={newChecklistGroup}
                onChange={(e) => setNewChecklistGroup(e.target.value)}
                className="w-1/4 px-3 py-2 border rounded-lg text-sm bg-white"
              />
              <input
                type="text"
                required
                placeholder="Tên mục kiểm tra (VD: Đơn đăng ký cấp GCN Mẫu 04a/ĐK)"
                value={newChecklistTitle}
                onChange={(e) => setNewChecklistTitle(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg text-sm bg-white"
              />
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
                + Thêm mục
              </button>
            </form>

            {(!data.checklistItems || data.checklistItems.length === 0) ? (
              <div className="p-8 text-center text-gray-500 border border-dashed rounded-xl">
                Chưa có mục checklist nào. Hãy thêm tiêu chí kiểm tra ở trên.
              </div>
            ) : (
              <div className="space-y-2">
                {data.checklistItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleChecklist(item)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      item.isCompleted ? 'bg-green-50/60 border-green-200' : 'bg-white hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={item.isCompleted}
                        onChange={() => {}}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          [{item.checklistGroup}]
                        </span>{' '}
                        <span className={`font-medium ${item.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {item.title}
                        </span>
                      </div>
                    </div>
                    {item.isCompleted && (
                      <span className="text-xs text-green-700 font-medium">
                        Đã kiểm tra {item.completedBy?.fullName ? `bởi ${item.completedBy.fullName}` : ''}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: FINANCIAL REVIEW (Placeholder for Phase 7E) */}
        {activeTab === 'financial' && (
          <div className="space-y-6">
            <div className="p-12 text-center bg-gray-50 rounded-xl border border-dashed space-y-3">
              <div className="text-3xl">💰</div>
              <h4 className="font-bold text-gray-700 text-base">Hỗ trợ tính nghĩa vụ tài chính dự kiến (Chưa triển khai)</h4>
              <p className="text-sm text-gray-600 max-w-lg mx-auto font-medium">
                AI hỗ trợ lập bảng tính dự kiến nghĩa vụ tài chính/tiền sử dụng đất theo dữ liệu đầu vào và căn cứ đã được cấu hình; cán bộ/cơ quan có thẩm quyền kiểm tra, xác nhận trước khi sử dụng.
              </p>
              <p className="text-xs text-gray-400">
                Tính năng phân tích 3 mức (Tối thiểu / Trung bình / Tối đa) sẽ được xây dựng và nghiệm thu riêng tại Phase 7E.
              </p>
            </div>
          </div>
        )}

        {/* TAB 6: NOTES */}
        {activeTab === 'notes' && (
          <div className="space-y-6 text-sm">
            <form onSubmit={handleAddNote} className="space-y-3 bg-gray-50 p-4 rounded-xl border">
              <label className="block font-medium text-gray-700">Thêm ý kiến thẩm định / trao đổi nội bộ</label>
              <textarea
                rows={3}
                required
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Nhập nội dung ý kiến..."
                className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <div className="flex justify-end">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
                  Gửi ghi chú
                </button>
              </div>
            </form>

            {(!data.procedureNotes || data.procedureNotes.length === 0) ? (
              <div className="p-8 text-center text-gray-500 border border-dashed rounded-xl">Chưa có ý kiến trao đổi nào.</div>
            ) : (
              <div className="space-y-3">
                {data.procedureNotes.map((note) => (
                  <div key={note.id} className="p-4 bg-gray-50 rounded-xl border space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span className="font-bold text-gray-800">{note.user?.fullName || 'Cán bộ hệ thống'}</span>
                      <span>{new Date(note.createdAt).toLocaleString('vi-VN')}</span>
                    </div>
                    <p className="text-gray-700 text-sm">{note.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: AUDIT LOG */}
        {activeTab === 'audit_log' && (
          <div className="space-y-4 text-sm">
            <h3 className="text-base font-bold text-gray-800">Nhật ký truy vết thao tác hồ sơ TTHC</h3>
            {(!data.auditLogs || data.auditLogs.length === 0) ? (
              <div className="p-8 text-center text-gray-500 border border-dashed rounded-xl">Chưa có nhật ký nào.</div>
            ) : (
              <table className="w-full text-left border-collapse border rounded-xl overflow-hidden text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b font-semibold text-gray-600">
                    <th className="p-3">Thời gian</th>
                    <th className="p-3">Hành động</th>
                    <th className="p-3">Thực hiện bởi</th>
                    <th className="p-3">Đối tượng</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="p-3 text-gray-500">{new Date(log.createdAt).toLocaleString('vi-VN')}</td>
                      <td className="p-3 font-mono font-semibold text-blue-700">{log.actionType}</td>
                      <td className="p-3 font-medium text-gray-800">{log.user?.fullName || log.userId}</td>
                      <td className="p-3 text-gray-600">{log.entityType} ({log.entityId?.slice(0, 8)})</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
