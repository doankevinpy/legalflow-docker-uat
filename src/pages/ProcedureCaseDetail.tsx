import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { procedureCasesApi } from '../lib/procedureCasesApi';
import type { ProcedureCase, ProcedureChecklistItem, ProcedureAiAnalysis } from '../types/procedure';
import { ApiError } from '../lib/apiClient';
import { Printer, Download } from 'lucide-react';
import { ProcedureReviewPrintModal } from '../components/ProcedureReviewPrintModal';
import { PurposeChangeReviewPrintModal } from '../components/PurposeChangeReviewPrintModal';

export default function ProcedureCaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const caseId = id || '';

  const [data, setData] = useState<ProcedureCase | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'documents' | 'ai_review' | 'checklist' | 'financial' | 'notes' | 'audit_log'
  >('overview');

  // AI Review State
  const [aiAnalyses, setAiAnalyses] = useState<ProcedureAiAnalysis[]>([]);
  const [runningAi, setRunningAi] = useState<boolean>(false);

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
    try {
      const res = await procedureCasesApi.getCase(caseId);
      setData(res);
      try {
        const aiRes = await procedureCasesApi.getAiAnalyses(caseId);
        setAiAnalyses(aiRes || []);
      } catch (aiErr) {
        console.error('Error fetching AI analyses:', aiErr);
      }
    } catch (err) {
      console.error('Error fetching procedure case detail:', err);
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
    try {
      const isPurposeChange = data.procedureType?.code === 'LAND_USE_PURPOSE_CHANGE' || data.procedureType?.group === 'CHUYEN_MUC_DICH_SDD';
      const newAnalysis = isPurposeChange
        ? await procedureCasesApi.runLandUsePurposeChangeReview(caseId)
        : await procedureCasesApi.runLandFirstCertificateReview(caseId);
      setAiAnalyses((prev) => [newAnalysis, ...prev]);
      alert('Đã hoàn thành rà soát AI cho hồ sơ!');
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Lỗi khi gọi AI rà soát.');
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
      link.setAttribute('download', filename || `phieu-ra-soat-cap-gcn-lan-dau-${data.caseCode || data.id}.docx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      alert('Đã xuất Word (.docx) phiếu rà soát thành công!');
    } catch (err: any) {
      alert(err instanceof ApiError ? err.message : 'Không thể xuất file Word phiếu rà soát');
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
      alert(err instanceof ApiError ? err.message : 'Không thể xem trước phiếu rà soát PDF');
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
      link.setAttribute('download', filename || `phieu-ra-soat-chuyen-muc-dich-su-dung-dat-${data.caseCode || data.id}.docx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      alert('Đã xuất Word (.docx) phiếu rà soát chuyển mục đích sử dụng đất thành công!');
    } catch (err: any) {
      alert(err instanceof ApiError ? err.message : 'Không thể xuất file Word phiếu rà soát');
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
      alert(err instanceof ApiError ? err.message : 'Không thể xem trước phiếu rà soát PDF');
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
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <div>
                    <h4 className="font-bold text-blue-900 text-base">
                      {data?.procedureType?.code === 'LAND_USE_PURPOSE_CHANGE' || data?.procedureType?.group === 'CHUYEN_MUC_DICH_SDD'
                        ? 'Trợ lý AI rà soát chuyển mục đích sử dụng đất'
                        : 'Trợ lý AI rà soát cấp GCN lần đầu'}
                    </h4>
                    <p className="text-xs text-blue-700 mt-0.5">
                      {data?.procedureType?.code === 'LAND_USE_PURPOSE_CHANGE' || data?.procedureType?.group === 'CHUYEN_MUC_DICH_SDD'
                        ? 'Phân tích chuyên sâu thông tin người sử dụng đất, thửa đất, loại đất hiện tại và mục đích xin chuyển, đối chiếu quy hoạch/kế hoạch sử dụng đất.'
                        : 'Phân tích chuyên sâu thông tin chủ sở hữu, thửa đất, lịch sử sử dụng đất và đối chiếu căn cứ pháp lý.'}
                    </p>
                  </div>
                  <button
                    onClick={handleRunAiReview}
                    disabled={runningAi}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 font-semibold text-sm shadow flex items-center gap-2 transition"
                  >
                    {runningAi
                      ? '⏳ Đang phân tích...'
                      : data?.procedureType?.code === 'LAND_USE_PURPOSE_CHANGE' || data?.procedureType?.group === 'CHUYEN_MUC_DICH_SDD'
                      ? '🤖 AI rà soát chuyển mục đích'
                      : '🤖 AI rà soát cấp GCN lần đầu'}
                  </button>
                </div>

                {aiAnalyses.length === 0 && !runningAi && (
                  <div className="p-12 text-center bg-gray-50 rounded-xl border border-dashed space-y-2">
                    <div className="text-3xl text-gray-400">📄</div>
                    <p className="text-sm text-gray-600">Chưa có bản rà soát AI nào cho hồ sơ này. Bấm nút phía trên để bắt đầu rà soát.</p>
                  </div>
                )}

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

                      {/* H. Căn cứ Pháp lý & Quản trị Phiên bản AI (Legal Snapshot) */}
                      <div className="border border-amber-200 bg-amber-50/40 rounded-xl p-4 space-y-3">
                        <h5 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                          <span>🏛️</span> H. Căn cứ Pháp lý &amp; Quản trị Phiên bản AI (Legal Snapshot)
                        </h5>
                        
                        {(() => {
                          const snapshot = analysis.legalSnapshot;
                          const meta = payload.legalKnowledgeMetadata;
                          const kbVer = snapshot?.knowledgeBaseVersion || meta?.knowledgeBaseVersion || 'LAND_KB_V1_2026';
                          const procVer = snapshot?.procedureTypeVersion?.version || meta?.procedureTypeVersion || 'Active Version';
                          const promptVer = snapshot?.promptVersion?.version || meta?.promptVersion || 'Active Version';
                          const chkVer = snapshot?.checklistVersion?.version || meta?.checklistVersion || 'Active Version';
                          const docList = Array.isArray(snapshot?.legalDocumentIds) && snapshot.legalDocumentIds.length > 0
                            ? snapshot.legalDocumentIds
                            : Array.isArray(meta?.legalDocumentCodes) && meta.legalDocumentCodes.length > 0
                            ? meta.legalDocumentCodes
                            : ['Luật Đất đai 2024', 'NĐ 101/2024/NĐ-CP', 'NĐ 102/2024/NĐ-CP'];

                          return (
                            <div className="space-y-2.5 text-xs text-gray-800">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-white p-2.5 rounded-lg border border-amber-100 shadow-sm">
                                <div>
                                  <span className="text-gray-500 block text-[11px]">Knowledge Base</span>
                                  <span className="font-bold text-amber-900">{kbVer}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 block text-[11px]">Procedure Version</span>
                                  <span className="font-bold text-amber-900">{procVer}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 block text-[11px]">Prompt Version</span>
                                  <span className="font-bold text-amber-900">{promptVer}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 block text-[11px]">Checklist Version</span>
                                  <span className="font-bold text-amber-900">{chkVer}</span>
                                </div>
                              </div>

                              <div>
                                <span className="font-semibold text-gray-700 block mb-1">Văn bản pháp luật áp dụng trong phiên bản này:</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {docList.map((doc: string, idx: number) => (
                                    <span key={idx} className="bg-amber-100/80 border border-amber-300 text-amber-950 px-2 py-0.5 rounded font-semibold text-[11px]">
                                      {doc}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="bg-amber-100/60 border border-amber-300/80 p-2.5 rounded-lg text-amber-900 flex items-start gap-2">
                                <span className="text-base leading-none mt-0.5">⚠️</span>
                                <div className="space-y-0.5">
                                  <span className="font-bold block">BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA</span>
                                  <p className="text-amber-950 italic">
                                    Căn cứ pháp lý hiển thị là phiên bản dữ liệu hệ thống ghi nhận tại thời điểm AI rà soát; cán bộ phải kiểm tra văn bản pháp luật hiện hành, văn bản sửa đổi/bổ sung/thay thế nếu có, quy hoạch/kế hoạch sử dụng đất và quy trình nội bộ địa phương tại thời điểm xử lý hồ sơ.
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Export & Review Actions */}
                      <div className="pt-4 border-t flex flex-wrap items-center justify-between gap-2 bg-gray-50 -mx-6 -mb-6 p-4">
                        {analysis.analysisType === 'LAND_FIRST_CERTIFICATE_REVIEW' ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => handleExportReviewDocx(analysis.id)}
                              disabled={exportingAnalysisId === analysis.id}
                              className="inline-flex items-center px-3.5 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 shadow-sm transition disabled:opacity-50"
                            >
                              <Download className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                              {exportingAnalysisId === analysis.id ? 'Đang tải...' : 'Tải phiếu rà soát Word'}
                            </button>
                            <button
                              onClick={() => handlePreviewReviewPdf(analysis.id)}
                              disabled={previewingAnalysisId === analysis.id}
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
                              disabled={exportingAnalysisId === analysis.id}
                              className="inline-flex items-center px-3.5 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 shadow-sm transition disabled:opacity-50"
                            >
                              <Download className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                              {exportingAnalysisId === analysis.id ? 'Đang tải...' : 'Tải phiếu rà soát Word'}
                            </button>
                            <button
                              onClick={() => handlePreviewPurposeChangeReviewPdf(analysis.id)}
                              disabled={previewingAnalysisId === analysis.id}
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
