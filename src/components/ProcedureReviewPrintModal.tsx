import React from 'react';
import { X, Printer, Download, AlertTriangle } from 'lucide-react';

interface ProcedureReviewPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewData: any;
  onDownloadWord?: () => void;
}

export const ProcedureReviewPrintModal: React.FC<ProcedureReviewPrintModalProps> = ({
  isOpen,
  onClose,
  previewData,
  onDownloadWord,
}) => {
  if (!isOpen || !previewData) return null;

  const {
    caseCode = '[...]',
    procedureName = 'Cấp GCN quyền sử dụng đất lần đầu',
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
    officerResponsibility = 'Cán bộ chuyên môn có trách nhiệm kiểm tra, đối chiếu hồ sơ gốc, căn cứ pháp luật, dữ liệu địa chính, quy hoạch/kế hoạch sử dụng đất và quy trình nội bộ trước khi tham mưu xử lý.',
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 flex items-center justify-center p-4">
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #procedure-review-print-area, #procedure-review-print-area * {
            visibility: visible !important;
          }
          #procedure-review-print-area {
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
              <p className="text-xs text-slate-500">Mô phỏng Phiếu rà soát nội bộ A4 – Cấp GCN lần đầu</p>
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
            id="procedure-review-print-area"
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
                  PHIẾU RÀ SOÁT NỘI BỘ HỒ SƠ CẤP GIẤY CHỨNG NHẬN
                </h1>
                <h2 className="font-bold text-[18pt] text-slate-900 leading-tight mt-1">
                  QUYỀN SỬ DỤNG ĐẤT LẦN ĐẦU
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
                  <div><span className="font-bold">Loại phân tích:</span> Rà soát cấp Giấy chứng nhận lần đầu (LAND_FIRST_CERTIFICATE_REVIEW)</div>
                  <div><span className="font-bold">Mức độ tin cậy AI:</span> <span className="font-semibold text-indigo-700">{confidenceLevel}</span></div>
                  <div><span className="font-bold">Thời điểm rà soát:</span> {createdAt}</div>
                </div>
              </div>

              {/* III. NHẬN DIỆN THÔNG TIN NGƯỜI SỬ DỤNG ĐẤT */}
              <div className="mb-6">
                <h3 className="font-bold text-[15pt] text-blue-900 mb-2 border-b border-slate-300 pb-1">
                  III. NHẬN DIỆN THÔNG TIN NGƯỜI SỬ DỤNG ĐẤT
                </h3>
                <div className="text-[13pt] space-y-1 mb-2">
                  <div><span className="font-bold">Họ tên / Chủ thể:</span> {outputPayload.applicantReview?.applicantName || applicantName}</div>
                  <div><span className="font-bold">Tình trạng nhân thân:</span> {outputPayload.applicantReview?.identityInfoStatus || 'Cần xác minh đối chiếu CCCD bản gốc.'}</div>
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
                  <div><span className="font-bold">Vị trí thửa đất:</span> {outputPayload.landParcelReview?.location || '[Cán bộ kiểm tra thực địa]'}</div>
                  <div><span className="font-bold">Diện tích / Loại đất:</span> {outputPayload.landParcelReview?.area || '[...]'} • {outputPayload.landParcelReview?.landUseType || '[...]'}</div>
                  <div><span className="font-bold">Tình trạng ranh giới:</span> {outputPayload.landParcelReview?.boundaryStatus || 'Cần đối chiếu bản đồ địa chính.'}</div>
                </div>
                <div className="font-bold text-[13pt] mt-2">Điểm cần đối chiếu thực địa & hồ sơ kỹ thuật:</div>
                <ul className="mt-1 text-[13pt]">
                  {renderBulletList(outputPayload.landParcelReview?.issuesToVerify)}
                </ul>
              </div>

              {/* V. NGUỒN GỐC & THỜI ĐIỂM SỬ DỤNG ĐẤT */}
              <div className="mb-6">
                <h3 className="font-bold text-[15pt] text-blue-900 mb-2 border-b border-slate-300 pb-1">
                  V. NGUỒN GỐC & THỜI ĐIỂM SỬ DỤNG ĐẤT
                </h3>
                <div className="text-[13pt] space-y-1 mb-2">
                  <div><span className="font-bold">Nguồn gốc khai báo:</span> {outputPayload.originAndUseHistoryReview?.declaredOrigin || '[Cán bộ bổ sung/kiểm tra]'}</div>
                  <div><span className="font-bold">Thời điểm bắt đầu sử dụng:</span> {outputPayload.originAndUseHistoryReview?.declaredUseStartTime || '[Cán bộ bổ sung/kiểm tra]'}</div>
                </div>
                <div className="font-bold text-[13pt] mt-2">Giấy tờ chứng minh liên quan:</div>
                <ul className="mt-1 text-[13pt]">{renderBulletList(outputPayload.originAndUseHistoryReview?.supportingDocuments)}</ul>
                <div className="font-bold text-[13pt] mt-2">Rủi ro lịch sử sử dụng cần lưu ý:</div>
                <ul className="mt-1 text-[13pt]">{renderBulletList(outputPayload.originAndUseHistoryReview?.riskFlags)}</ul>
                <div className="font-bold text-[13pt] mt-2">Nội dung cần thẩm tra / bổ sung căn cứ:</div>
                <ul className="mt-1 text-[13pt]">{renderBulletList(outputPayload.originAndUseHistoryReview?.issuesToVerify)}</ul>
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

              {/* VII. QUY HOẠCH, TRANH CHẤP & HIỆN TRẠNG SỬ DỤNG */}
              <div className="mb-6">
                <h3 className="font-bold text-[15pt] text-blue-900 mb-2 border-b border-slate-300 pb-1">
                  VII. QUY HOẠCH, TRANH CHẤP & HIỆN TRẠNG SỬ DỤNG
                </h3>
                <div className="font-bold text-[13pt]">Quy hoạch & Kế hoạch sử dụng đất cần rà soát:</div>
                <ul className="mt-1 text-[13pt] mb-2">{renderBulletList(outputPayload.planningDisputeAndCurrentStatusReview?.planningNeedCheck)}</ul>
                <div className="font-bold text-[13pt]">Khiếu nại, tranh chấp đất đai tại địa phương:</div>
                <ul className="mt-1 text-[13pt] mb-2">{renderBulletList(outputPayload.planningDisputeAndCurrentStatusReview?.disputeNeedCheck)}</ul>
                <div className="font-bold text-[13pt]">Hiện trạng sử dụng đất & ranh giới thực tế:</div>
                <ul className="mt-1 text-[13pt] mb-2">{renderBulletList(outputPayload.planningDisputeAndCurrentStatusReview?.currentUseNeedCheck)}</ul>
                <div className="font-bold text-[13pt]">Tài sản gắn liền với đất (nhà ở, công trình):</div>
                <ul className="mt-1 text-[13pt] mb-2">{renderBulletList(outputPayload.planningDisputeAndCurrentStatusReview?.attachedAssetsNeedCheck)}</ul>
                <div className="mt-2 text-[13pt]">
                  <span className="font-bold">Ghi chú tài chính / Tiền sử dụng đất:</span> {outputPayload.financialObligationNotice?.message || 'Phase này chỉ cảnh báo nội dung cần kiểm tra, không lập bảng tính tiền sử dụng đất.'}
                </div>
              </div>

              {/* VIII. RỦI RO & KHUYẾN NGHỊ CHUYÊN MÔN */}
              <div className="mb-6">
                <h3 className="font-bold text-[15pt] text-blue-900 mb-2 border-b border-slate-300 pb-1">
                  VIII. RỦI RO & KHUYẾN NGHỊ CHUYÊN MÔN
                </h3>
                <div className="font-bold text-[13pt]">Rủi ro pháp lý cần lưu ý:</div>
                <ul className="mt-1 text-[13pt] mb-2">{renderBulletList(outputPayload.riskFlags)}</ul>
                <div className="font-bold text-[13pt]">Khuyến nghị hướng giải quyết cho cán bộ:</div>
                <ul className="mt-1 text-[13pt] mb-2">{renderBulletList(outputPayload.recommendations)}</ul>
                <div className="font-bold text-[13pt]">Căn cứ pháp lý áp dụng rà soát:</div>
                <ul className="mt-1 text-[13pt] mb-2">{renderBulletList(outputPayload.legalBasisToCheck)}</ul>
                <div className="mt-2 text-[13pt]">
                  <span className="font-bold">Cơ quan / Bộ phận cần phối hợp:</span> UBND cấp xã nơi có đất, Văn phòng đăng ký đất đai / Chi nhánh VPĐKĐĐ, Phòng Tài nguyên và Môi trường.
                </div>
              </div>

              {/* IX. CÂU HỎI GỢI Ý YÊU CẦU NGƯỜI DÂN BỔ SUNG / GIẢI TRÌNH */}
              <div className="mb-6">
                <h3 className="font-bold text-[15pt] text-blue-900 mb-2 border-b border-slate-300 pb-1">
                  IX. CÂU HỎI GỢI Ý YÊU CẦU NGƯỜI DÂN BỔ SUNG / GIẢI TRÌNH
                </h3>
                <ul className="mt-1 text-[13pt]">{renderBulletList(outputPayload.recommendedNextQuestions)}</ul>
              </div>

              {/* X. CHECKLIST GỢI Ý CHO CÁN BỘ THỤ LÝ */}
              <div className="mb-8">
                <h3 className="font-bold text-[15pt] text-blue-900 mb-2 border-b border-slate-300 pb-1">
                  X. CHECKLIST GỢI Ý CHO CÁN BỘ THỤ LÝ
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

            {/* XI. TRÁCH NHIỆM & KÝ NHÁY NỘI BỘ */}
            <div className="mt-6 pt-6 border-t-2 border-slate-400">
              <h3 className="font-bold text-[15pt] text-blue-900 mb-2">
                XI. TRÁCH NHIỆM & KÝ NHÁY NỘI BỘ
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
