import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { procedureCasesApi } from '../lib/procedureCasesApi';
import type { ProcedureCase, ProcedureChecklistItem, ProcedureAiAnalysis } from '../types/procedure';
import { getApiErrorMessage } from '../lib/apiClient';
import { Printer, Download } from 'lucide-react';
import { AI_REVIEW_WARNING } from '../lib/constants';
import { ProcedureReviewPrintModal } from '../components/ProcedureReviewPrintModal';
import { PurposeChangeReviewPrintModal } from '../components/PurposeChangeReviewPrintModal';
import { FinancialObligationPanel } from '../components/financial-obligations/FinancialObligationPanel';
import { useAuth } from '../contexts/AuthContext';

export default function ProcedureCaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const caseId = id || '';
  const { user } = useAuth();
  const role = user?.role ?? 'VIEWER';
  const canAct = role !== 'VIEWER';

  const [data, setData] = useState<ProcedureCase | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'documents' | 'ai_review' | 'checklist' | 'financial' | 'notes' | 'audit_log'
  >('overview');

  // AI Review State
  const [aiAnalyses, setAiAnalyses] = useState<ProcedureAiAnalysis[]>([]);
  const [runningAi, setRunningAi] = useState<boolean>(false);
  const [snapshotError, setSnapshotError] = useState<string | null>(null);

  // Review Print/Export Modal State
  const [reviewPreviewModalOpen, setReviewPreviewModalOpen] = useState<boolean>(false);
  const [purposeChangeReviewModalOpen, setPurposeChangeReviewModalOpen] = useState<boolean>(false);
  const [reviewPreviewData, setReviewPreviewData] = useState<any>(null);
  const [activeAnalysisIdForModal, setActiveAnalysisIdForModal] = useState<string | null>(null);
  const [exportingAnalysisId, setExportingAnalysisId] = useState<string | null>(null);
  const [previewingAnalysisId, setPreviewingAnalysisId] = useState<string | null>(null);

  // New Note
  const [noteContent, setNoteContent] = useState<string>('');

  // New Checklist
  const [newChecklistTitle, setNewChecklistTitle] = useState<string>('');
  const [newChecklistGroup, setNewChecklistGroup] = useState<string>('Thành phần hồ sơ');

  const fetchDetail = async () => {
    if (!caseId) return;
    setLoading(true);
    setError(null);
    setSnapshotError(null);
    try {
      const res = await procedureCasesApi.getCase(caseId);
      setData(res);
      try {
        const aiRes = await procedureCasesApi.getAiAnalyses(caseId);
        setAiAnalyses(aiRes || []);
      } catch (aiErr) {
        console.error('Error fetching AI analyses:', aiErr);
        setSnapshotError(getApiErrorMessage(aiErr));
      }
    } catch (err: any) {
      console.error('Error fetching procedure case detail:', err);
      setError(getApiErrorMessage(err) || 'Không thể tải chi tiết hồ sơ thủ tục hành chính.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [caseId]);

  const handleRunAiReview = async () => {
    if (!caseId || !data) return;
    setRunningAi(true);
    setSnapshotError(null);
    try {
      const isPurposeChange = data.procedureType?.code === 'LAND_USE_PURPOSE_CHANGE' || data.procedureType?.group === 'CHUYEN_MUC_DICH_SDD';
      const newAnalysis = isPurposeChange
        ? await procedureCasesApi.runLandUsePurposeChangeReview(caseId)
        : await procedureCasesApi.runLandFirstCertificateReview(caseId);
      setAiAnalyses((prev) => [newAnalysis, ...prev]);
      alert('Đã hoàn thành rà soát AI cho hồ sơ!');
    } catch (err: any) {
      const msg = getApiErrorMessage(err);
      setSnapshotError(msg);
      alert(msg);
    } finally {
      setRunningAi(false);
    }
  };

  const handleAcceptAiAnalysis = async (analysisId: string, saveToNote: boolean, applyChecklist: boolean) => {
    try {
      await procedureCasesApi.acceptAiAnalysis(caseId, analysisId, { saveToNote, applyChecklist });
      alert('Đã chấp nhận kết quả rà soát AI!');
      fetchDetail();
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Lỗi khi chấp nhận kết quả.');
    }
  };

  const handleRejectAiAnalysis = async (analysisId: string) => {
    try {
      await procedureCasesApi.rejectAiAnalysis(caseId, analysisId);
      alert('Đã từ chối kết quả rà soát AI.');
      fetchDetail();
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Lỗi khi từ chối kết quả.');
    }
  };

  const handleExportReviewDocx = async (analysisId: string) => {
    if (!data) return;
    try {
      setExportingAnalysisId(analysisId);
      const { blob, filename } = await procedureCasesApi.exportReviewDocx(data.id, analysisId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const downloadName = (filename && filename.startsWith('DU_THAO_GOI_Y_AI_'))
        ? filename
        : (filename ? 'DU_THAO_GOI_Y_AI_' + filename : `DU_THAO_GOI_Y_AI_phieu-ra-soat-cap-gcn-lan-dau-${data.caseCode || data.id}.docx`);
      link.setAttribute('download', downloadName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      alert('Đã xuất Word (.docx) phiếu rà soát thành công!');
    } catch (err: any) {
      alert(getApiErrorMessage(err) || 'Không thể xuất file Word phiếu rà soát');
    } finally {
      setExportingAnalysisId(null);
    }
  };

  const handlePreviewReviewPdf = async (analysisId: string) => {
    if (!data) return;
    try {
      setPreviewingAnalysisId(analysisId);
      setActiveAnalysisIdForModal(analysisId);
      const resData = await procedureCasesApi.getReviewPreviewData(data.id, analysisId);
      setReviewPreviewData(resData);
      setReviewPreviewModalOpen(true);
    } catch (err: any) {
      alert(getApiErrorMessage(err) || 'Không thể xem trước phiếu rà soát PDF');
    } finally {
      setPreviewingAnalysisId(null);
    }
  };

  const handleExportPurposeChangeReviewDocx = async (analysisId: string) => {
    if (!data) return;
    try {
      setExportingAnalysisId(analysisId);
      const { blob, filename } = await procedureCasesApi.exportPurposeChangeReviewDocx(data.id, analysisId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const downloadName = (filename && filename.startsWith('DU_THAO_GOI_Y_AI_'))
        ? filename
        : (filename ? 'DU_THAO_GOI_Y_AI_' + filename : `DU_THAO_GOI_Y_AI_phieu-ra-soat-chuyen-muc-dich-su-dung-dat-${data.caseCode || data.id}.docx`);
      link.setAttribute('download', downloadName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      alert('Đã xuất Word (.docx) phiếu rà soát chuyển mục đích sử dụng đất thành công!');
    } catch (err: any) {
      alert(getApiErrorMessage(err) || 'Không thể xuất file Word phiếu rà soát');
    } finally {
      setExportingAnalysisId(null);
    }
  };

  const handlePreviewPurposeChangeReviewPdf = async (analysisId: string) => {
    if (!data) return;
    try {
      setPreviewingAnalysisId(analysisId);
      setActiveAnalysisIdForModal(analysisId);
      const resData = await procedureCasesApi.getPurposeChangeReviewPreviewData(data.id, analysisId);
      setReviewPreviewData(resData);
      setPurposeChangeReviewModalOpen(true);
    } catch (err: any) {
      alert(getApiErrorMessage(err) || 'Không thể xem trước phiếu rà soát PDF');
    } finally {
      setPreviewingAnalysisId(null);
    }
  };

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

  const formatStatusInfo = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return { label: 'Mới tiếp nhận', className: 'bg-sky-50 text-sky-700 border-sky-200' };
      case 'IN_REVIEW':
        return { label: 'Đang thẩm tra', className: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'SUPPLEMENT_REQUIRED':
        return { label: 'Cần bổ sung', className: 'bg-orange-50 text-orange-700 border-orange-200' };
      case 'PENDING_APPROVAL':
        return { label: 'Chờ phê duyệt', className: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'COMPLETED':
        return { label: 'Hoàn thành', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'REJECTED':
        return { label: 'Từ chối', className: 'bg-rose-50 text-rose-700 border-rose-200' };
      default:
        return { label: status, className: 'bg-gray-50 text-gray-700 border-gray-200' };
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-gray-500 flex flex-col items-center justify-center space-y-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span>Đang tải chi tiết hồ sơ TTHC...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-10 text-center bg-rose-50/50 space-y-4 max-w-xl mx-auto my-10 rounded-2xl border border-rose-200 shadow-sm">
        <div className="text-3xl">⚠️</div>
        <div className="space-y-1">
          <h3 className="font-bold text-rose-900 text-base">Không tìm thấy hoặc không thể tải chi tiết hồ sơ TTHC</h3>
          <p className="text-xs text-rose-800 leading-relaxed">{error || 'Hồ sơ không tồn tại, đã bị xóa hoặc máy chủ đang phản hồi chậm.'}</p>
        </div>
        <div className="flex justify-center gap-3 pt-2">
          <button onClick={fetchDetail} className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition shadow-sm">
            <span>🔄</span> Thử lại / Refresh
          </button>
          <button onClick={() => navigate('/procedure-cases')} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 transition shadow-sm">
            &larr; Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = formatStatusInfo(data.status);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start border-b pb-4">
        <div>
          <button onClick={() => navigate('/procedure-cases')} className="text-sm text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-1.5 font-semibold transition">
            <span>&larr;</span> Quay lại danh sách hồ sơ TTHC
          </button>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl font-bold font-mono text-gray-800">{data.caseCode}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.className}`}>
              {statusInfo.label}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-700 mt-1.5">
            {data.procedureType?.name} &bull; Lĩnh vực: <span className="font-semibold text-blue-700">{data.field === 'DAT_DAI' ? 'Đất đai' : data.field === 'XAY_DUNG' ? 'Xây dựng' : data.field}</span>
          </p>
        </div>
      </div>

      {/* 7 Tabs Navigation ordered according to UX-05 */}
      <div className="flex border-b gap-1 bg-gray-50 p-1 rounded-t-xl overflow-x-auto text-sm font-medium">
        {[
          { key: 'overview', label: '1. Thông tin hồ sơ' },
          { key: 'checklist', label: '2. Checklist & Dữ liệu' },
          { key: 'ai_review', label: '3. AI Rà soát & Căn cứ' },
          { key: 'documents', label: '4. Tài liệu đính kèm' },
          { key: 'financial', label: '5. Nghĩa vụ tài chính' },
          { key: 'notes', label: '6. Ghi chú thẩm định' },
          { key: 'audit_log', label: '7. Lịch sử Audit Log' },
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

        {/* TAB 4: DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-800">Danh sách tài liệu hồ sơ TTHC</h3>
            {(!data.documents || data.documents.length === 0) ? (
              <div className="p-12 text-center bg-slate-50/60 rounded-xl border border-dashed border-slate-200 my-4 space-y-2">
                <div className="text-3xl">📁</div>
                <h4 className="font-bold text-slate-800 text-sm">Chưa có tài liệu đính kèm cho hồ sơ này</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Hiện tại hồ sơ chưa có file scan/OCR tài liệu số hóa nào được tải lên. (Nghiệp vụ tải lên tài liệu đính kèm và kiểm tra OCR tự động sẽ được kích hoạt ở các phase tiếp theo).
                </p>
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
                      <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs font-semibold">
                        Xem file &rarr;
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* TAB 3: AI REVIEW */}
        {activeTab === 'ai_review' && (
          <div className="space-y-6">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-sm">
              <div className="flex items-center gap-2 font-bold text-amber-800 uppercase tracking-wide text-sm">
                <span>⚠️</span>
                <span>BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA</span>
              </div>
              <p className="text-xs text-amber-700 mt-1">
                AI hỗ trợ với vai trò trợ lý chuyên môn rà soát hồ sơ, không thay thế cán bộ thẩm định và tuyệt đối không kết luận hồ sơ đủ hay không đủ điều kiện theo nguyên tắc Human-in-the-Loop.
              </p>
            </div>

            {!(data?.procedureType?.code === 'LAND_FIRST_CERTIFICATE' || data?.procedureType?.group === 'CAP_GCN_LAN_DAU' || data?.procedureType?.code === 'LAND_USE_PURPOSE_CHANGE' || data?.procedureType?.group === 'CHUYEN_MUC_DICH_SDD') ? (
              <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed space-y-2">
                <div className="text-2xl">ℹ️</div>
                <p className="font-semibold text-gray-700 text-sm">
                  Chức năng rà soát AI hiện chỉ hỗ trợ thủ tục Cấp GCN lần đầu và Chuyển mục đích sử dụng đất.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* KHỐI 3.1: AI REVIEW - PHÂN TÍCH VÀ ĐÁNH GIÁ CHUYÊN MÔN */}
                <div className="border border-blue-200 bg-white rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-blue-100 pb-3">
                    <h5 className="font-bold text-blue-950 text-base flex items-center gap-2">
                      <span className="text-xl">Khối 3.1:</span> AI REVIEW – PHÂN TÍCH VÀ ĐÁNH GIÁ CHUYÊN MÔN
                    </h5>
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                      Nguyên tắc Human-in-the-Loop
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-blue-50/70 p-4 rounded-xl border border-blue-100">
                    <div>
                      <h4 className="font-bold text-blue-900 text-sm">
                        {data?.procedureType?.code === 'LAND_USE_PURPOSE_CHANGE' || data?.procedureType?.group === 'CHUYEN_MUC_DICH_SDD'
                          ? 'Trợ lý AI rà soát chuyển mục đích sử dụng đất'
                          : 'Trợ lý AI rà soát cấp GCN lần đầu'}
                      </h4>
                      <p className="text-xs text-blue-700 mt-0.5">
                        {data?.procedureType?.code === 'LAND_USE_PURPOSE_CHANGE' || data?.procedureType?.group === 'CHUYEN_MUC_DICH_SDD'
                          ? 'Phân tích thông tin chủ sử dụng đất, thửa đất, loại đất hiện tại và mục đích xin chuyển, đối chiếu quy hoạch/kế hoạch sử dụng đất.'
                          : 'Phân tích thông tin chủ sở hữu, thửa đất, nguồn gốc sử dụng đất và đối chiếu căn cứ pháp lý áp dụng.'}
                      </p>
                    </div>
                    {canAct && (
                      <div className="flex flex-col items-end gap-1">
                        <button
                          onClick={handleRunAiReview}
                          disabled={runningAi}
                          title="Kích hoạt trợ lý AI phân tích hồ sơ và đưa ra gợi ý rà soát chuyên môn (UX-03)"
                          className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 font-bold text-xs shadow flex items-center gap-2 transition"
                        >
                          {runningAi
                            ? '⏳ Đang phân tích...'
                            : data?.procedureType?.code === 'LAND_USE_PURPOSE_CHANGE' || data?.procedureType?.group === 'CHUYEN_MUC_DICH_SDD'
                            ? '🤖 Chạy AI rà soát chuyển mục đích'
                            : '🤖 Chạy AI rà soát cấp GCN lần đầu'}
                        </button>
                        <span className="text-[11px] text-gray-500 italic">Bấm để rà soát/cập nhật phiên bản mới</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* KHỐI 3.2: CĂN CỨ PHÁP LÝ ĐÃ SỬ DỤNG - LEGAL SNAPSHOT */}
                <div className="border border-amber-300 bg-amber-50/50 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                    <h5 className="font-bold text-amber-950 text-base flex items-center gap-2">
                      <span className="text-xl">Khối 3.2:</span> CĂN CỨ PHÁP LÝ ĐÃ SỬ DỤNG (LEGAL SNAPSHOT &amp; ACTIVE VERSION)
                    </h5>
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                      Active Version: v2.0-2024-LAND-LAW
                    </span>
                  </div>

                  {/* Mandatory Local Planning & Regulations Warning (LAW-02) */}
                  <div className="bg-amber-100 border-l-4 border-amber-600 p-4 rounded-r-xl text-amber-950 space-y-1.5 shadow-2xs">
                    <div className="font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 text-amber-950">
                      <span>⚠️</span> CẢNH BÁO BẮT BUỘC VỀ CĂN CỨ ĐỊA PHƯƠNG &amp; QUY HOẠCH/KẾ HOẠCH SỬ DỤNG ĐẤT (LAW-02):
                    </div>
                    <p className="text-xs leading-relaxed text-amber-950">
                      Căn cứ pháp lý hiển thị bên dưới là phiên bản dữ liệu văn bản trung ương và quy định chung tại thời điểm hệ thống ghi nhận. <strong>Cán bộ thụ lý có trách nhiệm kiểm tra, đối chiếu bắt buộc với:</strong> (1) Quy trình nội bộ giải quyết TTHC và các Quyết định/Quy định riêng do UBND tỉnh/thành phố ban hành đang có hiệu lực tại địa phương; (2) Quy hoạch sử dụng đất cấp huyện, Kế hoạch sử dụng đất hàng năm đã được cơ quan có thẩm quyền phê duyệt; (3) Quy hoạch chi tiết xây dựng (nếu có) tại vị trí thửa đất trước khi tham mưu, trình ký hoặc ban hành kết quả chính thức.
                    </p>
                  </div>

                  {snapshotError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-semibold flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">❌</span>
                        <span>{snapshotError}</span>
                      </div>
                      <button onClick={fetchDetail} className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded font-semibold text-[11px] transition">
                        Thử lại
                      </button>
                    </div>
                  )}

                  {(() => {
                    if (aiAnalyses.length === 0) {
                      return (
                        <div className="bg-white p-4 rounded-xl border border-amber-200 text-gray-700 text-xs flex items-center gap-2.5 shadow-2xs">
                          <span className="text-base">ℹ️</span>
                          <span>Chưa có kết quả AI để xác định legal snapshot. Sau khi chạy AI review ở Khối 3.1, hệ thống sẽ hiển thị chính xác bộ phiên bản căn cứ pháp lý đã áp dụng.</span>
                        </div>
                      );
                    }

                    const analysisWithSnapshot = aiAnalyses.find(a => a.legalSnapshot) || aiAnalyses[0];
                    const snapshot = analysisWithSnapshot?.legalSnapshot;
                    const payload = (analysisWithSnapshot?.outputPayload || {}) as any;
                    const meta = payload?.legalKnowledgeMetadata;

                    if (!snapshot) {
                      return (
                        <div className="space-y-3">
                          <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 shadow-2xs">
                            <span className="text-base">⚠️</span>
                            <span>Chưa tìm thấy legal snapshot gắn với kết quả AI này. Cán bộ cần rà soát căn cứ pháp lý thủ công theo quy định hiện hành.</span>
                          </div>

                          {meta && (
                            <div className="bg-amber-100/60 border border-amber-300 p-3.5 rounded-xl text-xs space-y-2.5 text-amber-950">
                              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                                <span>⚠️</span> Căn cứ gợi ý từ metadata AI (chưa lưu thành snapshot chính thức):
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-white/80 p-2.5 rounded-lg border border-amber-200">
                                <div>
                                  <span className="text-gray-500 block text-[10px]">Knowledge Base</span>
                                  <span className="font-semibold text-amber-900">{meta.knowledgeBaseVersion || 'N/A'}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 block text-[10px]">Procedure Version</span>
                                  <span className="font-semibold text-amber-900">{meta.procedureTypeVersion || 'N/A'}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 block text-[10px]">Prompt Version</span>
                                  <span className="font-semibold text-amber-900">{meta.promptVersion || 'N/A'}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 block text-[10px]">Checklist Version</span>
                                  <span className="font-semibold text-amber-900">{meta.checklistVersion || 'N/A'}</span>
                                </div>
                              </div>
                              {Array.isArray(meta.legalDocumentCodes) && meta.legalDocumentCodes.length > 0 && (
                                <div>
                                  <span className="font-semibold text-gray-700 block mb-1">Văn bản gợi ý từ metadata:</span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {meta.legalDocumentCodes.map((doc: string, idx: number) => (
                                      <span key={idx} className="bg-white border border-amber-300 text-amber-950 px-2 py-0.5 rounded font-semibold text-[11px]">
                                        {doc}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    }

                    const kbVer = snapshot.knowledgeBaseVersion || 'N/A';
                    const procVer = snapshot.procedureTypeVersion?.version || snapshot.procedureTypeVersion?.code || 'N/A';
                    const promptVer = snapshot.promptVersion?.version || snapshot.promptVersion?.key || 'N/A';
                    const chkVer = snapshot.checklistVersion?.version || snapshot.checklistVersion?.key || 'N/A';
                    const docList = Array.isArray(snapshot.legalDocumentIds) && snapshot.legalDocumentIds.length > 0
                      ? snapshot.legalDocumentIds
                      : Array.isArray((snapshot as any).snapshotJson?.legalDocuments) && (snapshot as any).snapshotJson.legalDocuments.length > 0
                      ? (snapshot as any).snapshotJson.legalDocuments.map((d: any) => d.code || d.name || d.id)
                      : [];

                    return (
                      <div className="space-y-3.5 text-xs text-gray-800">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 bg-white p-3.5 rounded-xl border border-amber-200 shadow-2xs">
                          <div>
                            <span className="text-gray-500 block text-[11px]">Knowledge Base</span>
                            <span className="font-bold text-amber-900 text-sm">{kbVer}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-[11px]">Procedure Version</span>
                            <span className="font-bold text-amber-900 text-sm">{procVer}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-[11px]">Prompt Version</span>
                            <span className="font-bold text-amber-900 text-sm">{promptVer}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-[11px]">Checklist Version</span>
                            <span className="font-bold text-amber-900 text-sm">{chkVer}</span>
                          </div>
                        </div>

                        {docList.length > 0 ? (
                          <div>
                            <span className="font-bold text-gray-800 block mb-1.5">Danh mục văn bản pháp luật áp dụng trong phiên bản Legal Snapshot này:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {docList.map((doc: string, idx: number) => (
                                <span key={idx} className="bg-amber-100/90 border border-amber-400 text-amber-950 px-3 py-1 rounded-lg font-bold text-xs shadow-2xs">
                                  ⚖️ {doc}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-500 italic">Không có danh mục văn bản cụ thể trong snapshot này.</div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* KHỐI 3.3: DỰ THẢO / IN / XUẤT VĂN BẢN - EXPORT SAFETY */}
                <div className="border border-indigo-200 bg-indigo-50/40 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-indigo-200/60 pb-3">
                    <h5 className="font-bold text-indigo-950 text-base flex items-center gap-2">
                      <span className="text-xl">Khối 3.3:</span> DỰ THẢO / IN / XUẤT VĂN BẢN (EXPORT SAFETY)
                    </h5>
                    <span className="text-xs font-semibold text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-300">
                      Chuẩn văn phong hành chính
                    </span>
                  </div>

                  {/* Mandatory AI Safety Warnings (AI-01 / AI-04) */}
                  <div className="bg-amber-100/80 border border-amber-400 p-3.5 rounded-xl text-amber-950 space-y-1.5 shadow-2xs">
                    <div className="font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 text-amber-950">
                      <span>⚠️</span> BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA &amp; CHỊU TRÁCH NHIỆM TRƯỚC KHI BAN HÀNH:
                    </div>
                    <p className="text-xs text-amber-950 leading-relaxed">
                      Văn bản dự thảo, phiếu rà soát, và các tài liệu xuất Word/PDF do hệ thống tạo tự động dựa trên kết quả phân tích AI chỉ mang tính chất tham mưu chuyên môn sơ bộ. <strong>Cán bộ có thẩm quyền phải kiểm tra, đối chiếu thực tế hồ sơ, chỉnh sửa văn phong, ký số/ký tay và ban hành theo đúng thẩm quyền quy định của pháp luật.</strong>
                    </p>
                  </div>

                  {/* Conditional Content based on Permission and AI Results */}
                  {!canAct ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 shadow-2xs">
                      <span className="text-base">🚫</span>
                      <span>Bạn không có quyền xem trước/in/xuất văn bản này. Vui lòng liên hệ lãnh đạo hoặc quản trị hệ thống.</span>
                    </div>
                  ) : aiAnalyses.length === 0 ? (
                    <div className="bg-white p-4 rounded-xl border border-indigo-100 text-gray-600 text-xs flex items-center gap-2.5 shadow-2xs">
                      <span className="text-base">ℹ️</span>
                      <span>Chưa có kết quả rà soát AI để tạo bản dự thảo hoặc xuất văn bản. Vui lòng chạy rà soát AI ở Khối 3.1 trước.</span>
                    </div>
                  ) : (
                    <div className="bg-white p-4 rounded-xl border border-indigo-100 space-y-3 shadow-2xs">
                      <div className="text-xs text-slate-600 font-medium">
                        Chọn hành động cho bản rà soát mới nhất (<span className="font-semibold text-slate-800">#{aiAnalyses[0].id.slice(0, 8)}</span>):
                      </div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        {aiAnalyses[0].analysisType === 'LAND_FIRST_CERTIFICATE_REVIEW' ? (
                          <>
                            <button
                              onClick={() => handlePreviewReviewPdf(aiAnalyses[0].id)}
                              disabled={previewingAnalysisId === aiAnalyses[0].id || exportingAnalysisId === aiAnalyses[0].id}
                              title="Xem trước bản dự thảo phiếu rà soát trên màn hình (UX-03)"
                              className="inline-flex items-center px-3.5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-sm transition disabled:opacity-50"
                            >
                              <Printer className="w-3.5 h-3.5 mr-1.5" />
                              {previewingAnalysisId === aiAnalyses[0].id ? 'Đang mở...' : 'Xem bản dự thảo'}
                            </button>
                            <button
                              onClick={() => handlePreviewReviewPdf(aiAnalyses[0].id)}
                              disabled={previewingAnalysisId === aiAnalyses[0].id || exportingAnalysisId === aiAnalyses[0].id}
                              title="In phiếu gợi ý AI để tham khảo trong cuộc họp hoặc lưu hồ sơ giấy (UX-03)"
                              className="inline-flex items-center px-3.5 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-semibold hover:bg-indigo-100 shadow-sm transition disabled:opacity-50"
                            >
                              <Printer className="w-3.5 h-3.5 mr-1.5" />
                              {previewingAnalysisId === aiAnalyses[0].id ? 'Đang mở...' : 'In bản gợi ý AI'}
                            </button>
                            <button
                              onClick={() => handleExportReviewDocx(aiAnalyses[0].id)}
                              disabled={exportingAnalysisId === aiAnalyses[0].id || previewingAnalysisId === aiAnalyses[0].id}
                              title="Tải về file Microsoft Word (.docx) để cán bộ trực tiếp chỉnh sửa văn bản trước khi ký trình (UX-03)"
                              className="inline-flex items-center px-3.5 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 shadow-sm transition disabled:opacity-50"
                            >
                              <Download className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                              {exportingAnalysisId === aiAnalyses[0].id ? 'Đang tải...' : 'Xuất Word (.docx)'}
                            </button>
                            <button
                              onClick={() => handlePreviewReviewPdf(aiAnalyses[0].id)}
                              disabled={previewingAnalysisId === aiAnalyses[0].id || exportingAnalysisId === aiAnalyses[0].id}
                              title="Tải về file PDF định dạng chuẩn để in ấn hoặc lưu trữ (UX-03)"
                              className="inline-flex items-center px-3.5 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 shadow-sm transition disabled:opacity-50"
                            >
                              <Printer className="w-3.5 h-3.5 mr-1.5 text-red-600" />
                              {previewingAnalysisId === aiAnalyses[0].id ? 'Đang mở...' : 'Xuất PDF'}
                            </button>
                          </>
                        ) : aiAnalyses[0].analysisType === 'LAND_USE_PURPOSE_CHANGE_REVIEW' ? (
                          <>
                            <button
                              onClick={() => handlePreviewPurposeChangeReviewPdf(aiAnalyses[0].id)}
                              disabled={previewingAnalysisId === aiAnalyses[0].id || exportingAnalysisId === aiAnalyses[0].id}
                              title="Xem trước bản dự thảo rà soát chuyển mục đích trên màn hình (UX-03)"
                              className="inline-flex items-center px-3.5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-sm transition disabled:opacity-50"
                            >
                              <Printer className="w-3.5 h-3.5 mr-1.5" />
                              {previewingAnalysisId === aiAnalyses[0].id ? 'Đang mở...' : 'Xem bản dự thảo'}
                            </button>
                            <button
                              onClick={() => handlePreviewPurposeChangeReviewPdf(aiAnalyses[0].id)}
                              disabled={previewingAnalysisId === aiAnalyses[0].id || exportingAnalysisId === aiAnalyses[0].id}
                              title="In phiếu rà soát chuyển mục đích sử dụng đất (UX-03)"
                              className="inline-flex items-center px-3.5 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-semibold hover:bg-indigo-100 shadow-sm transition disabled:opacity-50"
                            >
                              <Printer className="w-3.5 h-3.5 mr-1.5" />
                              {previewingAnalysisId === aiAnalyses[0].id ? 'Đang mở...' : 'In bản gợi ý AI'}
                            </button>
                            <button
                              onClick={() => handleExportPurposeChangeReviewDocx(aiAnalyses[0].id)}
                              disabled={exportingAnalysisId === aiAnalyses[0].id || previewingAnalysisId === aiAnalyses[0].id}
                              title="Tải về file Microsoft Word (.docx) rà soát chuyển mục đích để chỉnh sửa (UX-03)"
                              className="inline-flex items-center px-3.5 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 shadow-sm transition disabled:opacity-50"
                            >
                              <Download className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                              {exportingAnalysisId === aiAnalyses[0].id ? 'Đang tải...' : 'Xuất Word (.docx)'}
                            </button>
                            <button
                              onClick={() => handlePreviewPurposeChangeReviewPdf(aiAnalyses[0].id)}
                              disabled={previewingAnalysisId === aiAnalyses[0].id || exportingAnalysisId === aiAnalyses[0].id}
                              title="Tải về file PDF định dạng chuẩn (UX-03)"
                              className="inline-flex items-center px-3.5 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 shadow-sm transition disabled:opacity-50"
                            >
                              <Printer className="w-3.5 h-3.5 mr-1.5 text-red-600" />
                              {previewingAnalysisId === aiAnalyses[0].id ? 'Đang mở...' : 'Xuất PDF'}
                            </button>
                          </>
                        ) : (
                          <div className="text-xs text-slate-500 italic flex items-center gap-1.5">
                            <span>ℹ️</span>
                            <span>Loại phân tích này hiện hỗ trợ Xem bản dự thảo và Xuất Word trong các tính năng chuyên sâu.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* KHỐI 3.1 (Tiếp theo): CHI TIẾT CÁC BẢN RÀ SOÁT AI */}
                <div className="space-y-4 pt-2">
                  <h4 className="font-bold text-gray-800 text-base border-b pb-2">Lịch sử &amp; Chi tiết kết quả rà soát AI ({aiAnalyses.length})</h4>
                  {aiAnalyses.length === 0 && !runningAi && (
                    <div className="p-12 text-center bg-slate-50/60 rounded-xl border border-dashed border-slate-200 space-y-2">
                      <div className="text-3xl text-slate-400">📄</div>
                      <h5 className="font-bold text-slate-800 text-sm">Chưa có kết quả rà soát AI nào cho hồ sơ này</h5>
                      <p className="text-xs text-slate-600 max-w-md mx-auto">
                        Bấm nút &quot;Chạy AI rà soát&quot; ở Khối 3.1 phía trên để trợ lý chuyên môn bắt đầu phân tích dữ liệu thửa đất và đối chiếu quy định pháp lý.
                      </p>
                    </div>
                  )}
                </div>

                {aiAnalyses.map((analysis) => {
                  const payload = (analysis.outputPayload || {}) as any;
                  const isPending = analysis.status === 'PENDING';
                  return (
                    <div key={analysis.id} className="border rounded-2xl bg-white shadow-sm overflow-hidden space-y-6 p-6">
                      {/* Header */}
                      <div className="flex justify-between items-start border-b pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 text-base">Kết quả Phân tích Trợ lý AI</span>
                            <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                              analysis.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                              analysis.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {analysis.status === 'ACCEPTED' ? 'Đã chấp nhận' :
                               analysis.status === 'REJECTED' ? 'Đã từ chối' : 'Chờ kiểm tra'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Mức độ tin cậy: <span className="font-semibold">{analysis.confidenceLevel || 'MEDIUM'}</span> &bull; Thời gian: {new Date(analysis.createdAt).toLocaleString('vi-VN')}
                          </p>
                        </div>
                      </div>

                      {/* Warning Banner */}
                      <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-900 p-3.5 rounded-r text-xs flex items-start gap-2.5">
                        <span className="text-base">⚠️</span>
                        <div>
                          <span className="font-bold">{AI_REVIEW_WARNING}. CÁN BỘ PHẢI KIỂM TRA, CHỈNH SỬA VÀ CHỊU TRÁCH NHIỆM TRƯỚC KHI ÁP DỤNG HOẶC BAN HÀNH.</span>
                          <p className="mt-0.5 text-amber-800">Kết quả phân tích từ AI chỉ mang tính chất gợi ý chuyên môn, không thay thế việc kiểm tra hồ sơ bản gốc và văn bản pháp luật hiện hành.</p>
                        </div>
                      </div>

                      {/* A. Tóm tắt hồ sơ */}
                      <div className="bg-slate-50 p-4 rounded-xl border space-y-1">
                        <h5 className="font-bold text-gray-800 text-sm">A. Tóm tắt thông tin hồ sơ</h5>
                        <p className="text-sm text-gray-700">{payload.summary || 'Không có tóm tắt'}</p>
                        <p className="text-xs text-gray-500">Loại thủ tục: {payload.procedureType}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* B. Thông tin người sử dụng đất */}
                        <div className="border rounded-xl p-4 bg-white space-y-2">
                          <h5 className="font-bold text-blue-900 text-sm flex items-center gap-1.5">
                            <span>👤</span> B. Nhận diện Người sử dụng đất
                          </h5>
                          <div className="text-xs space-y-1 text-gray-700">
                            <p><span className="font-semibold">Họ tên/Chủ thể:</span> {payload.applicantReview?.applicantName || 'Chưa rõ'}</p>
                            <p><span className="font-semibold">Tình trạng nhân thân:</span> {payload.applicantReview?.identityInfoStatus}</p>
                            <p><span className="font-semibold">Địa chỉ liên hệ:</span> {payload.applicantReview?.addressStatus}</p>
                          </div>
                          {payload.applicantReview?.issuesToVerify?.length > 0 && (
                            <div className="mt-2 pt-2 border-t text-xs">
                              <span className="font-semibold text-amber-700 block mb-1">Nội dung cần cán bộ kiểm tra:</span>
                              <ul className="list-disc pl-4 space-y-0.5 text-gray-600">
                                {payload.applicantReview.issuesToVerify.map((item: string, idx: number) => (
                                  <li key={idx}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* C. Thông tin thửa đất */}
                        <div className="border rounded-xl p-4 bg-white space-y-2">
                          <h5 className="font-bold text-blue-900 text-sm flex items-center gap-1.5">
                            <span>🗺️</span> C. Nhận diện Thửa đất
                          </h5>
                          <div className="text-xs space-y-1 text-gray-700">
                            <p><span className="font-semibold">Số thửa / Tờ bản đồ:</span> Thửa {payload.landParcelReview?.parcelNumber} / Tờ số {payload.landParcelReview?.mapSheetNumber}</p>
                            <p><span className="font-semibold">Vị trí:</span> {payload.landParcelReview?.location}</p>
                            {analysis.analysisType === 'LAND_USE_PURPOSE_CHANGE_REVIEW' ? (
                              <>
                                <p><span className="font-semibold">Diện tích toàn thửa:</span> {payload.landParcelReview?.totalArea || payload.landParcelReview?.area}</p>
                                <p><span className="font-semibold">Diện tích xin chuyển:</span> <span className="text-indigo-600 font-bold">{payload.landParcelReview?.requestedChangeArea || payload.purposeChangeReview?.requestedArea}</span></p>
                                <p><span className="font-semibold">Loại đất hiện tại:</span> {payload.landParcelReview?.currentLandUseType || payload.purposeChangeReview?.currentPurpose}</p>
                                <p><span className="font-semibold">Mục đích xin chuyển sang:</span> <span className="text-emerald-700 font-bold">{payload.landParcelReview?.requestedLandUseType || payload.purposeChangeReview?.requestedPurpose}</span></p>
                              </>
                            ) : (
                              <p><span className="font-semibold">Diện tích / Loại đất:</span> {payload.landParcelReview?.area} &bull; {payload.landParcelReview?.landUseType}</p>
                            )}
                            <p><span className="font-semibold">Ranh giới:</span> {payload.landParcelReview?.boundaryStatus}</p>
                          </div>
                          {payload.landParcelReview?.issuesToVerify?.length > 0 && (
                            <div className="mt-2 pt-2 border-t text-xs">
                              <span className="font-semibold text-amber-700 block mb-1">Điểm cần đối chiếu thực địa:</span>
                              <ul className="list-disc pl-4 space-y-0.5 text-gray-600">
                                {payload.landParcelReview.issuesToVerify.map((item: string, idx: number) => (
                                  <li key={idx}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* D. Nguồn gốc & Thời điểm OR Mục đích xin chuyển */}
                      {analysis.analysisType === 'LAND_USE_PURPOSE_CHANGE_REVIEW' ? (
                        <div className="border border-indigo-200 bg-indigo-50/40 rounded-xl p-4 space-y-2">
                          <h5 className="font-bold text-indigo-900 text-sm flex items-center gap-1.5">
                            <span>🔄</span> D. Phân tích Mục đích xin chuyển &amp; Điều kiện chuyển mục đích
                          </h5>
                          <div className="text-xs space-y-1 text-gray-800">
                            <p><span className="font-semibold">Loại đất hiện tại:</span> {payload.purposeChangeReview?.currentPurpose}</p>
                            <p><span className="font-semibold">Mục đích xin chuyển sang:</span> <span className="text-emerald-700 font-bold">{payload.purposeChangeReview?.requestedPurpose}</span></p>
                            <p><span className="font-semibold">Diện tích xin chuyển:</span> {payload.purposeChangeReview?.requestedArea}</p>
                          </div>
                          {payload.purposeChangeReview?.riskFlags?.length > 0 && (
                            <div className="text-xs bg-rose-50 border border-rose-200 p-2.5 rounded-lg text-rose-800 space-y-1">
                              <span className="font-semibold block">⚠️ Cảnh báo rủi ro chuyển mục đích:</span>
                              <ul className="list-disc pl-4 space-y-0.5">
                                {payload.purposeChangeReview.riskFlags.map((risk: string, idx: number) => (
                                  <li key={idx}>{risk}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {payload.purposeChangeReview?.eligibilityIssuesToVerify?.length > 0 && (
                            <div className="text-xs pt-1">
                              <span className="font-semibold text-gray-800 block mb-1">Kiểm tra điều kiện chuyển mục đích (Điều 116, 121 Luật Đất đai 2024):</span>
                              <ul className="list-disc pl-4 space-y-0.5 text-gray-700">
                                {payload.purposeChangeReview.eligibilityIssuesToVerify.map((item: string, idx: number) => (
                                  <li key={idx}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {payload.purposeChangeReview?.planningNeedCheck?.length > 0 && (
                            <div className="text-xs pt-1 border-t border-indigo-100">
                              <span className="font-semibold text-indigo-900 block mb-1">Kiểm tra quy hoạch / Kế hoạch sử dụng đất:</span>
                              <ul className="list-disc pl-4 space-y-0.5 text-indigo-800">
                                {payload.purposeChangeReview.planningNeedCheck.map((item: string, idx: number) => (
                                  <li key={idx}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="border border-amber-200 bg-amber-50/40 rounded-xl p-4 space-y-2">
                          <h5 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                            <span>📜</span> D. Phân tích Nguồn gốc & Thời điểm sử dụng đất
                          </h5>
                          <div className="text-xs space-y-1 text-gray-800">
                            <p><span className="font-semibold">Nguồn gốc kê khai:</span> {payload.originAndUseHistoryReview?.declaredOrigin}</p>
                            <p><span className="font-semibold">Thời điểm sử dụng:</span> {payload.originAndUseHistoryReview?.declaredUseStartTime}</p>
                          </div>
                          {payload.originAndUseHistoryReview?.riskFlags?.length > 0 && (
                            <div className="text-xs bg-rose-50 border border-rose-200 p-2.5 rounded-lg text-rose-800 space-y-1">
                              <span className="font-semibold block">⚠️ Cảnh báo rủi ro lịch sử sử dụng:</span>
                              <ul className="list-disc pl-4 space-y-0.5">
                                {payload.originAndUseHistoryReview.riskFlags.map((risk: string, idx: number) => (
                                  <li key={idx}>{risk}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {payload.originAndUseHistoryReview?.issuesToVerify?.length > 0 && (
                            <div className="text-xs pt-1">
                              <span className="font-semibold text-gray-800 block mb-1">Nội dung cán bộ cần thẩm tra/bổ sung căn cứ:</span>
                              <ul className="list-disc pl-4 space-y-0.5 text-gray-700">
                                {payload.originAndUseHistoryReview.issuesToVerify.map((item: string, idx: number) => (
                                  <li key={idx}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* E. Thành phần hồ sơ */}
                      <div className="border rounded-xl p-4 bg-white space-y-3">
                        <h5 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                          <span>📁</span> E. Kiểm tra Thành phần hồ sơ
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                          <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                            <span className="font-bold text-emerald-800 block mb-1">Tài liệu đã đính kèm</span>
                            <ul className="list-disc pl-4 space-y-1 text-emerald-700">
                              {(payload.documentCompletenessReview?.detectedDocuments || []).map((doc: string, idx: number) => (
                                <li key={idx}>{doc}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                            <span className="font-bold text-amber-800 block mb-1">Tài liệu thiếu / Cần đối chiếu</span>
                            <ul className="list-disc pl-4 space-y-1 text-amber-700">
                              {(payload.documentCompletenessReview?.missingOrNeedCheckDocuments || []).map((doc: string, idx: number) => (
                                <li key={idx}>{doc}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <span className="font-bold text-blue-800 block mb-1">Đề xuất yêu cầu bổ sung</span>
                            <ul className="list-disc pl-4 space-y-1 text-blue-700">
                              {(payload.documentCompletenessReview?.recommendSupplementDocuments || []).map((doc: string, idx: number) => (
                                <li key={idx}>{doc}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* F. Quy hoạch, tranh chấp & hiện trạng */}
                      <div className="border rounded-xl p-4 bg-white space-y-2">
                        <h5 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                          <span>🔍</span> F. Kiểm tra Hiện trạng, Quy hoạch & Nghĩa vụ tài chính
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="font-semibold text-gray-800 block">Quy hoạch & Tranh chấp cần rà soát:</span>
                            <ul className="list-disc pl-4 mt-1 space-y-0.5 text-gray-600">
                              {(payload.planningDisputeAndCurrentStatusReview?.planningNeedCheck || payload.planningAndCurrentStatusReview?.planningNeedCheck || []).map((item: string, idx: number) => (
                                <li key={`p-${idx}`}>{item}</li>
                              ))}
                              {(payload.planningDisputeAndCurrentStatusReview?.disputeNeedCheck || payload.planningAndCurrentStatusReview?.disputeNeedCheck || []).map((item: string, idx: number) => (
                                <li key={`d-${idx}`}>{item}</li>
                              ))}
                              {(payload.planningAndCurrentStatusReview?.boundaryAreaNeedCheck || []).map((item: string, idx: number) => (
                                <li key={`b-${idx}`}>{item}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800 block">Hiện trạng sử dụng & Nghĩa vụ tài chính:</span>
                            <ul className="list-disc pl-4 mt-1 space-y-0.5 text-gray-600">
                              {(payload.planningDisputeAndCurrentStatusReview?.currentUseNeedCheck || payload.planningAndCurrentStatusReview?.currentUseNeedCheck || []).map((item: string, idx: number) => (
                                <li key={`c-${idx}`}>{item}</li>
                              ))}
                              <li><span className="font-semibold text-indigo-700">Ghi chú tài chính:</span> {payload.financialObligationNotice?.message}</li>
                              {payload.financialObligationNotice?.dataNeededForLaterPhase?.length > 0 && (
                                <li className="pt-1">
                                  <span className="font-semibold text-slate-700 block">Các khoản/dữ liệu cần chuẩn bị cho bước tính tiền sau này:</span>
                                  <ul className="list-disc pl-4 mt-0.5 space-y-0.5 text-slate-600">
                                    {payload.financialObligationNotice.dataNeededForLaterPhase.map((item: string, idx: number) => (
                                      <li key={idx}>{item}</li>
                                    ))}
                                  </ul>
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* G. Khuyến nghị & Căn cứ */}
                      <div className="border border-indigo-100 bg-indigo-50/30 rounded-xl p-4 space-y-3">
                        <h5 className="font-bold text-indigo-900 text-sm flex items-center gap-1.5">
                          <span>💡</span> G. Khuyến nghị Chuyên môn & Gợi ý bước xử lý
                        </h5>
                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="font-bold text-indigo-800 block mb-1">Khuyến nghị hướng giải quyết cho cán bộ:</span>
                            <ul className="list-disc pl-4 space-y-1 text-gray-700">
                              {(payload.recommendations || []).map((rec: string, idx: number) => (
                                <li key={idx}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="font-bold text-indigo-800 block mb-1">Gợi ý câu hỏi yêu cầu người dân giải trình/bổ sung:</span>
                            <ul className="list-disc pl-4 space-y-1 text-gray-700">
                              {(payload.recommendedNextQuestions || []).map((q: string, idx: number) => (
                                <li key={idx}>{q}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="font-bold text-indigo-800 block mb-1">Căn cứ pháp lý áp dụng rà soát:</span>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {(payload.legalBasisToCheck || []).map((law: string, idx: number) => (
                                <span key={idx} className="bg-white border px-2 py-0.5 rounded text-gray-700 font-medium">{law}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Export & Review Actions */}
                      {canAct && (
                        <div className="pt-4 border-t flex flex-wrap items-center justify-between gap-2 bg-gray-50 -mx-6 -mb-6 p-4">
                          {analysis.analysisType === 'LAND_FIRST_CERTIFICATE_REVIEW' ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                onClick={() => handleExportReviewDocx(analysis.id)}
                                disabled={exportingAnalysisId === analysis.id || previewingAnalysisId === analysis.id}
                                className="inline-flex items-center px-3.5 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 shadow-sm transition disabled:opacity-50"
                              >
                                <Download className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                                {exportingAnalysisId === analysis.id ? 'Đang tải...' : 'Tải phiếu rà soát Word'}
                              </button>
                              <button
                                onClick={() => handlePreviewReviewPdf(analysis.id)}
                                disabled={previewingAnalysisId === analysis.id || exportingAnalysisId === analysis.id}
                                className="inline-flex items-center px-3.5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-sm transition disabled:opacity-50"
                              >
                                <Printer className="w-3.5 h-3.5 mr-1.5" />
                                {previewingAnalysisId === analysis.id ? 'Đang mở...' : 'Xem/In phiếu rà soát PDF'}
                              </button>
                            </div>
                          ) : analysis.analysisType === 'LAND_USE_PURPOSE_CHANGE_REVIEW' ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                onClick={() => handleExportPurposeChangeReviewDocx(analysis.id)}
                                disabled={exportingAnalysisId === analysis.id || previewingAnalysisId === analysis.id}
                                className="inline-flex items-center px-3.5 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 shadow-sm transition disabled:opacity-50"
                              >
                                <Download className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                                {exportingAnalysisId === analysis.id ? 'Đang tải...' : 'Tải phiếu rà soát Word'}
                              </button>
                              <button
                                onClick={() => handlePreviewPurposeChangeReviewPdf(analysis.id)}
                                disabled={previewingAnalysisId === analysis.id || exportingAnalysisId === analysis.id}
                                className="inline-flex items-center px-3.5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-sm transition disabled:opacity-50"
                              >
                                <Printer className="w-3.5 h-3.5 mr-1.5" />
                                {previewingAnalysisId === analysis.id ? 'Đang mở...' : 'Xem/In phiếu rà soát PDF'}
                              </button>
                            </div>
                          ) : (
                            <div className="text-xs text-slate-500 italic flex items-center gap-1.5">
                              <span>ℹ️</span>
                              <span>Tính năng xuất Word/PDF sẽ được hỗ trợ trong phase sau.</span>
                            </div>
                          )}

                          {isPending && (
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                onClick={() => handleAcceptAiAnalysis(analysis.id, true, false)}
                                className="px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 shadow-sm transition"
                              >
                                ✅ Chấp nhận &amp; Lưu ý kiến vào Ghi chú
                              </button>
                              <button
                                onClick={() => handleAcceptAiAnalysis(analysis.id, false, true)}
                                className="px-3.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 shadow-sm transition"
                              >
                                📋 Chấp nhận &amp; Tạo checklist gợi ý
                              </button>
                              <button
                                onClick={() => handleAcceptAiAnalysis(analysis.id, true, true)}
                                className="px-3.5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-sm transition"
                              >
                                ⚡ Chấp nhận cả hai (Ghi chú + Checklist)
                              </button>
                              <button
                                onClick={() => handleRejectAiAnalysis(analysis.id)}
                                className="px-3.5 py-2 bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold hover:bg-rose-200 transition ml-2"
                              >
                                ❌ Từ chối
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="space-y-6 text-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-gray-800">Checklist thẩm định thành phần hồ sơ</h3>
            </div>

            {canAct && (
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
            )}

            {(!data.checklistItems || data.checklistItems.length === 0) ? (
              <div className="p-12 text-center bg-slate-50/60 rounded-xl border border-dashed border-slate-200 my-4 space-y-2">
                <div className="text-3xl">📋</div>
                <h4 className="font-bold text-slate-800 text-sm">Chưa có mục checklist kiểm tra nào</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Danh sách kiểm tra thành phần hồ sơ và điều kiện thẩm định hiện đang trống. Cán bộ có thể nhập tên nhóm và tiêu chí vào ô phía trên hoặc bấm nút bên tab AI Rà soát để tự động tạo checklist gợi ý.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {data.checklistItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => canAct && handleToggleChecklist(item)}
                    className={`p-3 rounded-xl border flex items-center justify-between transition ${
                      item.isCompleted ? 'bg-green-50/60 border-green-200' : 'bg-white hover:bg-gray-50 border-gray-200'
                    } ${canAct ? 'cursor-pointer' : 'cursor-default'}`}
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

        {/* TAB 5: FINANCIAL OBLIGATIONS (Phase 12D UI Implementation) */}
        {activeTab === 'financial' && (
          <FinancialObligationPanel caseId={caseId} canAct={canAct} userRole={role} />
        )}

        {/* TAB 6: NOTES */}
        {activeTab === 'notes' && (
          <div className="space-y-6 text-sm">
            {canAct && (
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
            )}

            {(!data.procedureNotes || data.procedureNotes.length === 0) ? (
              <div className="p-12 text-center bg-slate-50/60 rounded-xl border border-dashed border-slate-200 my-4 space-y-2">
                <div className="text-3xl">💬</div>
                <h4 className="font-bold text-slate-800 text-sm">Chưa có ý kiến trao đổi hay ghi chú thẩm định nào</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Nhật ký trao đổi nội bộ giữa cán bộ tiếp nhận và cán bộ thẩm định hiện đang trống. Sử dụng khung nhập phía trên để ghi chép các ý kiến hoặc lưu ý xử lý hồ sơ.
                </p>
              </div>
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
              <div className="p-12 text-center bg-slate-50/60 rounded-xl border border-dashed border-slate-200 my-4 space-y-2">
                <div className="text-3xl">🔍</div>
                <h4 className="font-bold text-slate-800 text-sm">Chưa có bản ghi nhật ký kiểm toán (Audit Log)</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Hệ thống sẽ tự động lưu lại lịch sử mọi thao tác thay đổi trạng thái, rà soát AI, bổ sung tài liệu và phê duyệt của từng cán bộ để đảm bảo minh bạch, truy vết.
                </p>
              </div>
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

      <ProcedureReviewPrintModal
        isOpen={reviewPreviewModalOpen}
        onClose={() => setReviewPreviewModalOpen(false)}
        previewData={reviewPreviewData}
        onDownloadWord={() => {
          if (activeAnalysisIdForModal) {
            handleExportReviewDocx(activeAnalysisIdForModal);
          }
        }}
      />

      <PurposeChangeReviewPrintModal
        isOpen={purposeChangeReviewModalOpen}
        onClose={() => setPurposeChangeReviewModalOpen(false)}
        previewData={reviewPreviewData}
        onDownloadWord={() => {
          if (activeAnalysisIdForModal) {
            handleExportPurposeChangeReviewDocx(activeAnalysisIdForModal);
          }
        }}
      />
    </div>
  );
}
