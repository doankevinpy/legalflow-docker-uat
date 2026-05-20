import type { LegalCase, CaseType } from '../types';

/**
 * Mapping loại đơn sang mã rút gọn
 */
const getTypeCode = (type: CaseType): string => {
  switch (type) {
    case 'Khiếu nại': return 'KN';
    case 'Tố cáo': return 'TC';
    case 'Kiến nghị': return 'KNG';
    case 'Phản ánh': return 'PA';
    case 'Tư vấn pháp lý': return 'TVPL';
    case 'Khác': return 'KHAC';
    default: return 'KHAC';
  }
};

/**
 * Parse mã hồ sơ mới xem có đúng format không
 */
export const parseCaseId = (caseId: string) => {
  // VD: 2026-KN-015-KP3 hoặc 2026-TVPL-001-KHAC
  const match = caseId.match(/^(\d{4})-([A-Z]+)-(\d+)-([A-Z0-9]+)$/);
  if (!match) return null;
  return {
    year: match[1],
    typeCode: match[2],
    sequence: parseInt(match[3], 10),
    neighborhoodCode: match[4]
  };
};

/**
 * Sinh mã hồ sơ mới theo cấu trúc: [YYYY]-[Mã loại đơn]-[Số thứ tự]-[Khu phố]
 * Bảm bảo không trùng lặp.
 */
export const generateCaseId = (
  type: CaseType | string,
  neighborhood: string,
  receivedDate: string,
  existingCases: LegalCase[]
): string => {
  // Fallback ngày nếu không hợp lệ
  let date = new Date();
  if (receivedDate) {
    const parsed = new Date(receivedDate);
    if (!isNaN(parsed.getTime())) {
      date = parsed;
    }
  }

  const year = date.getFullYear().toString();
  const typeCode = getTypeCode(type as CaseType);
  const neighborhoodCode = neighborhood === 'Khác' ? 'KHAC' : (neighborhood || 'KP3');

  // Lấy danh sách các số thứ tự trong cùng năm
  const sequencesInYear = existingCases
    .map(c => parseCaseId(c.caseId))
    .filter(parsed => parsed && parsed.year === year)
    .map(parsed => parsed!.sequence);

  let nextSequence = sequencesInYear.length > 0 ? Math.max(...sequencesInYear) + 1 : 1;

  // Vòng lặp chống trùng mã
  while (true) {
    // Format sequence: Ít nhất 3 chữ số, nếu hơn thì để nguyên
    const formattedSequence = nextSequence.toString().padStart(3, '0');
    const newCaseId = `${year}-${typeCode}-${formattedSequence}-${neighborhoodCode}`;
    
    // Kiểm tra xem mã này đã tồn tại chưa
    const exists = existingCases.some(c => c.caseId === newCaseId);
    if (!exists) {
      return newCaseId;
    }
    
    nextSequence++;
  }
};
