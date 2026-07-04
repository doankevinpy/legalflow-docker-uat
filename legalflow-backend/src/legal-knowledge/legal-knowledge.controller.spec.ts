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
    getSnapshots: jest.fn(),
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

  it('getSnapshots should call service.getSnapshots', async () => {
    const mockResult = [{ id: '1' }];
    mockService.getSnapshots.mockResolvedValue(mockResult);

    const result = await controller.getSnapshots();
    expect(result).toEqual(mockResult);
    expect(mockService.getSnapshots).toHaveBeenCalled();
  });
});
