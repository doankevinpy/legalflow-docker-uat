import { Document, Packer, Paragraph, TextRun, AlignmentType, convertInchesToTwip } from 'docx';
import { saveAs } from 'file-saver';

export async function exportToDocx(title: string, content: string, fileName: string) {
  // Split content by newlines
  const lines = content.split('\n');

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(0.75),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1.18), // ~3cm for standard Vietnamese documents
            },
          },
        },
        children: [
          // Content paragraphs
          ...lines.map((line) => {
            // Check if line is empty to avoid corrupted empty TextRun
            if (!line.trim()) {
              return new Paragraph({ spacing: { after: 120 } });
            }

            // Check if it's the header (CỘNG HÒA...)
            if (line.includes('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM') || line.includes('Độc lập - Tự do - Hạnh phúc') || line.includes('----------------------')) {
              return new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: line,
                    font: 'Times New Roman',
                    size: 26, // 13pt
                    bold: line.includes('CỘNG HÒA') || line.includes('Độc lập'),
                  }),
                ],
                spacing: { after: 120 },
              });
            }

            // Check if it's the main Title
            if (line === title || line.includes('PHIẾU') || line.includes('THÔNG BÁO') || line.includes('BẢN TÓM TẮT')) {
              return new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: line,
                    font: 'Times New Roman',
                    size: 28, // 14pt
                    bold: true,
                  }),
                ],
                spacing: { before: 240, after: 240 },
              });
            }

            // Normal lines
            return new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              children: [
                new TextRun({
                  text: line,
                  font: 'Times New Roman',
                  size: 28, // 14pt
                  bold: line.startsWith('Ông/Bà:') || line.startsWith('Kính gửi') || !!line.match(/^[0-9]\./),
                }),
              ],
              spacing: { after: 120 },
            });
          }),

          // Mandatory Warning Footer
          new Paragraph({
            spacing: { before: 400 }, // spacing before line
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: '--------------------------------------------------',
                font: 'Times New Roman',
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'LƯU Ý: Bản dự thảo, cần chuyên viên pháp lý kiểm tra trước khi sử dụng.',
                font: 'Times New Roman',
                size: 24, // 12pt
                italics: true,
                bold: true,
                color: 'FF0000', // Red color to stand out for specialists
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${fileName}.docx`);
}
