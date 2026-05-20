import { useState, useEffect, useCallback } from 'react';
import type { LegalCase } from '../types';
import { storage } from '../utils/storage';
import { generateCaseId } from '../utils/caseId';
import { defaultChecklists } from '../data/checklist';

export function useCases() {
  const [cases, setCases] = useState<LegalCase[]>([]);

  // Load from storage initially
  useEffect(() => {
    setCases(storage.getCases());
  }, []);

  const refresh = useCallback(() => {
    setCases(storage.getCases());
  }, []);

  const addCase = useCallback((newCaseData: Omit<LegalCase, 'id' | 'caseId' | 'checklist' | 'logs'>) => {
    const id = crypto.randomUUID();
    const caseId = generateCaseId();
    
    // Deep copy checklist to avoid referencing the default array directly
    const initialChecklist = JSON.parse(JSON.stringify(defaultChecklists[newCaseData.field] || defaultChecklists['Khác']));

    const newCase: LegalCase = {
      ...newCaseData,
      id,
      caseId,
      checklist: initialChecklist,
      logs: [
        {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          action: 'Tạo hồ sơ mới',
          user: newCaseData.assignee || 'Hệ thống',
        }
      ],
    };

    storage.addCase(newCase);
    refresh();
    return newCase;
  }, [refresh]);

  const updateCase = useCallback((updatedCase: LegalCase) => {
    storage.updateCase(updatedCase);
    refresh();
  }, [refresh]);

  const deleteCase = useCallback((id: string) => {
    storage.deleteCase(id);
    refresh();
  }, [refresh]);

  const replaceCases = useCallback((newCases: LegalCase[]) => {
    storage.saveCases(newCases);
    refresh();
  }, [refresh]);

  const updateStatus = useCallback((id: string, status: LegalCase['status'], user: string, note?: string) => {
    const currentCase = storage.getCaseById(id);
    if (!currentCase) return;

    const updatedCase = {
      ...currentCase,
      status,
      logs: [
        {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          action: `Cập nhật trạng thái thành: ${status}`,
          user,
          note,
        },
        ...currentCase.logs,
      ],
    };

    updateCase(updatedCase);
  }, [updateCase]);

  return {
    cases,
    addCase,
    updateCase,
    deleteCase,
    updateStatus,
    replaceCases,
    refresh,
  };
}
