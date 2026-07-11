import { Test, TestingModule } from '@nestjs/testing';
import { LegalKnowledgeController } from './legal-knowledge.controller';
import { LegalKnowledgeService } from './legal-knowledge.service';
import { ROLES_KEY } from '../common/roles.decorator';
import { Role } from '../common/role.enum';

describe('LegalKnowledgeController', () => {
  let controller: LegalKnowledgeController;

  const mockService = {
    getDocuments: jest.fn(),
    getDocument: jest.fn(),
    getProcedureTypeVersions: jest.fn(),
    getPromptVersions: jest.fn(),
    getChecklistVersions: jest.fn(),
    getUpdateLogs: jest.fn(),
    getUpdateLogById: jest.fn(),
    getSnapshots: jest.fn(),
    analyzeImpact: jest.fn(),
    handleWorkflowAction: jest.fn(),
    createDraftVersion: jest.fn(),
    getSampleProcedureCases: jest.fn(),
    runDraftVersionSimulation: jest.fn(),
    activateDraftVersion: jest.fn(),
    getActivationVerification: jest.fn(),
    rollbackActivatedVersion: jest.fn(),
    getRollbackVerification: jest.fn(),
    validateCsvImport: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LegalKnowledgeController],
      providers: [
        { provide: LegalKnowledgeService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<LegalKnowledgeController>(LegalKnowledgeController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Permission Guard Enforcement (RBAC)', () => {
    it('should enforce ADMIN, MANAGER roles on sensitive legal update actions', () => {
      expect(Reflect.getMetadata(ROLES_KEY, controller.analyzeImpactFromLog)).toEqual([Role.ADMIN, Role.MANAGER]);
      expect(Reflect.getMetadata(ROLES_KEY, controller.analyzeImpactFromDocument)).toEqual([Role.ADMIN, Role.MANAGER]);
      expect(Reflect.getMetadata(ROLES_KEY, controller.approveForVersioning)).toEqual([Role.ADMIN, Role.MANAGER]);
      expect(Reflect.getMetadata(ROLES_KEY, controller.rejectUpdate)).toEqual([Role.ADMIN, Role.MANAGER]);
      expect(Reflect.getMetadata(ROLES_KEY, controller.closeUpdate)).toEqual([Role.ADMIN, Role.MANAGER]);
    });

    it('should enforce ADMIN, MANAGER roles on draft version creation and lifecycle endpoints', () => {
      expect(Reflect.getMetadata(ROLES_KEY, controller.createDraftVersion)).toEqual([Role.ADMIN, Role.MANAGER]);
      expect(Reflect.getMetadata(ROLES_KEY, controller.createProcedureTypeDraft)).toEqual([Role.ADMIN, Role.MANAGER]);
      expect(Reflect.getMetadata(ROLES_KEY, controller.createPromptDraft)).toEqual([Role.ADMIN, Role.MANAGER]);
      expect(Reflect.getMetadata(ROLES_KEY, controller.createChecklistDraft)).toEqual([Role.ADMIN, Role.MANAGER]);
      expect(Reflect.getMetadata(ROLES_KEY, controller.runDraftSimulation)).toEqual([Role.ADMIN, Role.MANAGER]);
      expect(Reflect.getMetadata(ROLES_KEY, controller.activateDraftVersion)).toEqual([Role.ADMIN, Role.MANAGER]);
      expect(Reflect.getMetadata(ROLES_KEY, controller.rollbackActivatedVersion)).toEqual([Role.ADMIN, Role.MANAGER]);
      expect(Reflect.getMetadata(ROLES_KEY, controller.validateCsvImport)).toEqual([Role.ADMIN, Role.MANAGER]);
    });

    it('should allow read-only access (VIEWER, STAFF, MANAGER, ADMIN) on verification endpoints', () => {
      expect(Reflect.getMetadata(ROLES_KEY, controller.getActivationVerification)).toEqual([Role.ADMIN, Role.MANAGER, Role.STAFF, Role.VIEWER]);
      expect(Reflect.getMetadata(ROLES_KEY, controller.getRollbackVerification)).toEqual([Role.ADMIN, Role.MANAGER, Role.STAFF, Role.VIEWER]);
    });
  });

  it('getDocuments should call service.getDocuments', async () => {
    const mockResult = [{ id: '1' }];
    mockService.getDocuments.mockResolvedValue(mockResult);

    const result = await controller.getDocuments();
    expect(result).toEqual(mockResult);
    expect(mockService.getDocuments).toHaveBeenCalled();
  });

  it('getDocument should call service.getDocument', async () => {
    const mockResult = { id: '1' };
    mockService.getDocument.mockResolvedValue(mockResult);

    const result = await controller.getDocument('1');
    expect(result).toEqual(mockResult);
    expect(mockService.getDocument).toHaveBeenCalledWith('1');
  });

  it('getProcedureTypeVersions should call service.getProcedureTypeVersions', async () => {
    const mockResult = [{ id: '1' }];
    mockService.getProcedureTypeVersions.mockResolvedValue(mockResult);

    const result = await controller.getProcedureTypeVersions();
    expect(result).toEqual(mockResult);
    expect(mockService.getProcedureTypeVersions).toHaveBeenCalled();
  });

  it('getPromptVersions should call service.getPromptVersions', async () => {
    const mockResult = [{ id: '1' }];
    mockService.getPromptVersions.mockResolvedValue(mockResult);

    const result = await controller.getPromptVersions();
    expect(result).toEqual(mockResult);
    expect(mockService.getPromptVersions).toHaveBeenCalled();
  });

  it('getChecklistVersions should call service.getChecklistVersions', async () => {
    const mockResult = [{ id: '1' }];
    mockService.getChecklistVersions.mockResolvedValue(mockResult);

    const result = await controller.getChecklistVersions();
    expect(result).toEqual(mockResult);
    expect(mockService.getChecklistVersions).toHaveBeenCalled();
  });

  it('getUpdateLogs should call service.getUpdateLogs', async () => {
    const mockResult = [{ id: '1' }];
    mockService.getUpdateLogs.mockResolvedValue(mockResult);

    const result = await controller.getUpdateLogs();
    expect(result).toEqual(mockResult);
    expect(mockService.getUpdateLogs).toHaveBeenCalled();
  });

  it('getUpdateLog should call service.getUpdateLogById', async () => {
    const mockResult = { id: '1' };
    mockService.getUpdateLogById.mockResolvedValue(mockResult);

    const result = await controller.getUpdateLog('1');
    expect(result).toEqual(mockResult);
    expect(mockService.getUpdateLogById).toHaveBeenCalledWith('1');
  });

  it('getSnapshots should call service.getSnapshots', async () => {
    const mockResult = [{ id: '1' }];
    mockService.getSnapshots.mockResolvedValue(mockResult);

    const result = await controller.getSnapshots();
    expect(result).toEqual(mockResult);
    expect(mockService.getSnapshots).toHaveBeenCalled();
  });

  it('analyzeImpactFromLog should call service.analyzeImpact', async () => {
    const mockResult = { success: true };
    mockService.analyzeImpact.mockResolvedValue(mockResult);

    const result = await controller.analyzeImpactFromLog({ sourceDocumentId: 'doc-1', title: 'Test' });
    expect(result).toEqual(mockResult);
    expect(mockService.analyzeImpact).toHaveBeenCalledWith('doc-1', 'Test', undefined);
  });

  it('analyzeImpactFromDocument should call service.analyzeImpact', async () => {
    const mockResult = { success: true };
    mockService.analyzeImpact.mockResolvedValue(mockResult);

    const result = await controller.analyzeImpactFromDocument('doc-1', { title: 'Test' });
    expect(result).toEqual(mockResult);
    expect(mockService.analyzeImpact).toHaveBeenCalledWith('doc-1', 'Test', undefined);
  });

  it('startReview should call service.handleWorkflowAction', async () => {
    const mockResult = { success: true };
    mockService.handleWorkflowAction.mockResolvedValue(mockResult);

    const result = await controller.startReview('1', { note: 'test' }, { user: { id: 'u1' } });
    expect(result).toEqual(mockResult);
    expect(mockService.handleWorkflowAction).toHaveBeenCalledWith('1', 'START_REVIEW', 'test', '', { id: 'u1' });
  });

  it('addReviewNote should call service.handleWorkflowAction', async () => {
    const mockResult = { success: true };
    mockService.handleWorkflowAction.mockResolvedValue(mockResult);

    const result = await controller.addReviewNote('1', { note: 'test note' }, { user: { id: 'u1' } });
    expect(result).toEqual(mockResult);
    expect(mockService.handleWorkflowAction).toHaveBeenCalledWith('1', 'ADD_NOTE', 'test note', '', { id: 'u1' });
  });

  it('requestMoreInfo should call service.handleWorkflowAction', async () => {
    const mockResult = { success: true };
    mockService.handleWorkflowAction.mockResolvedValue(mockResult);

    const result = await controller.requestMoreInfo('1', { note: 'need info' }, { user: { id: 'u1' } });
    expect(result).toEqual(mockResult);
    expect(mockService.handleWorkflowAction).toHaveBeenCalledWith('1', 'REQUEST_MORE_INFO', 'need info', '', { id: 'u1' });
  });

  it('approveForVersioning should call service.handleWorkflowAction', async () => {
    const mockResult = { success: true };
    mockService.handleWorkflowAction.mockResolvedValue(mockResult);

    const result = await controller.approveForVersioning('1', { note: 'approved' }, { user: { id: 'u1' } });
    expect(result).toEqual(mockResult);
    expect(mockService.handleWorkflowAction).toHaveBeenCalledWith('1', 'APPROVE_FOR_VERSIONING', 'approved', '', { id: 'u1' });
  });

  it('rejectUpdate should call service.handleWorkflowAction', async () => {
    const mockResult = { success: true };
    mockService.handleWorkflowAction.mockResolvedValue(mockResult);

    const result = await controller.rejectUpdate('1', { reason: 'rejected' }, { user: { id: 'u1' } });
    expect(result).toEqual(mockResult);
    expect(mockService.handleWorkflowAction).toHaveBeenCalledWith('1', 'REJECT', '', 'rejected', { id: 'u1' });
  });

  it('closeUpdate should call service.handleWorkflowAction', async () => {
    const mockResult = { success: true };
    mockService.handleWorkflowAction.mockResolvedValue(mockResult);

    const result = await controller.closeUpdate('1', { note: 'closed' }, { user: { id: 'u1' } });
    expect(result).toEqual(mockResult);
    expect(mockService.handleWorkflowAction).toHaveBeenCalledWith('1', 'CLOSE', 'closed', '', { id: 'u1' });
  });

  it('workflowAction should call service.handleWorkflowAction', async () => {
    const mockResult = { success: true };
    mockService.handleWorkflowAction.mockResolvedValue(mockResult);

    const result = await controller.workflowAction('1', { action: 'START_REVIEW', note: 'test' }, { user: { id: 'u1' } });
    expect(result).toEqual(mockResult);
    expect(mockService.handleWorkflowAction).toHaveBeenCalledWith('1', 'START_REVIEW', 'test', '', { id: 'u1' });
  });

  it('createDraftVersion should call service.createDraftVersion', async () => {
    const mockResult = { success: true };
    mockService.createDraftVersion.mockResolvedValue(mockResult);

    const result = await controller.createDraftVersion('1', { draftType: 'PROCEDURE_TYPE_VERSION', sourceVersionId: 'src1', reason: 'test' }, { user: { id: 'u1' } });
    expect(result).toEqual(mockResult);
    expect(mockService.createDraftVersion).toHaveBeenCalledWith('1', 'PROCEDURE_TYPE_VERSION', 'src1', 'test', undefined, { id: 'u1' });
  });

  it('createProcedureTypeDraft should call service.createDraftVersion with PROCEDURE_TYPE_VERSION', async () => {
    const mockResult = { success: true };
    mockService.createDraftVersion.mockResolvedValue(mockResult);

    const result = await controller.createProcedureTypeDraft('1', { sourceVersionId: 'src1', reason: 'test' }, { user: { id: 'u1' } });
    expect(result).toEqual(mockResult);
    expect(mockService.createDraftVersion).toHaveBeenCalledWith('1', 'PROCEDURE_TYPE_VERSION', 'src1', 'test', undefined, { id: 'u1' });
  });

  it('createPromptDraft should call service.createDraftVersion with AI_PROMPT_VERSION', async () => {
    const mockResult = { success: true };
    mockService.createDraftVersion.mockResolvedValue(mockResult);

    const result = await controller.createPromptDraft('1', { sourceVersionId: 'src1', reason: 'test' }, { user: { id: 'u1' } });
    expect(result).toEqual(mockResult);
    expect(mockService.createDraftVersion).toHaveBeenCalledWith('1', 'AI_PROMPT_VERSION', 'src1', 'test', undefined, { id: 'u1' });
  });

  it('createChecklistDraft should call service.createDraftVersion with CHECKLIST_VERSION', async () => {
    const mockResult = { success: true };
    mockService.createDraftVersion.mockResolvedValue(mockResult);

    const result = await controller.createChecklistDraft('1', { sourceVersionId: 'src1', reason: 'test' }, { user: { id: 'u1' } });
    expect(result).toEqual(mockResult);
    expect(mockService.createDraftVersion).toHaveBeenCalledWith('1', 'CHECKLIST_VERSION', 'src1', 'test', undefined, { id: 'u1' });
  });

  it('getSampleCases should call service.getSampleProcedureCases', async () => {
    const mockResult = [{ id: 'case1' }];
    mockService.getSampleProcedureCases.mockResolvedValue(mockResult);

    const result = await controller.getSampleCases();
    expect(result).toEqual(mockResult);
    expect(mockService.getSampleProcedureCases).toHaveBeenCalled();
  });

  it('runDraftSimulation should call service.runDraftVersionSimulation', async () => {
    const mockResult = { success: true };
    mockService.runDraftVersionSimulation.mockResolvedValue(mockResult);

    const body = { procedureCaseId: 'c1', draftProcedureTypeVersionId: 'v1', note: 'sim' };
    const result = await controller.runDraftSimulation('1', body, { user: { id: 'u1' } });
    expect(result).toEqual(mockResult);
    expect(mockService.runDraftVersionSimulation).toHaveBeenCalledWith('1', body, { id: 'u1' });
  });

  it('activateDraftVersion should call service.activateDraftVersion', async () => {
    const mockResult = { success: true };
    mockService.activateDraftVersion.mockResolvedValue(mockResult);

    const body = { draftType: 'PROCEDURE_TYPE_VERSION', draftVersionId: 'v1', reason: 'act', confirmationText: 'KICH HOAT VERSION' };
    const result = await controller.activateDraftVersion('1', body, { user: { id: 'u1' } });
    expect(result).toEqual(mockResult);
    expect(mockService.activateDraftVersion).toHaveBeenCalledWith('1', body, { id: 'u1' });
  });

  it('getActivationVerification should call service.getActivationVerification', async () => {
    const mockResult = { overallStatus: 'PASS' };
    mockService.getActivationVerification.mockResolvedValue(mockResult);

    const result = await controller.getActivationVerification('1', { user: { id: 'u1' } });
    expect(result).toEqual(mockResult);
    expect(mockService.getActivationVerification).toHaveBeenCalledWith('1', { id: 'u1' });
  });

  it('rollbackActivatedVersion should call service.rollbackActivatedVersion', async () => {
    const mockResult = { success: true, message: 'Rolled back' };
    mockService.rollbackActivatedVersion.mockResolvedValue(mockResult);

    const dto = { rollbackReason: 'reason', confirmationText: 'ROLLBACK VERSION' };
    const result = await controller.rollbackActivatedVersion('1', dto, { user: { id: 'u1' } });
    expect(result).toEqual(mockResult);
    expect(mockService.rollbackActivatedVersion).toHaveBeenCalledWith('1', dto, { id: 'u1' });
  });

  it('getRollbackVerification should call service.getRollbackVerification', async () => {
    const mockResult = { overallStatus: 'PASS' };
    mockService.getRollbackVerification.mockResolvedValue(mockResult);

    const result = await controller.getRollbackVerification('1', { user: { id: 'u1' } });
    expect(result).toEqual(mockResult);
    expect(mockService.getRollbackVerification).toHaveBeenCalledWith('1', { id: 'u1' });
  });

  it('validateCsvImport should call service.validateCsvImport with dryRun true', async () => {
    const mockReport = { dryRun: true, noDatabaseWrite: true, summary: { totalRecords: 1 } };
    mockService.validateCsvImport.mockResolvedValue(mockReport);

    const body = { csvText: 'header\nrow', dryRun: true };
    const result = await controller.validateCsvImport(body);
    expect(result).toEqual(mockReport);
    expect(mockService.validateCsvImport).toHaveBeenCalledWith(body.csvText, true);
  });
});



