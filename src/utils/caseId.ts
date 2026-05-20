export const generateCaseId = (): string => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
  // Random 4-digit sequence for simplicity, as we don't have a reliable auto-increment without a backend
  const sequence = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `HS-${year}${month}-${sequence}`;
};
