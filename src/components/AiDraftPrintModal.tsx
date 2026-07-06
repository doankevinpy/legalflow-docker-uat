import React from 'react';
import { X, Printer, Download, AlertTriangle } from 'lucide-react';
import { AI_REVIEW_WARNING } from '../lib/constants';

interface AiDraftPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewData: any;
  onDownloadWord?: () => void;
}

export const AiDraftPrintModal: React.FC<AiDraftPrintModalProps> = ({
  isOpen,
  onClose,
  previewData,
  onDownloadWord,
}) => {
  if (!isOpen || !previewData) return null;

  const {
    templateGroup = 'DEFAULT',
    draftTitle = 'VĂN BẢN DỰ THẢO',
    cleanedLines = [],
    agencyConfig = {},
    warningBanner = AI_REVIEW_WARNING,
    warningDisclaimer = 'Cán bộ phải kiểm tra, chỉnh sửa và chịu trách nhiệm trước khi sử dụng hoặc ban hành.',
  } = previewData;

  const handlePrint = () => {
    window.print();
  };

  const renderFormattedText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\[[^\]]+\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={index} className="text-amber-600 font-bold italic">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const isInternal = templateGroup === 'INTERNAL_NOTE';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 flex items-center justify-center p-4">
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #ai-draft-print-area, #ai-draft-print-area * {
            visibility: visible !important;
          }
          #ai-draft-print-area {
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
              <h3 className="text-lg font-bold text-slate-800">Xem trước & In PDF Bản nháp AI</h3>
              <p className="text-xs text-slate-500">Mô phỏng thể thức hành chính A4 theo Nghị định 30/2020/NĐ-CP</p>
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
            id="ai-draft-print-area"
            className="bg-white w-full max-w-[210mm] min-h-[297mm] p-[20mm_15mm_20mm_20mm] shadow-xl text-slate-900 font-serif text-[14pt] leading-relaxed flex flex-col justify-between"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            <div>
              {/* Warning Banner */}
              <div className="mb-6 border-2 border-amber-500 bg-amber-50 p-3 rounded text-center">
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
                  {isInternal ? (
                    <div className="font-bold">PHIẾU XỬ LÝ NỘI BỘ</div>
                  ) : (
                    <>
                      <div>
                        {agencyConfig.parentName ? (
                          agencyConfig.parentName.toUpperCase()
                        ) : (
                          <span className="text-amber-600 font-bold italic">[Cán bộ bổ sung tên cơ quan chủ quản]</span>
                        )}
                      </div>
                      <div className="font-bold">
                        {agencyConfig.name ? (
                          agencyConfig.name.toUpperCase()
                        ) : (
                          <span className="text-amber-600 font-bold italic">[Cán bộ bổ sung tên cơ quan ban hành]</span>
                        )}
                      </div>
                      <div className="text-xs my-0.5">-------</div>
                      <div>
                        {agencyConfig.docSymbolPrefix ? (
                          `Số: ...${agencyConfig.docSymbolPrefix}`
                        ) : (
                          <span className="text-amber-600 font-bold italic">[Cán bộ bổ sung số, ký hiệu văn bản]</span>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Right Header */}
                <div className="col-span-7 flex flex-col items-center justify-start">
                  {!isInternal && (
                    <>
                      <div className="font-bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                      <div className="font-bold">Độc lập - Tự do - Hạnh phúc</div>
                      <div className="text-xs my-0.5">-------------------</div>
                      <div className="italic mt-1">
                        {agencyConfig.location ? (
                          `${agencyConfig.location}, ngày ... tháng ... năm 202...`
                        ) : (
                          <span className="text-amber-600 font-bold italic">[Cán bộ bổ sung địa danh, ngày tháng]</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="text-center my-8">
                <h1 className="font-bold text-[16pt] uppercase tracking-wide">
                  {renderFormattedText(draftTitle)}
                </h1>
                {isInternal && (
                  <div className="italic text-[13pt] mt-1">(Kèm theo hồ sơ vụ việc)</div>
                )}
              </div>

              {/* Body Content */}
              <div className="space-y-3 text-justify">
                {cleanedLines.map((line: string, idx: number) => {
                  if (!line.trim()) {
                    return <div key={idx} className="h-4" />;
                  }
                  return (
                    <p key={idx} className="indent-8">
                      {renderFormattedText(line)}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* Footer Signature Block */}
            <div className="grid grid-cols-12 gap-4 mt-16 pt-8 text-[13pt] break-inside-avoid">
              {/* Left Column: Recipients */}
              <div className="col-span-6 flex flex-col items-start">
                <div className="font-bold italic">Nơi nhận:</div>
                {agencyConfig.defaultRecipients && agencyConfig.defaultRecipients.length > 0 ? (
                  agencyConfig.defaultRecipients.map((rec: string, i: number) => (
                    <div key={i} className="italic text-[12pt] pl-2">
                      {renderFormattedText(rec)}
                    </div>
                  ))
                ) : (
                  <div className="text-amber-600 font-bold italic pl-2">
                    [Cán bộ bổ sung nơi nhận]
                  </div>
                )}
              </div>

              {/* Right Column: Signer Block */}
              <div className="col-span-6 flex flex-col items-center text-center">
                {isInternal ? (
                  <>
                    <div className="font-bold">CÁN BỘ THỤ LÝ</div>
                    <div className="italic text-[12pt]">(Ký, ghi rõ họ tên)</div>
                    <div className="h-20" />
                    <div className="font-bold text-amber-600 italic">
                      [Cán bộ bổ sung họ tên]
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-bold uppercase">
                      {agencyConfig.signerTitle ? (
                        agencyConfig.signerTitle.split('\n').map((t: string, i: number) => (
                          <div key={i}>{renderFormattedText(t)}</div>
                        ))
                      ) : (
                        <span className="text-amber-600 font-bold italic">[Cán bộ bổ sung chức danh người ký]</span>
                      )}
                    </div>
                    <div className="italic text-[12pt]">(Ký, ghi rõ họ tên, đóng dấu)</div>
                    <div className="h-24" />
                    <div className="font-bold">
                      {agencyConfig.signerName ? (
                        renderFormattedText(agencyConfig.signerName)
                      ) : (
                        <span className="text-amber-600 font-bold italic">[Cán bộ bổ sung họ tên người ký]</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
