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
  // If line has brackets like [Cán bộ bổ sung...] or [...], format placeholders in orange bold italic
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

export function buildDocxDocument(
  templateGroup: TemplateGroup,
  draftTitle: string,
  draftBody: string,
): Document {
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

  // 2. Header Table
  const agencyRuns = [
    new TextRun({
      text: '[Cán bộ bổ sung tên cơ quan ban hành]',
      bold: true,
      italics: true,
      color: 'D97706',
    }),
  ];

  const leftCellParagraphs: Paragraph[] = [
    new Paragraph({ alignment: AlignmentType.CENTER, children: agencyRuns }),
  ];

  if (templateGroup === 'NAMED_DOC' || templateGroup === 'OFFICIAL_LETTER') {
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

  const bodyParagraphs: Paragraph[] = [];
  for (const line of rawLines) {
    const trimmed = line.trim();
    if (!trimmed) {
      bodyParagraphs.push(new Paragraph({ spacing: { after: 120 } }));
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

    bodyParagraphs.push(formatLineToParagraph(line));
  }

  // 5. Footer Signature Table
  const leftFooterParagraphs = [
    new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [new TextRun({ text: 'Nơi nhận:', bold: true, italics: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [new TextRun({ text: '- Như trên;', italics: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [new TextRun({ text: '- Lưu: VT, Hồ sơ.', italics: true })],
    }),
  ];

  const rightFooterParagraphs = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: templateGroup === 'INTERNAL_NOTE'
            ? 'CÁN BỘ THỤ LÝ'
            : '[Cán bộ bổ sung chức danh Lãnh đạo ký]',
          bold: true,
          color: templateGroup === 'INTERNAL_NOTE' ? undefined : 'D97706',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: templateGroup === 'INTERNAL_NOTE'
            ? '(Ký, ghi rõ họ tên)'
            : '(Ký, ghi rõ họ tên, đóng dấu)',
          italics: true,
        }),
      ],
    }),
    new Paragraph({ spacing: { after: 720 } }),
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
  ];

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
