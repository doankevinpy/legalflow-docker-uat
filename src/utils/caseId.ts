import { storage } from './storage';

const COUNTER_KEY = 'legalflow_case_counter';

/**
 * Lấy counter hiện tại từ localStorage, tự tăng và lưu lại.
 * Đảm bảo mã hồ sơ không bao giờ trùng lặp.
 */
const getNextSequence = (): number => {
  const stored = localStorage.getItem(COUNTER_KEY);
  let counter = stored ? parseInt(stored, 10) : 0;

  // Đảm bảo counter không nhỏ hơn số case hiện có (phòng trường hợp counter bị reset)
  const existingCases = storage.getCases();
  if (counter <= existingCases.length) {
    counter = existingCases.length;
  }

  counter += 1;
  localStorage.setItem(COUNTER_KEY, counter.toString());
  return counter;
};

export const generateCaseId = (): string => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
  const sequence = getNextSequence().toString().padStart(4, '0');
  
  return `HS-${year}${month}-${sequence}`;
};
