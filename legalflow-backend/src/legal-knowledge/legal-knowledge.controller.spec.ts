import { Test, TestingModule } from '@nestjs/testing';
import { LegalKnowledgeController } from './legal-knowledge.controller';
import { LegalKnowledgeService } from './legal-knowledge.service';

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
});


