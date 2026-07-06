import { Test, TestingModule } from '@nestjs/testing';
import { ProcedureCasesController } from './procedure-cases.controller';
import { AdministrativeProceduresService } from './administrative-procedures.service';
import { ProcedureAiService } from './ai/procedure-ai.service';
import { ROLES_KEY } from '../common/roles.decorator';
import { Role } from '../common/role.enum';

describe('ProcedureCasesController', () => {
  let controller: ProcedureCasesController;

  const mockService = {
    createCase: jest.fn(),
    findAllCases: jest.fn(),
    findCaseById: jest.fn(),
    updateCase: jest.fn(),
    addNote: jest.fn(),
    addChecklist: jest.fn(),
    updateChecklist: jest.fn(),
  };

  const mockAiService = {
    reviewLandFirstCertificate: jest.fn(),
    reviewLandUsePurposeChange: jest.fn(),
    getAnalysesByCaseId: jest.fn(),
    getAnalysisLegalSnapshot: jest.fn(),
    acceptAnalysis: jest.fn(),
    rejectAnalysis: jest.fn(),
    exportReviewDocx: jest.fn(),
    getReviewPreviewData: jest.fn(),
    exportPurposeChangeReviewDocx: jest.fn(),
    getPurposeChangeReviewPreviewData: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProcedureCasesController],
      providers: [
        { provide: AdministrativeProceduresService, useValue: mockService },
        { provide: ProcedureAiService, useValue: mockAiService },
      ],
    }).compile();

    controller = module.get<ProcedureCasesController>(ProcedureCasesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Permission Guard Enforcement (RBAC)', () => {
    it('should enforce ADMIN, MANAGER, STAFF roles on AI review creation endpoints', () => {
      const landFirstRoles = Reflect.getMetadata(ROLES_KEY, controller.runLandFirstCertificateReview);
      expect(landFirstRoles).toEqual([Role.ADMIN, Role.MANAGER, Role.STAFF]);

      const purposeChangeRoles = Reflect.getMetadata(ROLES_KEY, controller.runLandUsePurposeChangeReview);
      expect(purposeChangeRoles).toEqual([Role.ADMIN, Role.MANAGER, Role.STAFF]);
    });

    it('should enforce ADMIN, MANAGER, STAFF roles on AI review accept/reject endpoints', () => {
      const acceptRoles = Reflect.getMetadata(ROLES_KEY, controller.acceptAiAnalysis);
      expect(acceptRoles).toEqual([Role.ADMIN, Role.MANAGER, Role.STAFF]);

      const rejectRoles = Reflect.getMetadata(ROLES_KEY, controller.rejectAiAnalysis);
      expect(rejectRoles).toEqual([Role.ADMIN, Role.MANAGER, Role.STAFF]);
    });

    it('should enforce ADMIN, MANAGER, STAFF roles on document export endpoints (blocking VIEWER)', () => {
      const exportReviewRoles = Reflect.getMetadata(ROLES_KEY, controller.exportReviewDocx);
      expect(exportReviewRoles).toEqual([Role.ADMIN, Role.MANAGER, Role.STAFF]);

      const exportPurposeRoles = Reflect.getMetadata(ROLES_KEY, controller.exportPurposeChangeReviewDocx);
      expect(exportPurposeRoles).toEqual([Role.ADMIN, Role.MANAGER, Role.STAFF]);
    });

    it('should allow VIEWER on read-only endpoints (preview data and listing)', () => {
      const getCasesRoles = Reflect.getMetadata(ROLES_KEY, controller.getCases);
      expect(getCasesRoles).toEqual([Role.ADMIN, Role.MANAGER, Role.STAFF, Role.VIEWER]);

      const previewReviewRoles = Reflect.getMetadata(ROLES_KEY, controller.getReviewPreviewData);
      expect(previewReviewRoles).toEqual([Role.ADMIN, Role.MANAGER, Role.STAFF, Role.VIEWER]);

      const previewPurposeRoles = Reflect.getMetadata(ROLES_KEY, controller.getPurposeChangeReviewPreviewData);
      expect(previewPurposeRoles).toEqual([Role.ADMIN, Role.MANAGER, Role.STAFF, Role.VIEWER]);
    });
  });

  describe('Controller Methods Execution', () => {
    it('runLandFirstCertificateReview should call aiService.reviewLandFirstCertificate', async () => {
      mockAiService.reviewLandFirstCertificate.mockResolvedValue({ id: 'analysis-1' });
      const result = await controller.runLandFirstCertificateReview('case-1', { user: { id: 'user-1' } });
      expect(result).toEqual({ id: 'analysis-1' });
      expect(mockAiService.reviewLandFirstCertificate).toHaveBeenCalledWith('case-1', 'user-1');
    });

    it('runLandUsePurposeChangeReview should call aiService.reviewLandUsePurposeChange', async () => {
      mockAiService.reviewLandUsePurposeChange.mockResolvedValue({ id: 'analysis-2' });
      const result = await controller.runLandUsePurposeChangeReview('case-1', { user: { id: 'user-1' } });
      expect(result).toEqual({ id: 'analysis-2' });
      expect(mockAiService.reviewLandUsePurposeChange).toHaveBeenCalledWith('case-1', 'user-1');
    });
  });
});
