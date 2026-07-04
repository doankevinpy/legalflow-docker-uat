import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
  ShadingType,
} from 'docx';
import { AgencyConfig, getAgencyConfig } from '../../config/agency.config';

export function buildLandFirstCertReviewDocx(
  caseItem: any,
  analysis: any,
  config?: AgencyConfig,
): Document {
  const cfg = config || getAgencyConfig();
  const payload = analysis.outputPayload || {};

  // Helper for bullet list
  const createBulletList = (items?: string[], fallback = 'Không có thông tin ghi nhận.') => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return [
        new Paragraph({
          children: [new TextRun({ text: `- ${fallback}`, italics: true, color: '64748B' })],
          spacing: { after: 60 },
        }),
      ];
    }
    return items.map(
      (item) =>
        new Paragraph({
          children: [new TextRun({ text: `• ${item}` })],
          spacing: { after: 60 },
          indent: { left: 360 },
        }),
    );
  };

  // Helper for section header
  const createSectionHeader = (title: string) => {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          color: '1E3A8A', // Dark blue
          size: 24,
        }),
      ],
      spacing: { before: 240, after: 120 },
    });
  };

  // Helper for subheader
  const createSubHeader = (title: string) => {
    return new Paragraph({
      children: [
        new TextRun({
          text: title,
          bold: true,
          color: '334155',
        }),
      ],
      spacing: { before: 120, after: 60 },
    });
  };

  // 1. Warning Banner Table
  const warningTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 8, color: 'D97706' },
      bottom: { style: BorderStyle.SINGLE, size: 8, color: 'D97706' },
      left: { style: BorderStyle.SINGLE, size: 8, color: 'D97706' },
      right: { style: BorderStyle.SINGLE, size: 8, color: 'D97706' },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: 'FEF3C7', type: ShadingType.CLEAR, color: 'auto' },
            margins: { top: 160, bottom: 160, left: 160, right: 160 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: '⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA',
                    bold: true,
                    size: 24,
                    color: 'B45309',
                  }),
                ],
                spacing: { after: 80 },
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Phiếu này là tài liệu hỗ trợ rà soát nội bộ, không phải văn bản kết luận, không thay thế ý kiến thẩm tra của cán bộ chuyên môn và không phải văn bản phát hành cho công dân.',
                    italics: true,
                    size: 20,
                    color: '92400E',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // 2. Header Table (Agency & Republic Header)
  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 45, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: (cfg.parentName || '[Cán bộ bổ sung tên cơ quan chủ quản]').toUpperCase(),
                    size: 22,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: (cfg.name || '[Cán bộ bổ sung tên cơ quan ban hành]').toUpperCase(),
                    bold: true,
                    size: 24,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `Số: .....${cfg.docSymbolPrefix || '/PRS-TTHC'}`,
                    italics: true,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 55, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
                    bold: true,
                    size: 22,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Độc lập - Tự do - Hạnh phúc',
                    bold: true,
                    size: 24,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: '-------------------',
                    bold: true,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `${cfg.location || '[Cán bộ bổ sung địa danh]'}, ngày ..... tháng ..... năm 202...`,
                    italics: true,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // 3. Document Title
  const titleParagraphs = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'PHIẾU RÀ SOÁT NỘI BỘ HỒ SƠ CẤP GIẤY CHỨNG NHẬN',
          bold: true,
          size: 28,
        }),
      ],
      spacing: { before: 240, after: 40 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'QUYỀN SỬ DỤNG ĐẤT LẦN ĐẦU',
          bold: true,
          size: 28,
        }),
      ],
      spacing: { after: 240 },
    }),
  ];

  // 4. Checklist Table
  const checklistItems: string[] = Array.isArray(payload.officerChecklist)
    ? payload.officerChecklist
    : [];

  const checklistRows = checklistItems.map((item, index) => {
    return new TableRow({
      children: [
        new TableCell({
          width: { size: 8, type: WidthType.PERCENTAGE },
          margins: { top: 100, bottom: 100, left: 100, right: 100 },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${index + 1}` })] })],
        }),
        new TableCell({
          width: { size: 52, type: WidthType.PERCENTAGE },
          margins: { top: 100, bottom: 100, left: 100, right: 100 },
          children: [new Paragraph({ children: [new TextRun({ text: item })] })],
        }),
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          margins: { top: 100, bottom: 100, left: 100, right: 100 },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '[  ] Đạt\n[  ] Bổ sung', size: 18 })] })],
        }),
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          margins: { top: 100, bottom: 100, left: 100, right: 100 },
          children: [new Paragraph({ children: [new TextRun({ text: '' })] })],
        }),
      ],
    });
  });

  const checklistTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      left: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      right: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
    },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            width: { size: 8, type: WidthType.PERCENTAGE },
            shading: { fill: 'F1F5F9', type: ShadingType.CLEAR, color: 'auto' },
            margins: { top: 120, bottom: 120, left: 100, right: 100 },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'TT', bold: true })] })],
          }),
          new TableCell({
            width: { size: 52, type: WidthType.PERCENTAGE },
            shading: { fill: 'F1F5F9', type: ShadingType.CLEAR, color: 'auto' },
            margins: { top: 120, bottom: 120, left: 100, right: 100 },
            children: [new Paragraph({ children: [new TextRun({ text: 'Nội dung rà soát / Kiểm tra', bold: true })] })],
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            shading: { fill: 'F1F5F9', type: ShadingType.CLEAR, color: 'auto' },
            margins: { top: 120, bottom: 120, left: 100, right: 100 },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Kết quả rà soát', bold: true })] })],
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            shading: { fill: 'F1F5F9', type: ShadingType.CLEAR, color: 'auto' },
            margins: { top: 120, bottom: 120, left: 100, right: 100 },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Ghi chú', bold: true })] })],
          }),
        ],
      }),
      ...checklistRows,
    ],
  });

  // 5. Signatures Table (Internal Staff only)
  const signaturesTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Nơi nhận:', bold: true, italics: true })],
              }),
              new Paragraph({
                children: [new TextRun({ text: '- Lưu: VT, HS TTHC;' })],
              }),
              new Paragraph({
                children: [new TextRun({ text: '- Cán bộ thụ lý;' })],
              }),
              new Paragraph({
                children: [new TextRun({ text: '- Lãnh đạo bộ phận (để báo cáo).' })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'CÁN BỘ THẨM TRA / RÀ SOÁT',
                    bold: true,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: '(Ký, ghi rõ họ tên)',
                    italics: true,
                  }),
                ],
                spacing: { after: 960 }, // Space for signature
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: caseItem.assignedTo?.fullName || '[Cán bộ rà soát ký nháy]',
                    bold: true,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  return new Document({
    sections: [
      {
        properties: {},
        children: [
          warningTable,
          new Paragraph({ spacing: { after: 200 } }),
          headerTable,
          ...titleParagraphs,

          // I. THÔNG TIN CHUNG HỒ SƠ
          createSectionHeader('I. THÔNG TIN CHUNG HỒ SƠ'),
          new Paragraph({ children: [new TextRun({ text: 'Mã hồ sơ: ', bold: true }), new TextRun({ text: caseItem.caseCode || '[Chưa ghi nhận]' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Loại thủ tục: ', bold: true }), new TextRun({ text: caseItem.procedureType?.name || 'Cấp GCN lần đầu' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Lĩnh vực: ', bold: true }), new TextRun({ text: 'Đất đai' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Người nộp đơn: ', bold: true }), new TextRun({ text: caseItem.applicantName || '[Cán bộ bổ sung/kiểm tra]' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Địa chỉ liên hệ: ', bold: true }), new TextRun({ text: caseItem.applicantAddress || '[Cán bộ bổ sung/kiểm tra]' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Số điện thoại: ', bold: true }), new TextRun({ text: caseItem.applicantPhone || '[Cán bộ bổ sung/kiểm tra]' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Ngày tiếp nhận: ', bold: true }), new TextRun({ text: caseItem.receivedAt ? new Date(caseItem.receivedAt).toLocaleDateString('vi-VN') : '[Cán bộ bổ sung/kiểm tra]' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Hạn giải quyết: ', bold: true }), new TextRun({ text: caseItem.dueDate ? new Date(caseItem.dueDate).toLocaleDateString('vi-VN') : '[Cán bộ bổ sung/kiểm tra]' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Cán bộ thụ lý: ', bold: true }), new TextRun({ text: caseItem.assignedTo?.fullName || '[Cán bộ bổ sung/kiểm tra]' })], spacing: { after: 180 } }),

          // II. TÓM TẮT PHÂN TÍCH TỪ TRỢ LÝ AI
          createSectionHeader('II. TÓM TẮT PHÂN TÍCH TỪ TRỢ LÝ AI'),
          new Paragraph({ children: [new TextRun({ text: payload.summary || 'Không có thông tin tóm tắt.' })], spacing: { after: 100 } }),
          new Paragraph({ children: [new TextRun({ text: 'Loại phân tích: ', bold: true }), new TextRun({ text: 'Rà soát cấp Giấy chứng nhận lần đầu (LAND_FIRST_CERTIFICATE_REVIEW)' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Mức độ tin cậy AI: ', bold: true }), new TextRun({ text: analysis.confidenceLevel || 'MEDIUM' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Thời điểm phân tích: ', bold: true }), new TextRun({ text: new Date(analysis.createdAt).toLocaleString('vi-VN') })], spacing: { after: 180 } }),

          // III. NHẬN DIỆN THÔNG TIN NGƯỜI SỬ DỤNG ĐẤT
          createSectionHeader('III. NHẬN DIỆN THÔNG TIN NGƯỜI SỬ DỤNG ĐẤT'),
          new Paragraph({ children: [new TextRun({ text: 'Họ tên / Chủ thể: ', bold: true }), new TextRun({ text: payload.applicantReview?.applicantName || caseItem.applicantName || '[Chưa ghi nhận]' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Tình trạng nhân thân: ', bold: true }), new TextRun({ text: payload.applicantReview?.identityInfoStatus || 'Cần xác minh đối chiếu CCCD bản gốc.' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Địa chỉ liên hệ: ', bold: true }), new TextRun({ text: payload.applicantReview?.addressStatus || caseItem.applicantAddress || '[Chưa ghi nhận]' })], spacing: { after: 100 } }),
          createSubHeader('Nội dung cán bộ cần kiểm tra / xác minh:'),
          ...createBulletList(payload.applicantReview?.issuesToVerify),

          // IV. NHẬN DIỆN THÔNG TIN THỬA ĐẤT
          createSectionHeader('IV. NHẬN DIỆN THÔNG TIN THỬA ĐẤT'),
          new Paragraph({ children: [new TextRun({ text: 'Số thửa / Tờ bản đồ: ', bold: true }), new TextRun({ text: `Thửa số ${payload.landParcelReview?.parcelNumber || '[...]'} / Tờ bản đồ số ${payload.landParcelReview?.mapSheetNumber || '[...]'}` })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Vị trí thửa đất: ', bold: true }), new TextRun({ text: payload.landParcelReview?.location || '[Cán bộ kiểm tra thực địa]' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Diện tích / Loại đất: ', bold: true }), new TextRun({ text: `${payload.landParcelReview?.area || '[...]'} • ${payload.landParcelReview?.landUseType || '[...]'}` })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Tình trạng ranh giới: ', bold: true }), new TextRun({ text: payload.landParcelReview?.boundaryStatus || 'Cần đối chiếu bản đồ địa chính.' })], spacing: { after: 100 } }),
          createSubHeader('Điểm cần đối chiếu thực địa & hồ sơ kỹ thuật:'),
          ...createBulletList(payload.landParcelReview?.issuesToVerify),

          // V. NGUỒN GỐC & THỜI ĐIỂM SỬ DỤNG ĐẤT
          createSectionHeader('V. NGUỒN GỐC & THỜI ĐIỂM SỬ DỤNG ĐẤT'),
          new Paragraph({ children: [new TextRun({ text: 'Nguồn gốc khai báo: ', bold: true }), new TextRun({ text: payload.originAndUseHistoryReview?.declaredOrigin || '[Cán bộ bổ sung/kiểm tra]' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Thời điểm bắt đầu sử dụng: ', bold: true }), new TextRun({ text: payload.originAndUseHistoryReview?.declaredUseStartTime || '[Cán bộ bổ sung/kiểm tra]' })], spacing: { after: 100 } }),
          createSubHeader('Giấy tờ chứng minh liên quan:'),
          ...createBulletList(payload.originAndUseHistoryReview?.supportingDocuments),
          createSubHeader('Rủi ro lịch sử sử dụng cần lưu ý:'),
          ...createBulletList(payload.originAndUseHistoryReview?.riskFlags),
          createSubHeader('Nội dung cần thẩm tra / bổ sung căn cứ:'),
          ...createBulletList(payload.originAndUseHistoryReview?.issuesToVerify),

          // VI. KIỂM TRA THÀNH PHẦN HỒ SƠ
          createSectionHeader('VI. KIỂM TRA THÀNH PHẦN HỒ SƠ'),
          createSubHeader('1. Tài liệu đã nhận diện trong hồ sơ:'),
          ...createBulletList(payload.documentCompletenessReview?.detectedDocuments),
          createSubHeader('2. Tài liệu còn thiếu / Cần đối chiếu bản gốc:'),
          ...createBulletList(payload.documentCompletenessReview?.missingOrNeedCheckDocuments),
          createSubHeader('3. Đề xuất yêu cầu công dân bổ sung:'),
          ...createBulletList(payload.documentCompletenessReview?.recommendSupplementDocuments),

          // VII. QUY HOẠCH, TRANH CHẤP & HIỆN TRẠNG SỬ DỤNG
          createSectionHeader('VII. QUY HOẠCH, TRANH CHẤP & HIỆN TRẠNG SỬ DỤNG'),
          createSubHeader('Quy hoạch & Kế hoạch sử dụng đất cần rà soát:'),
          ...createBulletList(payload.planningDisputeAndCurrentStatusReview?.planningNeedCheck),
          createSubHeader('Khiếu nại, tranh chấp đất đai tại địa phương:'),
          ...createBulletList(payload.planningDisputeAndCurrentStatusReview?.disputeNeedCheck),
          createSubHeader('Hiện trạng sử dụng đất & ranh giới thực tế:'),
          ...createBulletList(payload.planningDisputeAndCurrentStatusReview?.currentUseNeedCheck),
          createSubHeader('Tài sản gắn liền với đất (nhà ở, công trình):'),
          ...createBulletList(payload.planningDisputeAndCurrentStatusReview?.attachedAssetsNeedCheck),
          new Paragraph({
            children: [
              new TextRun({ text: 'Ghi chú tài chính / Tiền sử dụng đất: ', bold: true }),
              new TextRun({ text: payload.financialObligationNotice?.message || 'Phase này chỉ cảnh báo nội dung cần kiểm tra, không lập bảng tính tiền sử dụng đất.' }),
            ],
            spacing: { before: 100, after: 180 },
          }),

          // VIII. RỦI RO & KHUYẾN NGHỊ CHUYÊN MÔN
          createSectionHeader('VIII. RỦI RO & KHUYẾN NGHỊ CHUYÊN MÔN'),
          createSubHeader('Rủi ro pháp lý cần lưu ý:'),
          ...createBulletList(payload.riskFlags),
          createSubHeader('Khuyến nghị hướng giải quyết cho cán bộ:'),
          ...createBulletList(payload.recommendations),
          createSubHeader('Căn cứ pháp lý áp dụng rà soát:'),
          ...createBulletList(payload.legalBasisToCheck),
          new Paragraph({
            children: [
              new TextRun({ text: 'Cơ quan / Bộ phận cần phối hợp: ', bold: true }),
              new TextRun({ text: 'UBND cấp xã nơi có đất, Văn phòng đăng ký đất đai / Chi nhánh VPĐKĐĐ, Phòng Tài nguyên và Môi trường.' }),
            ],
            spacing: { before: 100, after: 180 },
          }),

          // IX. CÂU HỎI GỢI Ý YÊU CẦU NGƯỜI DÂN BỔ SUNG / GIẢI TRÌNH
          createSectionHeader('IX. CÂU HỎI GỢI Ý YÊU CẦU NGƯỜI DÂN BỔ SUNG / GIẢI TRÌNH'),
          ...createBulletList(payload.recommendedNextQuestions),

          // X. CHECKLIST GỢI Ý CHO CÁN BỘ THỤ LÝ
          createSectionHeader('X. CHECKLIST GỢI Ý CHO CÁN BỘ THỤ LÝ'),
          new Paragraph({
            children: [
              new TextRun({ text: 'Cán bộ thụ lý sử dụng bảng dưới đây để đánh dấu tiến độ kiểm tra thực tế hồ sơ:', italics: true }),
            ],
            spacing: { after: 120 },
          }),
          checklistTable,
          new Paragraph({ spacing: { after: 240 } }),

          // XI. TRÁCH NHIỆM & KÝ NHÁY NỘI BỘ
          createSectionHeader('XI. TRÁCH NHIỆM & KÝ NHÁY NỘI BỘ'),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Ghi chú trách nhiệm: ',
                bold: true,
                color: '92400E',
              }),
              new TextRun({
                text: 'Cán bộ chuyên môn có trách nhiệm kiểm tra, đối chiếu hồ sơ gốc, căn cứ pháp luật, dữ liệu địa chính, quy hoạch/kế hoạch sử dụng đất và quy trình nội bộ trước khi tham mưu xử lý.',
                italics: true,
                color: '334155',
              }),
            ],
            spacing: { after: 240 },
          }),
          signaturesTable,
        ],
      },
    ],
  });
}

export function buildLandUsePurposeChangeReviewDocx(
  caseItem: any,
  analysis: any,
  config?: AgencyConfig,
): Document {
  const cfg = config || getAgencyConfig();
  const payload = analysis.outputPayload || {};

  // Helper for bullet list
  const createBulletList = (items?: string[], fallback = 'Không có thông tin ghi nhận.') => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return [
        new Paragraph({
          children: [new TextRun({ text: `- ${fallback}`, italics: true, color: '64748B' })],
          spacing: { after: 60 },
        }),
      ];
    }
    return items.map(
      (item) =>
        new Paragraph({
          children: [new TextRun({ text: `• ${item}` })],
          spacing: { after: 60 },
          indent: { left: 360 },
        }),
    );
  };

  // Helper for section header
  const createSectionHeader = (title: string) => {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          color: '1E3A8A', // Dark blue
          size: 24,
        }),
      ],
      spacing: { before: 240, after: 120 },
    });
  };

  // Helper for subheader
  const createSubHeader = (title: string) => {
    return new Paragraph({
      children: [
        new TextRun({
          text: title,
          bold: true,
          color: '334155',
        }),
      ],
      spacing: { before: 120, after: 60 },
    });
  };

  // 1. Warning Banner Table
  const warningTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 8, color: 'D97706' },
      bottom: { style: BorderStyle.SINGLE, size: 8, color: 'D97706' },
      left: { style: BorderStyle.SINGLE, size: 8, color: 'D97706' },
      right: { style: BorderStyle.SINGLE, size: 8, color: 'D97706' },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: 'FEF3C7', type: ShadingType.CLEAR, color: 'auto' },
            margins: { top: 160, bottom: 160, left: 160, right: 160 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: '⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA',
                    bold: true,
                    size: 24,
                    color: 'B45309',
                  }),
                ],
                spacing: { after: 80 },
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Phiếu này là tài liệu hỗ trợ rà soát nội bộ, không phải văn bản kết luận, không thay thế ý kiến thẩm tra của cán bộ chuyên môn và không phải văn bản phát hành cho công dân.',
                    italics: true,
                    size: 20,
                    color: '92400E',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // 2. Header Table (Agency & Republic Header)
  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 45, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: (cfg.parentName || '[Cán bộ bổ sung tên cơ quan chủ quản]').toUpperCase(),
                    size: 22,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: (cfg.name || '[Cán bộ bổ sung tên cơ quan ban hành]').toUpperCase(),
                    bold: true,
                    size: 22,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `Số: .....${cfg.docSymbolPrefix || '/PRS-TTHC'}`,
                    italics: true,
                  }),
                ],
                spacing: { after: 120 },
              }),
            ],
          }),
          new TableCell({
            width: { size: 55, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
                    bold: true,
                    size: 22,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Độc lập - Tự do - Hạnh phúc',
                    bold: true,
                    size: 22,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: '-------------------',
                    bold: true,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `${cfg.location || '[Cán bộ bổ sung địa danh]'}, ngày ..... tháng ..... năm 202...`,
                    italics: true,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // 3. Document Title
  const titleParagraphs = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'PHIẾU RÀ SOÁT NỘI BỘ HỒ SƠ',
          bold: true,
          size: 28,
        }),
      ],
      spacing: { before: 240, after: 40 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'CHUYỂN MỤC ĐÍCH SỬ DỤNG ĐẤT',
          bold: true,
          size: 28,
        }),
      ],
      spacing: { after: 240 },
    }),
  ];

  // 4. Checklist Table
  const checklistItems: string[] = Array.isArray(payload.officerChecklist)
    ? payload.officerChecklist
    : [];

  const checklistRows = checklistItems.map((item, index) => {
    return new TableRow({
      children: [
        new TableCell({
          width: { size: 8, type: WidthType.PERCENTAGE },
          margins: { top: 100, bottom: 100, left: 100, right: 100 },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${index + 1}` })] })],
        }),
        new TableCell({
          width: { size: 52, type: WidthType.PERCENTAGE },
          margins: { top: 100, bottom: 100, left: 100, right: 100 },
          children: [new Paragraph({ children: [new TextRun({ text: item })] })],
        }),
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          margins: { top: 100, bottom: 100, left: 100, right: 100 },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '[  ] Đạt\n[  ] Bổ sung', size: 18 })] })],
        }),
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          margins: { top: 100, bottom: 100, left: 100, right: 100 },
          children: [new Paragraph({ children: [new TextRun({ text: '' })] })],
        }),
      ],
    });
  });

  const checklistTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      left: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      right: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
    },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            width: { size: 8, type: WidthType.PERCENTAGE },
            shading: { fill: 'F1F5F9', type: ShadingType.CLEAR, color: 'auto' },
            margins: { top: 120, bottom: 120, left: 100, right: 100 },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'TT', bold: true })] })],
          }),
          new TableCell({
            width: { size: 52, type: WidthType.PERCENTAGE },
            shading: { fill: 'F1F5F9', type: ShadingType.CLEAR, color: 'auto' },
            margins: { top: 120, bottom: 120, left: 100, right: 100 },
            children: [new Paragraph({ children: [new TextRun({ text: 'Nội dung rà soát / Kiểm tra', bold: true })] })],
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            shading: { fill: 'F1F5F9', type: ShadingType.CLEAR, color: 'auto' },
            margins: { top: 120, bottom: 120, left: 100, right: 100 },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Kết quả rà soát', bold: true })] })],
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            shading: { fill: 'F1F5F9', type: ShadingType.CLEAR, color: 'auto' },
            margins: { top: 120, bottom: 120, left: 100, right: 100 },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Ghi chú', bold: true })] })],
          }),
        ],
      }),
      ...checklistRows,
    ],
  });

  // 5. Signatures Table (Internal Staff only)
  const signaturesTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Nơi nhận:', bold: true, italics: true })],
              }),
              new Paragraph({
                children: [new TextRun({ text: '- Lưu: VT, HS TTHC;' })],
              }),
              new Paragraph({
                children: [new TextRun({ text: '- Cán bộ thụ lý;' })],
              }),
              new Paragraph({
                children: [new TextRun({ text: '- Lãnh đạo bộ phận (để báo cáo).' })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'CÁN BỘ THẨM TRA / RÀ SOÁT',
                    bold: true,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: '(Ký, ghi rõ họ tên)',
                    italics: true,
                  }),
                ],
                spacing: { after: 960 }, // Space for signature
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: caseItem.assignedTo?.fullName || '[Cán bộ rà soát ký nháy]',
                    bold: true,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  return new Document({
    sections: [
      {
        properties: {},
        children: [
          warningTable,
          new Paragraph({ spacing: { after: 200 } }),
          headerTable,
          ...titleParagraphs,

          // I. THÔNG TIN CHUNG HỒ SƠ
          createSectionHeader('I. THÔNG TIN CHUNG HỒ SƠ'),
          new Paragraph({ children: [new TextRun({ text: 'Mã hồ sơ: ', bold: true }), new TextRun({ text: caseItem.caseCode || '[Chưa ghi nhận]' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Loại thủ tục: ', bold: true }), new TextRun({ text: caseItem.procedureType?.name || 'Chuyển mục đích sử dụng đất' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Lĩnh vực: ', bold: true }), new TextRun({ text: 'Đất đai' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Người nộp đơn: ', bold: true }), new TextRun({ text: caseItem.applicantName || '[Cán bộ bổ sung/kiểm tra]' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Địa chỉ liên hệ: ', bold: true }), new TextRun({ text: caseItem.applicantAddress || '[Cán bộ bổ sung/kiểm tra]' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Số điện thoại: ', bold: true }), new TextRun({ text: caseItem.applicantPhone || '[Cán bộ bổ sung/kiểm tra]' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Ngày tiếp nhận: ', bold: true }), new TextRun({ text: caseItem.receivedAt ? new Date(caseItem.receivedAt).toLocaleDateString('vi-VN') : '[Cán bộ bổ sung/kiểm tra]' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Hạn giải quyết: ', bold: true }), new TextRun({ text: caseItem.dueDate ? new Date(caseItem.dueDate).toLocaleDateString('vi-VN') : '[Cán bộ bổ sung/kiểm tra]' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Cán bộ thụ lý: ', bold: true }), new TextRun({ text: caseItem.assignedTo?.fullName || '[Cán bộ bổ sung/kiểm tra]' })], spacing: { after: 180 } }),

          // II. TÓM TẮT PHÂN TÍCH TỪ TRỢ LÝ AI
          createSectionHeader('II. TÓM TẮT PHÂN TÍCH TỪ TRỢ LÝ AI'),
          new Paragraph({ children: [new TextRun({ text: payload.summary || 'Không có thông tin tóm tắt.' })], spacing: { after: 100 } }),
          new Paragraph({ children: [new TextRun({ text: 'Loại phân tích: ', bold: true }), new TextRun({ text: 'Rà soát chuyển mục đích sử dụng đất (LAND_USE_PURPOSE_CHANGE_REVIEW)' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Mức độ tin cậy AI: ', bold: true }), new TextRun({ text: analysis.confidenceLevel || 'MEDIUM' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Thời điểm phân tích: ', bold: true }), new TextRun({ text: new Date(analysis.createdAt).toLocaleString('vi-VN') })], spacing: { after: 180 } }),

          // III. NHẬN DIỆN THÔNG TIN NGƯỜI SỬ DỤNG ĐẤT
          createSectionHeader('III. NHẬN DIỆN THÔNG TIN NGƯỜI SỬ DỤNG ĐẤT'),
          new Paragraph({ children: [new TextRun({ text: 'Họ tên / Chủ thể: ', bold: true }), new TextRun({ text: payload.applicantReview?.applicantName || caseItem.applicantName || '[Chưa ghi nhận]' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Tình trạng nhân thân: ', bold: true }), new TextRun({ text: payload.applicantReview?.identityInfoStatus || 'Cần xác minh đối chiếu CCCD/Giấy tờ pháp lý bản gốc.' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Địa chỉ liên hệ: ', bold: true }), new TextRun({ text: payload.applicantReview?.addressStatus || caseItem.applicantAddress || '[Chưa ghi nhận]' })], spacing: { after: 100 } }),
          createSubHeader('Nội dung cán bộ cần kiểm tra / xác minh:'),
          ...createBulletList(payload.applicantReview?.issuesToVerify),

          // IV. NHẬN DIỆN THÔNG TIN THỬA ĐẤT
          createSectionHeader('IV. NHẬN DIỆN THÔNG TIN THỬA ĐẤT'),
          new Paragraph({ children: [new TextRun({ text: 'Số thửa / Tờ bản đồ: ', bold: true }), new TextRun({ text: `Thửa số ${payload.landParcelReview?.parcelNumber || '[...]'} / Tờ bản đồ số ${payload.landParcelReview?.mapSheetNumber || '[...]'}` })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Địa chỉ thửa đất: ', bold: true }), new TextRun({ text: payload.landParcelReview?.location || '[Cán bộ kiểm tra thực địa]' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Diện tích toàn thửa: ', bold: true }), new TextRun({ text: payload.landParcelReview?.totalArea || payload.landParcelReview?.area || '[...]' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Diện tích xin chuyển mục đích: ', bold: true }), new TextRun({ text: payload.landParcelReview?.areaRequestedForChange || payload.purposeChangeReview?.requestedArea || '[...]' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Loại đất hiện tại: ', bold: true }), new TextRun({ text: payload.landParcelReview?.landUseType || payload.purposeChangeReview?.currentLandUseType || '[...]' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Mục đích xin chuyển sang: ', bold: true }), new TextRun({ text: payload.purposeChangeReview?.requestedLandUseType || '[...]' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Tình trạng ranh giới / Hiện trạng: ', bold: true }), new TextRun({ text: payload.landParcelReview?.boundaryStatus || 'Cần đối chiếu bản đồ địa chính và thực tế.' })], spacing: { after: 100 } }),
          createSubHeader('Điểm cần cán bộ kiểm tra / xác minh:'),
          ...createBulletList(payload.landParcelReview?.issuesToVerify),

          // V. LOẠI ĐẤT HIỆN TẠI VÀ MỤC ĐÍCH XIN CHUYỂN
          createSectionHeader('V. LOẠI ĐẤT HIỆN TẠI VÀ MỤC ĐÍCH XIN CHUYỂN'),
          new Paragraph({ children: [new TextRun({ text: 'Loại đất hiện tại: ', bold: true }), new TextRun({ text: payload.purposeChangeReview?.currentLandUseType || '[...]' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Mục đích xin chuyển: ', bold: true }), new TextRun({ text: payload.purposeChangeReview?.requestedLandUseType || '[...]' })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: 'Diện tích xin chuyển: ', bold: true }), new TextRun({ text: payload.purposeChangeReview?.requestedArea || '[...]' })], spacing: { after: 100 } }),
          createSubHeader('Nội dung cần đối chiếu quy hoạch / kế hoạch sử dụng đất:'),
          ...createBulletList(payload.purposeChangeReview?.planningCompatibility || payload.planningAndCurrentStatusReview?.planningNeedCheck),
          createSubHeader('Nội dung cần kiểm tra về nhu cầu sử dụng đất:'),
          ...createBulletList(payload.purposeChangeReview?.needForLandUseCheck || payload.purposeChangeReview?.eligibilityIssuesToVerify),
          createSubHeader('Nội dung cần kiểm tra về điều kiện chuyển mục đích:'),
          ...createBulletList(payload.purposeChangeReview?.eligibilityIssuesToVerify),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Lưu ý: Không kết luận đủ điều kiện hay không đủ điều kiện chuyển mục đích sử dụng đất; cán bộ thẩm định chịu trách nhiệm kiểm tra chi tiết theo quy định.',
                italics: true,
                color: '64748B',
              }),
            ],
            spacing: { before: 100, after: 180 },
          }),

          // VI. KIỂM TRA THÀNH PHẦN HỒ SƠ
          createSectionHeader('VI. KIỂM TRA THÀNH PHẦN HỒ SƠ'),
          createSubHeader('1. Tài liệu đã nhận diện trong hồ sơ:'),
          ...createBulletList(payload.documentCompletenessReview?.detectedDocuments),
          createSubHeader('2. Tài liệu còn thiếu / Cần đối chiếu bản gốc:'),
          ...createBulletList(payload.documentCompletenessReview?.missingOrNeedCheckDocuments),
          createSubHeader('3. Đề xuất yêu cầu công dân bổ sung:'),
          ...createBulletList(payload.documentCompletenessReview?.recommendSupplementDocuments),

          // VII. QUY HOẠCH, KẾ HOẠCH SỬ DỤNG ĐẤT, HIỆN TRẠNG
          createSectionHeader('VII. QUY HOẠCH, KẾ HOẠCH SỬ DỤNG ĐẤT, HIỆN TRẠNG'),
          createSubHeader('Nội dung cần kiểm tra về quy hoạch / kế hoạch sử dụng đất:'),
          ...createBulletList(payload.planningAndCurrentStatusReview?.planningNeedCheck),
          createSubHeader('Nội dung cần kiểm tra về hiện trạng sử dụng đất:'),
          ...createBulletList(payload.planningAndCurrentStatusReview?.currentUseNeedCheck),
          createSubHeader('Nội dung cần kiểm tra về tranh chấp / khiếu nại:'),
          ...createBulletList(payload.planningAndCurrentStatusReview?.disputeNeedCheck),
          createSubHeader('Nội dung cần kiểm tra về ranh giới, diện tích:'),
          ...createBulletList(payload.planningAndCurrentStatusReview?.boundaryAreaNeedCheck),
          createSubHeader('Nội dung cần kiểm tra về hành lang bảo vệ, đất công, lấn chiếm:'),
          ...createBulletList(payload.planningAndCurrentStatusReview?.publicLandOrCorridorNeedCheck || payload.planningAndCurrentStatusReview?.boundaryAreaNeedCheck),

          // VIII. NGHĨA VỤ TÀI CHÍNH CẦN KIỂM TRA
          createSectionHeader('VIII. NGHĨA VỤ TÀI CHÍNH CẦN KIỂM TRA'),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Ghi chú trọng yếu: Phase này không lập bảng tính tiền sử dụng đất, không đưa ra số tiền phải nộp hoặc kết luận tài chính.',
                bold: true,
                color: 'B45309',
              }),
            ],
            spacing: { after: 120 },
          }),
          createSubHeader('Dữ liệu cần chuẩn bị cho phase nghĩa vụ tài chính:'),
          ...createBulletList(
            payload.financialObligationNotice?.dataNeededForLaterPhase || [
              'Diện tích xin chuyển mục đích;',
              'Loại đất trước khi chuyển (nguồn gốc, thời hạn);',
              'Mục đích sau khi chuyển;',
              'Nguồn gốc đất và thời điểm bắt đầu sử dụng;',
              'Bảng giá đất / Giá đất cụ thể tại thời điểm quyết định;',
              'Các khoản miễn, giảm tiền sử dụng đất (nếu có).',
            ],
          ),

          // IX. RỦI RO CẦN LƯU Ý
          createSectionHeader('IX. RỦI RO CẦN LƯU Ý'),
          createSubHeader('Danh sách rủi ro & cảnh báo:'),
          ...createBulletList(payload.riskFlags),

          // X. KHUYẾN NGHỊ CHUYÊN MÔN
          createSectionHeader('X. KHUYẾN NGHỊ CHUYÊN MÔN'),
          createSubHeader('Khuyến nghị cán bộ cần kiểm tra:'),
          ...createBulletList(payload.recommendations),
          new Paragraph({
            children: [
              new TextRun({ text: 'Cơ quan / Bộ phận cần phối hợp: ', bold: true }),
              new TextRun({ text: 'UBND cấp xã nơi có đất, Văn phòng đăng ký đất đai / Chi nhánh VPĐKĐĐ, Phòng Tài nguyên và Môi trường, Cơ quan Thuế.' }),
            ],
            spacing: { before: 100, after: 100 },
          }),
          createSubHeader('Căn cứ pháp lý áp dụng rà soát:'),
          ...createBulletList(payload.legalBasisToCheck),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Lưu ý: Căn cứ pháp lý cần cán bộ kiểm tra, đối chiếu văn bản hiện hành, văn bản sửa đổi/bổ sung/thay thế nếu có và quy trình nội bộ địa phương tại thời điểm xử lý hồ sơ. Tuyệt đối không kết luận được hay không được chuyển mục đích.',
                italics: true,
                color: '92400E',
              }),
            ],
            spacing: { before: 100, after: 180 },
          }),

          // XI. CÂU HỎI GỢI Ý YÊU CẦU CÔNG DÂN GIẢI TRÌNH/BỔ SUNG
          createSectionHeader('XI. CÂU HỎI GỢI Ý YÊU CẦU CÔNG DÂN GIẢI TRÌNH/BỔ SUNG'),
          ...createBulletList(payload.recommendedNextQuestions),

          // XII. CHECKLIST GỢI Ý CHO CÁN BỘ THỤ LÝ
          createSectionHeader('XII. CHECKLIST GỢI Ý CHO CÁN BỘ THỤ LÝ'),
          new Paragraph({
            children: [
              new TextRun({ text: 'Cán bộ thụ lý sử dụng bảng dưới đây để đánh dấu tiến độ kiểm tra thực tế hồ sơ:', italics: true }),
            ],
            spacing: { after: 120 },
          }),
          checklistTable,
          new Paragraph({ spacing: { after: 240 } }),

          // XIII. TRÁCH NHIỆM & KÝ NHÁY NỘI BỘ
          createSectionHeader('XIII. TRÁCH NHIỆM & KÝ NHÁY NỘI BỘ'),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Ghi chú trách nhiệm: ',
                bold: true,
                color: '92400E',
              }),
              new TextRun({
                text: 'Cán bộ chuyên môn có trách nhiệm kiểm tra, đối chiếu hồ sơ gốc, căn cứ pháp luật hiện hành, văn bản sửa đổi/bổ sung/thay thế nếu có, dữ liệu địa chính, quy hoạch/kế hoạch sử dụng đất và quy trình nội bộ trước khi tham mưu xử lý.',
                italics: true,
                color: '334155',
              }),
            ],
            spacing: { after: 240 },
          }),
          signaturesTable,
        ],
      },
    ],
  });
}

