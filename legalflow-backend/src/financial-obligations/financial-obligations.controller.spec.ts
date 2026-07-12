import { Test, TestingModule } from '@nestjs/testing';
import { FinancialObligationsController } from './financial-obligations.controller';
import { FinancialObligationsService } from './financial-obligations.service';
import { Role } from '../common/role.enum';

describe('FinancialObligationsController', () => {
  let controller: FinancialObligationsController;
  let service: FinancialObligationsService;

  const mockService = {
    findByCaseId: jest.fn(),
    createAssessment: jest.fn(),
    updateAssessment: jest.fn(),
    generateDraft: jest.fn(),
    addItem: jest.fn(),
    updateItem: jest.fn(),
    addTaxNotice: jest.fn(),
    addPaymentEvidence: jest.fn(),
    officerVerify: jest.fn(),
    managerVerify: jest.fn(),
    markCompleted: jest.fn(),
    getAuditLogs: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinancialObligationsController],
      providers: [{ provide: FinancialObligationsService, useValue: mockService }],
    }).compile();

    controller = module.get<FinancialObligationsController>(FinancialObligationsController);
    service = module.get<FinancialObligationsService>(FinancialObligationsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findByCaseId with caseId and user', async () => {
    mockService.findByCaseId.mockResolvedValue({ success: true, data: {} });
    await controller.getByCaseId('case-1', { user: { id: 'u-1', role: Role.STAFF } });
    expect(mockService.findByCaseId).toHaveBeenCalledWith('case-1', { id: 'u-1', role: Role.STAFF });
  });

  it('should call generateDraft with assessmentId and user', async () => {
    mockService.generateDraft.mockResolvedValue({ success: true, data: {}, safetyWarnings: [] });
    await controller.generateDraft('ass-1', { user: { id: 'u-1', role: Role.STAFF } });
    expect(mockService.generateDraft).toHaveBeenCalledWith('ass-1', { id: 'u-1', role: Role.STAFF });
  });

  it('should call markCompleted with assessmentId and dto', async () => {
    const dto = { notes: 'Done' };
    mockService.markCompleted.mockResolvedValue({ success: true, data: {} });
    await controller.markCompleted('ass-1', dto, { user: { id: 'u-1', role: Role.STAFF } });
    expect(mockService.markCompleted).toHaveBeenCalledWith('ass-1', dto, { id: 'u-1', role: Role.STAFF });
  });
});
