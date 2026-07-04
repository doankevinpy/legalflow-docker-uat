import React from 'react';
import { X, Printer, Download, AlertTriangle } from 'lucide-react';

interface PurposeChangeReviewPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewData: any;
  onDownloadWord?: () => void;
}

export const PurposeChangeReviewPrintModal: React.FC<PurposeChangeReviewPrintModalProps> = ({
  isOpen,
  onClose,
  previewData,
  onDownloadWord,
}) => {
  if (!isOpen || !previewData) return null;

  const {
    caseCode = '[...]',
    procedureName = 'Chuyển mục đích sử dụng đất',
    applicantName = '[Cán bộ bổ sung/kiểm tra]',
    applicantAddress = '[Cán bộ bổ sung/kiểm tra]',
    applicantPhone = '[Cán bộ bổ sung/kiểm tra]',
    receivedAt = '[Cán bộ bổ sung/kiểm tra]',
    dueDate = '[Cán bộ bổ sung/kiểm tra]',
    assignedToName = '[Cán bộ bổ sung/kiểm tra]',
    createdAt = '[...]',
    confidenceLevel = 'MEDIUM',
    outputPayload = {},
    agencyConfig = {},
    warningBanner = '⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA',
    warningDisclaimer = 'Phiếu này là tài liệu hỗ trợ rà soát nội bộ, không phải văn bản kết luận, không thay thế ý kiến thẩm tra của cán bộ chuyên môn và không phải văn bản phát hành cho công dân.',
    officerResponsibility = 'Cán bộ chuyên môn có trách nhiệm kiểm tra, đối chiếu hồ sơ gốc, căn cứ pháp luật hiện hành, văn bản sửa đổi/bổ sung/thay thế nếu có, dữ liệu địa chính, quy hoạch/kế hoạch sử dụng đất và quy trình nội bộ trước khi tham mưu xử lý.',
  } = previewData;

  const handlePrint = () => {
    window.print();
  };

  const renderBulletList = (items?: string[], fallback = 'Không có thông tin ghi nhận.') => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return <li className="text-slate-500 italic list-none">- {fallback}</li>;
    }
    return items.map((item, index) => (
      <li key={index} className="ml-5 list-disc mb-1">
        {item}
      </li>
    ));
  };

  const checklistItems: string[] = Array.isArray(outputPayload.officerChecklist)
    ? outputPayload.officerChecklist
    : [];

  const defaultFinancialData = [
    'Diện tích xin chuyển mục đích;',
    'Loại đất trước khi chuyển (nguồn gốc, thời hạn);',
    'Mục đích sau khi chuyển;',
    'Nguồn gốc đất và thời điểm bắt đầu sử dụng;',
    'Bảng giá đất / Giá đất cụ thể tại thời điểm quyết định;',
    'Các khoản miễn, giảm tiền sử dụng đất (nếu có).',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 flex items-center justify-center p-4">
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #purpose-change-review-print-area, #purpose-change-review-print-area * {
            visibility: visible !important;
          }
          #purpose-change-review-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 20mm 15mm 20mm 20mm;
          }
        }
      `}</style>

      {/* Modal Container */}
      <div className="bg-slate-100 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-300">
        {/* Top Header Toolbar (no-print) */}
        <div className="no-print bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10 sticky top-0">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Xem trước & In Phiếu rà soát TTHC</h3>
              <p className="text-xs text-slate-500">Mô phỏng Phiếu rà soát nội bộ A4 – Chuyển mục đích sử dụng đất</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {onDownloadWord && (
              <button
                onClick={onDownloadWord}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition shadow-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Tải Word (.docx)
              </button>
            )}
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
            >
              <Printer className="w-4 h-4 mr-2" />
              In / Lưu PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable A4 Preview Area */}
        <div className="overflow-y-auto p-6 md:p-10 flex justify-center bg-slate-200 flex-1">
          {/* A4 Sheet Mockup */}
          <div
            id="purpose-change-review-print-area"
            className="bg-white w-full max-w-[210mm] min-h-[297mm] p-[20mm_15mm_20mm_20mm] shadow-xl text-slate-900 font-serif text-[14pt] leading-relaxed flex flex-col justify-between"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            <div>
              {/* Warning Banner */}
              <div className="mb-6 border-2 border-amber-600 bg-amber-50 p-4 rounded text-center">
                <div className="font-bold text-amber-800 text-base flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-amber-600 inline" />
                  {warningBanner}
                </div>
                <div className="text-xs text-amber-700 mt-1 italic">
                  {warningDisclaimer}
                </div>
              </div>

              {/* Header Table Block */}
              <div className="grid grid-cols-12 gap-4 mb-8 text-center text-[13pt]">
                {/* Left Header */}
                <div className="col-span-5 flex flex-col items-center justify-start">
                  <div>
                    {agencyConfig.parentName ? (
                      agencyConfig.parentName.toUpperCase()
                    ) : (
                      <span className="text-amber-600 font-semibold italic">[Cán bộ bổ sung tên cơ quan chủ quản]</span>
                    )}
                  </div>
                  <div className="font-bold">
                    {agencyConfig.name ? (
                      agencyConfig.name.toUpperCase()
                    ) : (
                      <span className="text-amber-600 font-semibold italic">[Cán bộ bổ sung tên cơ quan ban hành]</span>
                    )}
                  </div>
                  <div className="text-[12pt] mt-1 italic">
                    Số: .....{agencyConfig.docSymbolPrefix || '/PRS-TTHC'}
                  </div>
                </div>

                {/* Right Header */}
                <div className="col-span-7 flex flex-col items-center justify-start">
                  <div className="font-bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div className="font-bold">Độc lập - Tự do - Hạnh phúc</div>
                  <div className="font-bold text-[10pt] leading-none my-1">-------------------</div>
                  <div className="text-[12pt] italic mt-1">
                    {agencyConfig.location || '[Cán bộ bổ sung địa danh]'}, ngày ..... tháng ..... năm 202...
                  </div>
                </div>
              </div>

              {/* Document Title */}
              <div className="text-center mb-8">
                <h1 className="font-bold text-[18pt] text-slate-900 leading-tight">
                  PHIẾU RÀ SOÁT NỘI BỘ HỒ SƠ
                </h1>
                <h2 className="font-bold text-[18pt] text-slate-900 leading-tight mt-1">
                  CHUYỂN MỤC ĐÍCH SỬ DỤNG ĐẤT
                </h2>
              </div>

              {/* I. THÔNG TIN CHUNG HỒ SƠ */}
              <div className="mb-6">
                <h3 className="font-bold text-[15pt] text-blue-900 mb-2 border-b border-slate-300 pb-1">
                  I. THÔNG TIN CHUNG HỒ SƠ
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[13pt]">
                  <div><span className="font-bold">Mã hồ sơ:</span> {caseCode}</div>
                  <div><span className="font-bold">Loại thủ tục:</span> {procedureName}</div>
                  <div><span className="font-bold">Lĩnh vực:</span> Đất đai</div>
                  <div><span className="font-bold">Người nộp đơn:</span> {applicantName}</div>
                  <div className="col-span-2"><span className="font-bold">Địa chỉ liên hệ:</span> {applicantAddress}</div>
                  <div><span className="font-bold">Số điện thoại:</span> {applicantPhone}</div>
                  <div><span className="font-bold">Ngày tiếp nhận:</span> {receivedAt}</div>
                  <div><span className="font-bold">Hạn giải quyết:</span> {dueDate}</div>
                  <div><span className="font-bold">Cán bộ thụ lý:</span> {assignedToName}</div>
                </div>
              </div>

              {/* II. TÓM TẮT PHÂN TÍCH TỪ TRỢ LÝ AI */}
              <div className="mb-6">
                <h3 className="font-bold text-[15pt] text-blue-900 mb-2 border-b border-slate-300 pb-1">
                  II. TÓM TẮT PHÂN TÍCH TỪ TRỢ LÝ AI
                </h3>
                <p className="mb-2 text-[13.5pt]">{outputPayload.summary || 'Không có thông tin tóm tắt.'}</p>
                <div className="text-[13pt] space-y-1">
                  <div><span className="font-bold">Loại phân tích:</span> Rà soát chuyển mục đích sử dụng đất (LAND_USE_PURPOSE_CHANGE_REVIEW)</div>
                  <div><span className="font-bold">Mức độ tin cậy AI:</span> <span className="font-semibold text-indigo-700">{confidenceLevel}</span></div>
                  <div><span className="font-bold">Thời điểm rà soát:</span> {createdAt}</div>
                </div>

                {/* Legal Snapshot & Admin Review */}
                {(() => {
                  const meta = outputPayload?.legalKnowledgeMetadata;
                  const kbVer = meta?.knowledgeBaseVersion || 'LAND_KB_V1_2026';
                  const procVer = meta?.procedureTypeVersion || 'Active Version';
                  const promptVer = meta?.promptVersion || 'Active Version';
                  const chkVer = meta?.checklistVersion || 'Active Version';
                  const docList = Array.isArray(meta?.legalDocumentCodes) && meta.legalDocumentCodes.length > 0
                    ? meta.legalDocumentCodes
                    : ['Luật Đất đai 2024', 'NĐ 101/2024/NĐ-CP', 'NĐ 102/2024/NĐ-CP'];

                  return (
                    <div className="mt-3 p-3 bg-amber-50/70 border border-amber-300 rounded text-[12pt] space-y-2">
                      <div className="font-bold text-amber-900">🏛️ CĂN CỨ PHÁP LÝ &amp; PHIÊN BẢN HỆ THỐNG (LEGAL SNAPSHOT):</div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <div><span className="font-semibold">Bộ dữ liệu (KB):</span> {kbVer}</div>
                        <div><span className="font-semibold">Thủ tục:</span> {procVer}</div>
                        <div><span className="font-semibold">Prompt AI:</span> {promptVer}</div>
                        <div><span className="font-semibold">Checklist:</span> {chkVer}</div>
                      </div>
                      <div>
                        <span className="font-semibold">Văn bản pháp luật áp dụng:</span> {docList.join('; ')}
                      </div>
                      <div className="pt-1 border-t border-amber-200 text-[11.5pt] italic text-amber-950">
                        <span className="font-bold not-italic">⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA:</span> Căn cứ pháp lý hiển thị là phiên bản dữ liệu hệ thống ghi nhận tại thời điểm AI rà soát; cán bộ phải kiểm tra văn bản pháp luật hiện hành, văn bản sửa đổi/bổ sung/thay thế nếu có, quy hoạch/kế hoạch sử dụng đất và quy trình nội bộ địa phương tại thời điểm xử lý hồ sơ.
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* III. NHẬN DIỆN THÔNG TIN NGƯỜI SỬ DỤNG ĐẤT */}
              <div className="mb-6">
                <h3 className="font-bold text-[15pt] text-blue-900 mb-2 border-b border-slate-300 pb-1">
                  III. NHẬN DIỆN THÔNG TIN NGƯỜI SỬ DỤNG ĐẤT
                </h3>
                <div className="text-[13pt] space-y-1 mb-2">
                  <div><span className="font-bold">Họ tên / Chủ thể:</span> {outputPayload.applicantReview?.applicantName || applicantName}</div>
                  <div><span className="font-bold">Tình trạng nhân thân:</span> {outputPayload.applicantReview?.identityInfoStatus || 'Cần xác minh đối chiếu CCCD/Giấy tờ pháp lý bản gốc.'}</div>
                  <div><span className="font-bold">Địa chỉ:</span> {outputPayload.applicantReview?.addressStatus || applicantAddress}</div>
                </div>
                <div className="font-bold text-[13pt] mt-2">Nội dung cán bộ cần kiểm tra / xác minh:</div>
                <ul className="mt-1 text-[13pt]">
                  {renderBulletList(outputPayload.applicantReview?.issuesToVerify)}
                </ul>
              </div>

              {/* IV. NHẬN DIỆN THÔNG TIN THỬA ĐẤT */}
              <div className="mb-6">
                <h3 className="font-bold text-[15pt] text-blue-900 mb-2 border-b border-slate-300 pb-1">
                  IV. NHẬN DIỆN THÔNG TIN THỬA ĐẤT
                </h3>
                <div className="text-[13pt] space-y-1 mb-2">
                  <div><span className="font-bold">Số thửa / Tờ bản đồ:</span> Thửa số {outputPayload.landParcelReview?.parcelNumber || '[...]'} / Tờ bản đồ số {outputPayload.landParcelReview?.mapSheetNumber || '[...]'}</div>
                  <div><span className="font-bold">Địa chỉ thửa đất:</span> {outputPayload.landParcelReview?.location || '[Cán bộ kiểm tra thực địa]'}</div>
                  <div><span className="font-bold">Diện tích toàn thửa:</span> {outputPayload.landParcelReview?.totalArea || outputPayload.landParcelReview?.area || '[...]'}</div>
                  <div><span className="font-bold">Diện tích xin chuyển mục đích:</span> {outputPayload.landParcelReview?.areaRequestedForChange || outputPayload.purposeChangeReview?.requestedArea || '[...]'}</div>
                  <div><span className="font-bold">Loại đất hiện tại:</span> {outputPayload.landParcelReview?.landUseType || outputPayload.purposeChangeReview?.currentLandUseType || '[...]'}</div>
                  <div><span className="font-bold">Mục đích xin chuyển sang:</span> {outputPayload.purposeChangeReview?.requestedLandUseType || '[...]'}</div>
                  <div><span className="font-bold">Tình trạng ranh giới / Hiện trạng:</span> {outputPayload.landParcelReview?.boundaryStatus || 'Cần đối chiếu bản đồ địa chính và thực tế.'}</div>
                </div>
                <div className="font-bold text-[13pt] mt-2">Điểm cần cán bộ kiểm tra / xác minh:</div>
                <ul className="mt-1 text-[13pt]">
                  {renderBulletList(outputPayload.landParcelReview?.issuesToVerify)}
                </ul>
              </div>

              {/* V. LOẠI ĐẤT HIỆN TẠI VÀ MỤC ĐÍCH XIN CHUYỂN */}
              <div className="mb-6">
                <h3 className="font-bold text-[15pt] text-blue-900 mb-2 border-b border-slate-300 pb-1">
                  V. LOẠI ĐẤT HIỆN TẠI VÀ MỤC ĐÍCH XIN CHUYỂN
                </h3>
                <div className="text-[13pt] space-y-1 mb-2">
                  <div><span className="font-bold">Loại đất hiện tại:</span> {outputPayload.purposeChangeReview?.currentLandUseType || '[...]'}</div>
                  <div><span className="font-bold">Mục đích xin chuyển:</span> {outputPayload.purposeChangeReview?.requestedLandUseType || '[...]'}</div>
                  <div><span className="font-bold">Diện tích xin chuyển:</span> {outputPayload.purposeChangeReview?.requestedArea || '[...]'}</div>
                </div>
                <div className="font-bold text-[13pt] mt-2">Nội dung cần đối chiếu quy hoạch / kế hoạch sử dụng đất:</div>
                <ul className="mt-1 text-[13pt] mb-2">{renderBulletList(outputPayload.purposeChangeReview?.planningCompatibility || outputPayload.planningAndCurrentStatusReview?.planningNeedCheck)}</ul>
                <div className="font-bold text-[13pt]">Nội dung cần kiểm tra về nhu cầu sử dụng đất:</div>
                <ul className="mt-1 text-[13pt] mb-2">{renderBulletList(outputPayload.purposeChangeReview?.needForLandUseCheck || outputPayload.purposeChangeReview?.eligibilityIssuesToVerify)}</ul>
                <div className="font-bold text-[13pt]">Nội dung cần kiểm tra về điều kiện chuyển mục đích:</div>
                <ul className="mt-1 text-[13pt]">{renderBulletList(outputPayload.purposeChangeReview?.eligibilityIssuesToVerify)}</ul>
                <div className="mt-2 text-[12.5pt] italic text-slate-500">
                  Lưu ý: Không kết luận đủ điều kiện hay không đủ điều kiện chuyển mục đích sử dụng đất; cán bộ thẩm định chịu trách nhiệm kiểm tra chi tiết theo quy định.
                </div>
              </div>

              {/* VI. KIỂM TRA THÀNH PHẦN HỒ SƠ */}
              <div className="mb-6">
                <h3 className="font-bold text-[15pt] text-blue-900 mb-2 border-b border-slate-300 pb-1">
                  VI. KIỂM TRA THÀNH PHẦN HỒ SƠ
                </h3>
                <div className="font-bold text-[13pt]">1. Tài liệu đã nhận diện trong hồ sơ:</div>
                <ul className="mt-1 text-[13pt] mb-2">{renderBulletList(outputPayload.documentCompletenessReview?.detectedDocuments)}</ul>
                <div className="font-bold text-[13pt]">2. Tài liệu còn thiếu / Cần đối chiếu bản gốc:</div>
                <ul className="mt-1 text-[13pt] mb-2">{renderBulletList(outputPayload.documentCompletenessReview?.missingOrNeedCheckDocuments)}</ul>
                <div className="font-bold text-[13pt]">3. Đề xuất yêu cầu công dân bổ sung:</div>
                <ul className="mt-1 text-[13pt]">{renderBulletList(outputPayload.documentCompletenessReview?.recommendSupplementDocuments)}</ul>
              </div>

              {/* VII. QUY HOẠCH, KẾ HOẠCH SỬ DỤNG ĐẤT, HIỆN TRẠNG */}
              <div className="mb-6">
                <h3 className="font-bold text-[15pt] text-blue-900 mb-2 border-b border-slate-300 pb-1">
                  VII. QUY HOẠCH, KẾ HOẠCH SỬ DỤNG ĐẤT, HIỆN TRẠNG
                </h3>
                <div className="font-bold text-[13pt]">Nội dung cần kiểm tra về quy hoạch / kế hoạch sử dụng đất:</div>
                <ul className="mt-1 text-[13pt] mb-2">{renderBulletList(outputPayload.planningAndCurrentStatusReview?.planningNeedCheck)}</ul>
                <div className="font-bold text-[13pt]">Nội dung cần kiểm tra về hiện trạng sử dụng đất:</div>
                <ul className="mt-1 text-[13pt] mb-2">{renderBulletList(outputPayload.planningAndCurrentStatusReview?.currentUseNeedCheck)}</ul>
                <div className="font-bold text-[13pt]">Nội dung cần kiểm tra về tranh chấp / khiếu nại:</div>
                <ul className="mt-1 text-[13pt] mb-2">{renderBulletList(outputPayload.planningAndCurrentStatusReview?.disputeNeedCheck)}</ul>
                <div className="font-bold text-[13pt]">Nội dung cần kiểm tra về ranh giới, diện tích:</div>
                <ul className="mt-1 text-[13pt] mb-2">{renderBulletList(outputPayload.planningAndCurrentStatusReview?.boundaryAreaNeedCheck)}</ul>
                <div className="font-bold text-[13pt]">Nội dung cần kiểm tra về hành lang bảo vệ, đất công, lấn chiếm:</div>
                <ul className="mt-1 text-[13pt]">{renderBulletList(outputPayload.planningAndCurrentStatusReview?.publicLandOrCorridorNeedCheck || outputPayload.planningAndCurrentStatusReview?.boundaryAreaNeedCheck)}</ul>
              </div>

              {/* VIII. NGHĨA VỤ TÀI CHÍNH CẦN KIỂM TRA */}
              <div className="mb-6">
                <h3 className="font-bold text-[15pt] text-blue-900 mb-2 border-b border-slate-300 pb-1">
                  VIII. NGHĨA VỤ TÀI CHÍNH CẦN KIỂM TRA
                </h3>
                <div className="mb-2 text-[13pt] font-bold text-amber-700">
                  Ghi chú trọng yếu: Phase này không lập bảng tính tiền sử dụng đất, không đưa ra số tiền phải nộp hoặc kết luận tài chính.
                </div>
                <div className="font-bold text-[13pt]">Dữ liệu cần chuẩn bị cho phase nghĩa vụ tài chính:</div>
                <ul className="mt-1 text-[13pt]">{renderBulletList(outputPayload.financialObligationNotice?.dataNeededForLaterPhase || defaultFinancialData)}</ul>
              </div>

              {/* IX. RỦI RO CẦN LƯU Ý */}
              <div className="mb-6">
                <h3 className="font-bold text-[15pt] text-blue-900 mb-2 border-b border-slate-300 pb-1">
                  IX. RỦI RO CẦN LƯU Ý
                </h3>
                <div className="font-bold text-[13pt]">Danh sách rủi ro & cảnh báo:</div>
                <ul className="mt-1 text-[13pt]">{renderBulletList(outputPayload.riskFlags)}</ul>
              </div>

              {/* X. KHUYẾN NGHỊ CHUYÊN MÔN */}
              <div className="mb-6">
                <h3 className="font-bold text-[15pt] text-blue-900 mb-2 border-b border-slate-300 pb-1">
                  X. KHUYẾN NGHỊ CHUYÊN MÔN
                </h3>
                <div className="font-bold text-[13pt]">Khuyến nghị cán bộ cần kiểm tra:</div>
                <ul className="mt-1 text-[13pt] mb-2">{renderBulletList(outputPayload.recommendations)}</ul>
                <div className="mt-2 text-[13pt] mb-2">
                  <span className="font-bold">Cơ quan / Bộ phận cần phối hợp:</span> UBND cấp xã nơi có đất, Văn phòng đăng ký đất đai / Chi nhánh VPĐKĐĐ, Phòng Tài nguyên và Môi trường, Cơ quan Thuế.
                </div>
                <div className="font-bold text-[13pt]">Căn cứ pháp lý áp dụng rà soát:</div>
                <ul className="mt-1 text-[13pt] mb-2">{renderBulletList(outputPayload.legalBasisToCheck)}</ul>
                <div className="mt-2 text-[12.5pt] italic text-amber-800">
                  Lưu ý: Căn cứ pháp lý cần cán bộ kiểm tra, đối chiếu văn bản hiện hành, văn bản sửa đổi/bổ sung/thay thế nếu có và quy trình nội bộ địa phương tại thời điểm xử lý hồ sơ. Tuyệt đối không kết luận được hay không được chuyển mục đích.
                </div>
              </div>

              {/* XI. CÂU HỎI GỢI Ý YÊU CẦU CÔNG DÂN GIẢI TRÌNH/BỔ SUNG */}
              <div className="mb-6">
                <h3 className="font-bold text-[15pt] text-blue-900 mb-2 border-b border-slate-300 pb-1">
                  XI. CÂU HỎI GỢI Ý YÊU CẦU CÔNG DÂN GIẢI TRÌNH/BỔ SUNG
                </h3>
                <ul className="mt-1 text-[13pt]">{renderBulletList(outputPayload.recommendedNextQuestions)}</ul>
              </div>

              {/* XII. CHECKLIST GỢI Ý CHO CÁN BỘ THỤ LÝ */}
              <div className="mb-8">
                <h3 className="font-bold text-[15pt] text-blue-900 mb-2 border-b border-slate-300 pb-1">
                  XII. CHECKLIST GỢI Ý CHO CÁN BỘ THỤ LÝ
                </h3>
                <p className="text-[13pt] italic mb-3">
                  Cán bộ thụ lý sử dụng bảng dưới đây để đánh dấu tiến độ kiểm tra thực tế hồ sơ:
                </p>
                <table className="w-full border-collapse border border-slate-400 text-[12pt]">
                  <thead>
                    <tr className="bg-slate-100 font-bold text-center">
                      <th className="border border-slate-400 p-2 w-12">TT</th>
                      <th className="border border-slate-400 p-2">Nội dung rà soát / Kiểm tra</th>
                      <th className="border border-slate-400 p-2 w-36">Kết quả rà soát</th>
                      <th className="border border-slate-400 p-2 w-32">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checklistItems.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="border border-slate-400 p-3 text-center italic text-slate-500">
                          Không có mục kiểm tra đề xuất.
                        </td>
                      </tr>
                    ) : (
                      checklistItems.map((item, idx) => (
                        <tr key={idx}>
                          <td className="border border-slate-400 p-2 text-center">{idx + 1}</td>
                          <td className="border border-slate-400 p-2">{item}</td>
                          <td className="border border-slate-400 p-2 text-center whitespace-pre-line text-[11pt]">
                            {'[  ] Đạt\n[  ] Bổ sung'}
                          </td>
                          <td className="border border-slate-400 p-2"></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* XIII. TRÁCH NHIỆM & KÝ NHÁY NỘI BỘ */}
            <div className="mt-6 pt-6 border-t-2 border-slate-400">
              <h3 className="font-bold text-[15pt] text-blue-900 mb-2">
                XIII. TRÁCH NHIỆM & KÝ NHÁY NỘI BỘ
              </h3>
              <div className="bg-amber-50 border border-amber-300 p-3 rounded mb-6 text-[12.5pt] italic text-amber-900">
                <span className="font-bold not-italic">Ghi chú trách nhiệm:</span> {officerResponsibility}
              </div>

              {/* Signatures Grid (Internal staff only, no official issuance seal) */}
              <div className="grid grid-cols-12 gap-4 text-[13pt] mt-4">
                <div className="col-span-6 flex flex-col justify-start">
                  <div className="font-bold italic">Nơi nhận:</div>
                  <div>- Lưu: VT, HS TTHC;</div>
                  <div>- Cán bộ thụ lý;</div>
                  <div>- Lãnh đạo bộ phận (để báo cáo).</div>
                </div>

                <div className="col-span-6 flex flex-col items-center justify-start text-center">
                  <div className="font-bold">CÁN BỘ THẨM TRA / RÀ SOÁT</div>
                  <div className="italic text-[12pt]">(Ký, ghi rõ họ tên)</div>
                  <div className="h-24"></div>
                  <div className="font-bold">{assignedToName !== '[Cán bộ bổ sung/kiểm tra]' ? assignedToName : '[Cán bộ rà soát ký nháy]'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
