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
} from 'docx';
import { AgencyConfig, getAgencyConfig } from '../config/agency.config';

export type TemplateGroup = 'INTERNAL_NOTE' | 'NAMED_DOC' | 'OFFICIAL_LETTER' | 'DEFAULT';

export function identifyTemplateGroup(noteContent: string): {
  templateGroup: TemplateGroup;
  draftTitle: string;
  draftBody: string;
} {
  const prefixMatch = noteContent.match(/^\[AI Dự thảo - (.*?)\]\s*(.*)$/s);
  const rawTitle = prefixMatch ? prefixMatch[1].trim() : 'Văn bản dự thảo';
  const draftBody = prefixMatch ? prefixMatch[2].trim() : noteContent.trim();

  let templateGroup: TemplateGroup = 'DEFAULT';
  const lowerTitle = rawTitle.toLowerCase();

  if (lowerTitle.includes('phiếu xử lý')) {
    templateGroup = 'INTERNAL_NOTE';
  } else if (lowerTitle.includes('giấy mời') || lowerTitle.includes('thông báo')) {
    templateGroup = 'NAMED_DOC';
  } else if (lowerTitle.includes('chuyển đơn') || lowerTitle.includes('trả lời')) {
    templateGroup = 'OFFICIAL_LETTER';
  }

  return {
    templateGroup,
    draftTitle: rawTitle.toUpperCase(),
    draftBody,
  };
}

function formatLineToParagraph(line: string): Paragraph {
  const parts = line.split(/(\[[^\]]+\])/g);
  const textRuns = parts.map((part) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      return new TextRun({
        text: part,
        bold: true,
        italics: true,
        color: 'D97706',
      });
    }
    return new TextRun({ text: part });
  });

  return new Paragraph({
    children: textRuns,
    spacing: { after: 120 },
  });
}

export function cleanDraftBodyLines(draftTitle: string, draftBody: string): string[] {
  const rawLines = draftBody.split('\n');
  const ignorePatterns = [
    /BẢN NHÁP AI/i,
    /Cán bộ phải kiểm tra/i,
    /^CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM$/i,
    /^Độc lập - Tự do - Hạnh phúc$/i,
    /^-------------------$/,
    /^PHIẾU ĐỀ XUẤT XỬ LÝ ĐƠN$/i,
    /^GIẤY MỜI LÀM VIỆC$/i,
    /^THÔNG BÁO$/i,
    /^CONG VĂN$/i,
    /^CÔNG VĂN$/i,
    /^Nơi nhận:?$/i,
    /^- Như trên;?$/i,
    /^- Lưu: VT, Hồ sơ\.?$/i,
    /^CÁN BỘ THỤ LÝ$/i,
    /^\(Ký, ghi rõ họ tên\)$/i,
  ];

  const cleaned: string[] = [];
  for (const line of rawLines) {
    const trimmed = line.trim();
    if (!trimmed) {
      cleaned.push('');
      continue;
    }
    if (trimmed.toUpperCase() === draftTitle.toUpperCase()) continue;
    let shouldIgnore = false;
    for (const pat of ignorePatterns) {
      if (pat.test(trimmed)) {
        shouldIgnore = true;
        break;
      }
    }
    if (shouldIgnore) continue;
    cleaned.push(line);
  }
  return cleaned;
}

export function buildDocxDocument(
  templateGroup: TemplateGroup,
  draftTitle: string,
  draftBody: string,
  config?: AgencyConfig,
): Document {
  const cfg = config || getAgencyConfig();

  // 1. Warning Banner Table
  const warningTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: 'D97706' },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: 'D97706' },
      left: { style: BorderStyle.SINGLE, size: 6, color: 'D97706' },
      right: { style: BorderStyle.SINGLE, size: 6, color: 'D97706' },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            margins: { top: 140, bottom: 140, left: 140, right: 140 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: '⚠️ BẢN NHÁP AI – CHƯA PHÁT HÀNH',
                    bold: true,
                    color: 'D97706',
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Cán bộ phải kiểm tra, chỉnh sửa và chịu trách nhiệm trước khi sử dụng.',
                    italics: true,
                    color: 'D97706',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // 2. Header Table Left Cell
  const leftCellParagraphs: Paragraph[] = [];

  if (cfg.parentName) {
    leftCellParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: cfg.parentName.toUpperCase(),
            size: 22,
          }),
        ],
      }),
    );
  } else {
    leftCellParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: '[Cán bộ bổ sung tên cơ quan chủ quản]',
            bold: true,
            italics: true,
            color: 'D97706',
            size: 22,
          }),
        ],
      }),
    );
  }

  if (cfg.name) {
    leftCellParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: cfg.name.toUpperCase(),
            bold: true,
            size: 24,
          }),
        ],
      }),
    );
  } else {
    leftCellParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: '[Cán bộ bổ sung tên cơ quan ban hành]',
            bold: true,
            italics: true,
            color: 'D97706',
            size: 24,
          }),
        ],
      }),
    );
  }

  if (cfg.docSymbolPrefix) {
    leftCellParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `Số: .....${cfg.docSymbolPrefix}`,
            italics: true,
          }),
        ],
      }),
    );
  } else {
    leftCellParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: '[Cán bộ bổ sung số, ký hiệu văn bản]',
            italics: true,
            color: 'D97706',
          }),
        ],
      }),
    );
  }

  if (templateGroup === 'OFFICIAL_LETTER') {
    leftCellParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: 'V/v: [Cán bộ bổ sung trích yếu nội dung]',
            italics: true,
            color: 'D97706',
          }),
        ],
      }),
    );
  }

  // Header Table Right Cell
  const rightCellParagraphs: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'Độc lập - Tự do - Hạnh phúc',
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: '-------------------' })],
    }),
  ];

  if (templateGroup === 'NAMED_DOC' || templateGroup === 'OFFICIAL_LETTER' || templateGroup === 'DEFAULT') {
    if (cfg.location) {
      rightCellParagraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: `${cfg.location}, ngày ... tháng ... năm 202...`,
              italics: true,
            }),
          ],
        }),
      );
    } else {
      rightCellParagraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: '[Cán bộ bổ sung địa danh, ngày tháng]',
              italics: true,
              color: 'D97706',
            }),
          ],
        }),
      );
    }
  }

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
            children: leftCellParagraphs,
          }),
          new TableCell({
            width: { size: 55, type: WidthType.PERCENTAGE },
            children: rightCellParagraphs,
          }),
        ],
      }),
    ],
  });

  // 3. Document Title / Subject Paragraphs
  const titleParagraphs: Paragraph[] = [];
  if (templateGroup === 'INTERNAL_NOTE' || templateGroup === 'NAMED_DOC' || templateGroup === 'DEFAULT') {
    titleParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: draftTitle,
            bold: true,
            size: 28,
          }),
        ],
        spacing: { before: 240, after: 240 },
      }),
    );
  } else if (templateGroup === 'OFFICIAL_LETTER') {
    titleParagraphs.push(new Paragraph({ spacing: { before: 240, after: 120 } }));
  }

  // 4. Body Paragraphs cleaning and parsing
  const cleanedLines = cleanDraftBodyLines(draftTitle, draftBody);
  const bodyParagraphs: Paragraph[] = [];
  for (const line of cleanedLines) {
    if (!line.trim()) {
      bodyParagraphs.push(new Paragraph({ spacing: { after: 120 } }));
    } else {
      bodyParagraphs.push(formatLineToParagraph(line));
    }
  }

  // 5. Footer Signature Table Left Cell
  const leftFooterParagraphs = [
    new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [new TextRun({ text: 'Nơi nhận:', bold: true, italics: true })],
    }),
  ];

  if (cfg.defaultRecipients && cfg.defaultRecipients.length > 0) {
    for (const r of cfg.defaultRecipients) {
      leftFooterParagraphs.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          children: [new TextRun({ text: r, italics: true })],
        }),
      );
    }
  } else {
    leftFooterParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            text: '[Cán bộ bổ sung nơi nhận]',
            bold: true,
            italics: true,
            color: 'D97706',
          }),
        ],
      }),
    );
  }

  // Footer Signature Table Right Cell
  const rightFooterParagraphs: Paragraph[] = [];

  if (templateGroup === 'INTERNAL_NOTE') {
    rightFooterParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'CÁN BỘ THỤ LÝ', bold: true })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: '(Ký, ghi rõ họ tên)', italics: true })],
      }),
    );
  } else {
    if (cfg.signerTitle) {
      const lines = cfg.signerTitle.split('\n').map((l) => l.trim()).filter(Boolean);
      for (const line of lines) {
        rightFooterParagraphs.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: line, bold: true })],
          }),
        );
      }
    } else {
      rightFooterParagraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: '[Cán bộ bổ sung chức danh người ký]',
              bold: true,
              italics: true,
              color: 'D97706',
            }),
          ],
        }),
      );
    }

    rightFooterParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: '(Ký, ghi rõ họ tên, đóng dấu)', italics: true })],
      }),
    );
  }

  rightFooterParagraphs.push(new Paragraph({ spacing: { after: 720 } }));

  if (cfg.signerName) {
    rightFooterParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: cfg.signerName, bold: true })],
      }),
    );
  } else {
    rightFooterParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: '[Cán bộ bổ sung họ tên người ký]',
            bold: true,
            italics: true,
            color: 'D97706',
          }),
        ],
      }),
    );
  }

  const footerTable = new Table({
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
            children: leftFooterParagraphs,
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: rightFooterParagraphs,
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
          new Paragraph({ spacing: { after: 240 } }),
          headerTable,
          ...titleParagraphs,
          ...bodyParagraphs,
          new Paragraph({ spacing: { after: 360 } }),
          footerTable,
        ],
      },
    ],
  });
}

