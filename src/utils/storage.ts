import type { LegalCase } from '../types';
import { generateCaseId } from './caseId';

const STORAGE_KEY = 'legalflow_cases';
const BACKUP_KEY = 'legalflow_cases_backup_before_caseid_migration';
const MIGRATION_MARKER = 'legalflow_caseid_migration_v1_completed';

export const storage = {
  migrateCaseIdsIfNeeded: (): void => {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);
      if (!rawData) return;
      const cases: LegalCase[] = JSON.parse(rawData);
      
      const hasOldCases = cases.some(c => c.caseId?.startsWith('HS-'));
      const marker = localStorage.getItem(MIGRATION_MARKER);
      
      if (marker === 'true' && !hasOldCases) {
        return; // Idempotent check
      }
      
      if (!hasOldCases && cases.every(c => c.neighborhood)) {
        return; // Nothing to migrate
      }

      // Backup if not exists
      if (!localStorage.getItem(BACKUP_KEY)) {
        localStorage.setItem(BACKUP_KEY, rawData);
      }

      let migratedCount = 0;
      let unchangedCount = 0;
      const logMapping: string[] = [];

      const migratedCases: LegalCase[] = [];
      const idToMigrated = new Map<string, LegalCase>();

      // Process oldest first to assign smaller sequence to older cases
      const sortedCases = [...cases].sort((a, b) => new Date(a.receivedDate).getTime() - new Date(b.receivedDate).getTime());

      for (const c of sortedCases) {
        if (c.caseId?.startsWith('HS-')) {
          const oldCaseId = c.caseId;
          const neighborhood = c.neighborhood || 'KP3';
          const newCaseId = generateCaseId(c.type, neighborhood, c.receivedDate, migratedCases);
          
          const updatedCase = { ...c, caseId: newCaseId, neighborhood: neighborhood as any };
          migratedCases.push(updatedCase);
          idToMigrated.set(c.id, updatedCase);
          
          migratedCount++;
          logMapping.push(`${oldCaseId} -> ${newCaseId}`);
        } else {
          const neighborhood = c.neighborhood || 'KP3';
          const updatedCase = { ...c, neighborhood: neighborhood as any };
          migratedCases.push(updatedCase);
          idToMigrated.set(c.id, updatedCase);
          unchangedCount++;
        }
      }

      const finalCases = cases.map(c => idToMigrated.get(c.id)!);

      // Try to save and set marker
      localStorage.setItem(STORAGE_KEY, JSON.stringify(finalCases));
      localStorage.setItem(MIGRATION_MARKER, 'true');

      if (migratedCount > 0) {
        console.log('--- MIGRATION REPORT ---');
        console.log(`Tổng số hồ sơ: ${cases.length}`);
        console.log(`Số hồ sơ được migrate: ${migratedCount}`);
        console.log(`Số hồ sơ giữ nguyên: ${unchangedCount}`);
        console.log('Chi tiết mã cũ -> mã mới:');
        logMapping.forEach(m => console.log('  ' + m));
        console.log('------------------------');
      }
    } catch (e) {
      console.error('Migration failed. Marker not set.', e);
    }
  },

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
