import type { LegalCase } from '../types';

const STORAGE_KEY = 'legalflow_cases';

export const storage = {
  getCases: (): LegalCase[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return [];
    }
  },
  
  saveCases: (cases: LegalCase[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  },

  getCaseById: (id: string): LegalCase | undefined => {
    return storage.getCases().find((c) => c.id === id);
  },

  addCase: (newCase: LegalCase): void => {
    const cases = storage.getCases();
    storage.saveCases([newCase, ...cases]);
  },

  updateCase: (updatedCase: LegalCase): void => {
    const cases = storage.getCases();
    const index = cases.findIndex((c) => c.id === updatedCase.id);
    if (index !== -1) {
      cases[index] = updatedCase;
      storage.saveCases(cases);
    }
  },

  deleteCase: (id: string): void => {
    const cases = storage.getCases();
    storage.saveCases(cases.filter((c) => c.id !== id));
  }
};
