import { Test, TestingModule } from '@nestjs/testing';
import { LegalKnowledgeService } from './legal-knowledge.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException, BadRequestException, ConflictException } from '@nestjs/common';

describe('LegalKnowledgeService', () => {
  let service: LegalKnowledgeService;

  const mockPrismaService = {
    legalDocument: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    procedureTypeVersion: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    aiPromptVersion: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    checklistVersion: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    legalUpdateLog: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn().mockImplementation((cb) => cb(mockPrismaService)),
    procedureAiAnalysisLegalSnapshot: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    procedureAiAnalysis: {
      count: jest.fn(),
    },
    administrativeProcedureCase: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LegalKnowledgeService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<LegalKnowledgeService>(LegalKnowledgeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDocuments', () => {
    it('should return all legal documents ordered by issuedDate desc with relations', async () => {
      const mockDocs = [{ id: '1', documentCode: '31/2024/QH15' }];
      mockPrismaService.legalDocument.findMany.mockResolvedValue(mockDocs);

      const result = await service.getDocuments();
      expect(result).toEqual(mockDocs);
      expect(mockPrismaService.legalDocument.findMany).toHaveBeenCalledWith({
        orderBy: { issuedDate: 'desc' },
        include: {
          outgoingRelations: {
            include: { relatedDocument: true },
          },
          incomingRelations: {
            include: { document: true },
          },
        },
      });
    });
  });

  describe('getDocument', () => {
    it('should return a document by id with relations', async () => {
      const mockDoc = { id: '1', documentCode: '31/2024/QH15' };
      mockPrismaService.legalDocument.findUnique.mockResolvedValue(mockDoc);

      const result = await service.getDocument('1');
      expect(result).toEqual(mockDoc);
      expect(mockPrismaService.legalDocument.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          outgoingRelations: {
            include: { relatedDocument: true },
          },
          incomingRelations: {
            include: { document: true },
          },
        },
      });
    });

    it('should throw NotFoundException if document not found', async () => {
      mockPrismaService.legalDocument.findUnique.mockResolvedValue(null);

      await expect(service.getDocument('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getProcedureTypeVersions', () => {
    it('should return all procedure type versions', async () => {
      const mockVersions = [
        { id: '1', procedureCode: 'LAND_FIRST_CERTIFICATE', version: 'v1.0' },
      ];
      mockPrismaService.procedureTypeVersion.findMany.mockResolvedValue(
        mockVersions,
      );

      const result = await service.getProcedureTypeVersions();
      expect(result).toEqual(mockVersions);
      expect(
        mockPrismaService.procedureTypeVersion.findMany,
      ).toHaveBeenCalledWith({
        orderBy: [{ procedureCode: 'asc' }, { version: 'desc' }],
      });
    });
  });

  describe('getPromptVersions', () => {
    it('should return all prompt versions', async () => {
      const mockPrompts = [
        {
          id: '1',
          promptKey: 'LAND_FIRST_CERTIFICATE_REVIEW',
          version: 'v1.0',
        },
      ];
      mockPrismaService.aiPromptVersion.findMany.mockResolvedValue(
        mockPrompts,
      );

      const result = await service.getPromptVersions();
      expect(result).toEqual(mockPrompts);
      expect(mockPrismaService.aiPromptVersion.findMany).toHaveBeenCalledWith({
        orderBy: [{ promptKey: 'asc' }, { version: 'desc' }],
      });
    });
  });

  describe('getChecklistVersions', () => {
    it('should return all checklist versions', async () => {
      const mockChecklists = [
        { id: '1', checklistKey: 'CHK_LAND_FIRST_CERTIFICATE', version: 'v1.0' },
      ];
      mockPrismaService.checklistVersion.findMany.mockResolvedValue(
        mockChecklists,
      );

      const result = await service.getChecklistVersions();
      expect(result).toEqual(mockChecklists);
      expect(mockPrismaService.checklistVersion.findMany).toHaveBeenCalledWith({
        orderBy: [{ checklistKey: 'asc' }, { version: 'desc' }],
      });
    });
  });

  describe('getUpdateLogs', () => {
    it('should return all update logs ordered by createdAt desc', async () => {
      const mockLogs = [{ id: '1', updateTitle: 'Test log' }];
      mockPrismaService.legalUpdateLog.findMany.mockResolvedValue(mockLogs);

      const result = await service.getUpdateLogs();
      expect(result).toEqual(mockLogs);
      expect(mockPrismaService.legalUpdateLog.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        include: {
          sourceDocument: true,
          reviewedBy: {
            select: { id: true, email: true, fullName: true, role: true },
          },
        },
      });
    });
  });

  describe('getUpdateLogById', () => {
    it('should return an update log by id', async () => {
      const mockLog = { id: '1', updateTitle: 'Test log' };
      mockPrismaService.legalUpdateLog.findUnique.mockResolvedValue(mockLog);

      const result = await service.getUpdateLogById('1');
      expect(result).toEqual(mockLog);
      expect(mockPrismaService.legalUpdateLog.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          sourceDocument: true,
          reviewedBy: {
            select: { id: true, email: true, fullName: true, role: true },
          },
        },
      });
    });

    it('should throw NotFoundException if log not found', async () => {
      mockPrismaService.legalUpdateLog.findUnique.mockResolvedValue(null);
      await expect(service.getUpdateLogById('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getSnapshots', () => {
    it('should return all legal snapshots ordered by createdAt desc', async () => {
      const mockSnapshots = [{ id: '1', procedureAiAnalysisId: 'ana-1' }];
      mockPrismaService.procedureAiAnalysisLegalSnapshot.findMany.mockResolvedValue(
        mockSnapshots,
      );

      const result = await service.getSnapshots();
      expect(result).toEqual(mockSnapshots);
      expect(
        mockPrismaService.procedureAiAnalysisLegalSnapshot.findMany,
      ).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        include: {
          procedureAiAnalysis: {
            include: {
              procedureCase: {
                select: { id: true, caseCode: true, applicantName: true },
              },
            },
          },
          procedureTypeVersion: true,
          promptVersion: true,
          checklistVersion: true,
        },
      });
    });
  });

  describe('analyzeImpact', () => {
    it('should analyze impact and create a LegalUpdateLog', async () => {
      mockPrismaService.legalDocument.findMany.mockResolvedValue([{ id: 'doc-1', documentCode: 'LAW-1', documentTitle: 'Law 1', status: 'ACTIVE' }]);
      mockPrismaService.procedureTypeVersion.findMany.mockResolvedValue([{ id: 'proc-1', procedureCode: 'LAND_FIRST_CERTIFICATE', version: 'v1.0', status: 'ACTIVE' }]);
      mockPrismaService.aiPromptVersion.findMany.mockResolvedValue([{ id: 'prompt-1', promptKey: 'KEY_1', version: 'v1.0', analysisType: 'TEST', status: 'ACTIVE' }]);
      mockPrismaService.checklistVersion.findMany.mockResolvedValue([{ id: 'chk-1', checklistKey: 'CHK_1', version: 'v1.0', procedureTypeCode: 'LAND_FIRST_CERTIFICATE', status: 'ACTIVE' }]);
      mockPrismaService.procedureAiAnalysisLegalSnapshot.findMany.mockResolvedValue([]);
      mockPrismaService.administrativeProcedureCase.findMany.mockResolvedValue([]);
      const mockLog = { id: 'log-1', updateTitle: 'Phân tích tác động: Test Title' };
      mockPrismaService.legalUpdateLog.create.mockResolvedValue(mockLog);

      const result = await service.analyzeImpact(undefined, 'Test Title', 'Test notes');
      expect(result.success).toBe(true);
      expect(result.logId).toBe('log-1');
      expect(result.impactAnalysis.requiresOfficerVerification).toBe(true);
      expect(mockPrismaService.legalUpdateLog.create).toHaveBeenCalled();
    });
  });

  describe('handleWorkflowAction', () => {
    it('should throw ForbiddenException if user is VIEWER', async () => {
      await expect(service.handleWorkflowAction('1', 'START_REVIEW', '', '', { id: 'u1', role: 'VIEWER' })).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if log not found', async () => {
      mockPrismaService.legalUpdateLog.findUnique.mockResolvedValue(null);
      await expect(service.handleWorkflowAction('999', 'START_REVIEW', '', '', { id: 'u1', role: 'STAFF' })).rejects.toThrow(NotFoundException);
    });

    it('should start review and update status to REVIEWING', async () => {
      const mockLog = { id: '1', reviewStatus: 'PENDING', notes: null };
      mockPrismaService.legalUpdateLog.findUnique.mockResolvedValue(mockLog);
      mockPrismaService.legalUpdateLog.update.mockResolvedValue({ ...mockLog, reviewStatus: 'REVIEWING' });

      const result = await service.handleWorkflowAction('1', 'START_REVIEW', 'Bắt đầu rà soát', '', { id: 'u1', role: 'STAFF', email: 'staff@test.com' });
      expect(result.success).toBe(true);
      expect(mockPrismaService.legalUpdateLog.update).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if STAFF tries to APPROVE_FOR_VERSIONING', async () => {
      const mockLog = { id: '1', reviewStatus: 'REVIEWING', notes: null };
      mockPrismaService.legalUpdateLog.findUnique.mockResolvedValue(mockLog);
      await expect(service.handleWorkflowAction('1', 'APPROVE_FOR_VERSIONING', 'Duyệt', '', { id: 'u1', role: 'STAFF' })).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if MANAGER tries to APPROVE without note/reason', async () => {
      const mockLog = { id: '1', reviewStatus: 'REVIEWING', notes: null };
      mockPrismaService.legalUpdateLog.findUnique.mockResolvedValue(mockLog);
      await expect(service.handleWorkflowAction('1', 'APPROVE_FOR_VERSIONING', '', '', { id: 'u1', role: 'MANAGER' })).rejects.toThrow(BadRequestException);
    });

    it('should approve for versioning when MANAGER provides note', async () => {
      const mockLog = { id: '1', reviewStatus: 'REVIEWING', notes: null };
      mockPrismaService.legalUpdateLog.findUnique.mockResolvedValue(mockLog);
      mockPrismaService.legalUpdateLog.update.mockResolvedValue({ ...mockLog, reviewStatus: 'APPROVED' });

      const result = await service.handleWorkflowAction('1', 'APPROVE_FOR_VERSIONING', 'Đồng ý hướng xử lý', '', { id: 'u1', role: 'MANAGER', email: 'mgr@test.com' });
      expect(result.success).toBe(true);
    });

    it('should throw BadRequestException if log is already REJECTED', async () => {
      const mockLog = { id: '1', reviewStatus: 'REJECTED', notes: null };
      mockPrismaService.legalUpdateLog.findUnique.mockResolvedValue(mockLog);
      await expect(service.handleWorkflowAction('1', 'ADD_NOTE', 'note', '', { id: 'u1', role: 'MANAGER' })).rejects.toThrow(BadRequestException);
    });
  });

  describe('createDraftVersion', () => {
    it('should throw ForbiddenException if user is STAFF or VIEWER', async () => {
      await expect(
        service.createDraftVersion('1', 'PROCEDURE_TYPE_VERSION', 'src1', 'reason', undefined, { role: 'STAFF' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if log is not APPROVED', async () => {
      mockPrismaService.legalUpdateLog.findUnique.mockResolvedValue({ id: '1', reviewStatus: 'REVIEWING' });
      await expect(
        service.createDraftVersion('1', 'PROCEDURE_TYPE_VERSION', 'src1', 'reason', undefined, { role: 'MANAGER' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create a draft procedure type version successfully when log is APPROVED', async () => {
      const mockLog = { id: '1', reviewStatus: 'APPROVED', notes: '{}' };
      const mockSource = { id: 'src1', procedureTypeId: 'p1', version: '1.0', status: 'ACTIVE', procedureName: 'Proc A' };
      const mockCreated = { id: 'draft1', procedureTypeId: 'p1', version: '1.1-draft', status: 'DRAFT', createdAt: new Date() };

      mockPrismaService.legalUpdateLog.findUnique.mockResolvedValue(mockLog);
      mockPrismaService.procedureTypeVersion.findUnique
        .mockResolvedValueOnce(mockSource) // source check
        .mockResolvedValueOnce(null); // collision check
      mockPrismaService.procedureTypeVersion.create.mockResolvedValue(mockCreated);
      mockPrismaService.legalUpdateLog.update.mockResolvedValue({ ...mockLog, notes: '...' });

      const res = await service.createDraftVersion('1', 'PROCEDURE_TYPE_VERSION', 'src1', 'Cần cập nhật luật', undefined, { id: 'u1', role: 'ADMIN' });
      expect(res.success).toBe(true);
      expect(res.draftVersion).toEqual(mockCreated);
      expect(mockPrismaService.procedureTypeVersion.create).toHaveBeenCalled();
      expect(mockPrismaService.legalUpdateLog.update).toHaveBeenCalled();
    });
  });

  describe('getSampleProcedureCases', () => {
    it('should return sample procedure cases', async () => {
      const date = new Date('2026-07-05');
      const mockCases = [
        {
          id: 'case1',
          caseCode: 'C001',
          applicantName: 'Nguyen Van A',
          procedureType: { code: 'PROC01', name: 'Thu tuc 1' },
          status: 'SUBMITTED',
          createdAt: date,
        },
      ];
      mockPrismaService.administrativeProcedureCase.findMany.mockResolvedValue(mockCases);
      const res = await service.getSampleProcedureCases();
      expect(res).toEqual([
        {
          id: 'case1',
          caseCode: 'C001',
          applicantName: 'Nguyen Van A',
          procedureCode: 'PROC01',
          procedureName: 'Thu tuc 1',
          status: 'SUBMITTED',
          createdAt: date,
        },
      ]);
      expect(mockPrismaService.administrativeProcedureCase.findMany).toHaveBeenCalled();
    });
  });

  describe('runDraftVersionSimulation', () => {
    it('should throw ForbiddenException if user is STAFF or VIEWER', async () => {
      await expect(
        service.runDraftVersionSimulation('1', { procedureCaseId: 'c1', draftProcedureTypeVersionId: 'v1' }, { role: 'STAFF' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if log not found', async () => {
      mockPrismaService.legalUpdateLog.findUnique.mockResolvedValue(null);
      await expect(
        service.runDraftVersionSimulation('999', { procedureCaseId: 'c1', draftProcedureTypeVersionId: 'v1' }, { role: 'MANAGER' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should run simulation successfully when valid inputs are provided', async () => {
      const mockLog = { id: '1', reviewStatus: 'APPROVED', notes: '{}' };
      const mockCase = { id: 'c1', caseCode: 'C001', applicantName: 'Nguyen Van A' };
      const mockDraftVer = { id: 'v1', version: '1.1-draft', status: 'DRAFT', procedureCode: 'P01', procedureTypeId: 'pt1', processingTimeDays: 10 };
      const mockActiveVer = { id: 'v0', version: '1.0', status: 'ACTIVE', procedureCode: 'P01', procedureTypeId: 'pt1', processingTimeDays: 15 };

      mockPrismaService.legalUpdateLog.findUnique.mockResolvedValue(mockLog);
      mockPrismaService.administrativeProcedureCase.findUnique.mockResolvedValue(mockCase);
      mockPrismaService.procedureTypeVersion.findUnique.mockResolvedValue(mockDraftVer);
      mockPrismaService.procedureTypeVersion.findFirst.mockResolvedValue(mockActiveVer);
      mockPrismaService.legalUpdateLog.update.mockResolvedValue({ ...mockLog, notes: '...' });

      const res = await service.runDraftVersionSimulation(
        '1',
        { procedureCaseId: 'c1', draftProcedureTypeVersionId: 'v1', note: 'Test sim' },
        { id: 'u1', role: 'ADMIN', fullName: 'Admin' },
      );

      expect(res.success).toBe(true);
      expect(res.simulation).toBeDefined();
      expect(res.simulation.caseCode).toBe('C001');
      expect(mockPrismaService.legalUpdateLog.update).toHaveBeenCalled();
    });
  });

  describe('activateDraftVersion', () => {
    const validDto = {
      draftType: 'PROCEDURE_TYPE_VERSION',
      draftVersionId: 'v1',
      reason: 'Cập nhật luật mới',
      confirmationText: 'KICH HOAT VERSION',
    };
    const mockLog = {
      id: '1',
      reviewStatus: 'APPROVED',
      notes: JSON.stringify({
        simulations: [{ id: 'sim1' }],
        draftVersions: { list: [{ id: 'v1' }] },
      }),
    };

    it('should throw ForbiddenException if user is STAFF or VIEWER', async () => {
      await expect(service.activateDraftVersion('1', validDto, { role: 'STAFF' })).rejects.toThrow(ForbiddenException);
      await expect(service.activateDraftVersion('1', validDto, { role: 'VIEWER' })).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if confirmationText is wrong', async () => {
      await expect(
        service.activateDraftVersion('1', { ...validDto, confirmationText: 'SAI' }, { role: 'MANAGER' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if reason is missing', async () => {
      await expect(
        service.activateDraftVersion('1', { ...validDto, reason: '' }, { role: 'MANAGER' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if log is not APPROVED', async () => {
      mockPrismaService.legalUpdateLog.findUnique.mockResolvedValue({ ...mockLog, reviewStatus: 'REVIEWING' });
      await expect(service.activateDraftVersion('1', validDto, { role: 'MANAGER' })).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if no simulation exists', async () => {
      mockPrismaService.legalUpdateLog.findUnique.mockResolvedValue({
        ...mockLog,
        notes: JSON.stringify({ draftVersions: { list: [{ id: 'v1' }] } }),
      });
      await expect(service.activateDraftVersion('1', validDto, { role: 'MANAGER' })).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if draft status is not DRAFT', async () => {
      mockPrismaService.legalUpdateLog.findUnique.mockResolvedValue(mockLog);
      mockPrismaService.procedureTypeVersion.findUnique.mockResolvedValue({ id: 'v1', status: 'ACTIVE' });
      await expect(service.activateDraftVersion('1', validDto, { role: 'MANAGER' })).rejects.toThrow(BadRequestException);
    });

    it('should activate draft and replace old active version successfully for MANAGER and ADMIN', async () => {
      for (const role of ['MANAGER', 'ADMIN']) {
        jest.clearAllMocks();
        mockPrismaService.legalUpdateLog.findUnique.mockResolvedValue(mockLog);
        mockPrismaService.procedureTypeVersion.findUnique.mockResolvedValue({ id: 'v1', status: 'DRAFT', procedureTypeId: 'pt1' });
        mockPrismaService.procedureTypeVersion.findFirst.mockResolvedValue({ id: 'v0', status: 'ACTIVE', procedureTypeId: 'pt1' });
        mockPrismaService.procedureTypeVersion.update.mockResolvedValue({});
        mockPrismaService.procedureTypeVersion.count.mockResolvedValue(1);
        mockPrismaService.legalUpdateLog.update.mockImplementation((args) => Promise.resolve(args.data));

        const res = await service.activateDraftVersion('1', validDto, { id: 'u1', role, email: 'admin@test.com' });
        expect(res.success).toBe(true);
        expect(res.newActiveVersionId).toBe('v1');
        expect(res.previousActiveVersionId).toBe('v0');
        expect(mockPrismaService.procedureTypeVersion.update).toHaveBeenCalledWith(
          expect.objectContaining({ where: { id: 'v0' }, data: expect.objectContaining({ status: 'REPLACED' }) }),
        );
        expect(mockPrismaService.procedureTypeVersion.update).toHaveBeenCalledWith(
          expect.objectContaining({ where: { id: 'v1' }, data: expect.objectContaining({ status: 'ACTIVE' }) }),
        );
        const updatedNotes = JSON.parse(mockPrismaService.legalUpdateLog.update.mock.calls[0][0].data.notes);
        expect(updatedNotes.activationHistory.length).toBeGreaterThan(0);
        expect(updatedNotes.activationHistory[0].newActiveVersionId).toBe('v1');
        expect(mockPrismaService.administrativeProcedureCase.findMany).not.toHaveBeenCalled();
        expect(mockPrismaService.administrativeProcedureCase.findUnique).not.toHaveBeenCalled();
      }
    });

    it('should throw ConflictException if count > 1 (multiple active versions)', async () => {
      mockPrismaService.legalUpdateLog.findUnique.mockResolvedValue(mockLog);
      mockPrismaService.procedureTypeVersion.findUnique.mockResolvedValue({ id: 'v1', status: 'DRAFT', procedureTypeId: 'pt1' });
      mockPrismaService.procedureTypeVersion.findFirst.mockResolvedValue(null);
      mockPrismaService.procedureTypeVersion.update.mockResolvedValue({});
      mockPrismaService.procedureTypeVersion.count.mockResolvedValue(2);

      await expect(service.activateDraftVersion('1', validDto, { role: 'MANAGER' })).rejects.toThrow(ConflictException);
    });
  });

  describe('getActivationVerification', () => {
    const mockLogWithHistory = {
      id: 'log1',
      updateTitle: 'Test Log',
      reviewStatus: 'APPROVED',
      notes: JSON.stringify({
        activationHistory: [
          {
            draftType: 'PROCEDURE_TYPE_VERSION',
            newActiveVersionId: 'newVer1',
            previousActiveVersionId: 'oldVer1',
            activatedAt: '2026-07-05T10:00:00.000Z',
          },
        ],
        workflowHistory: [
          { action: 'ACTIVATE_DRAFT_VERSION', timestamp: '2026-07-05T10:00:00.000Z' },
        ],
      }),
    };

    beforeEach(() => {
      mockPrismaService.procedureTypeVersion.groupBy.mockResolvedValue([]);
      mockPrismaService.aiPromptVersion.groupBy.mockResolvedValue([]);
      mockPrismaService.checklistVersion.groupBy.mockResolvedValue([]);
      mockPrismaService.administrativeProcedureCase.count.mockResolvedValue(10);
      mockPrismaService.procedureAiAnalysis.count.mockResolvedValue(5);
      mockPrismaService.procedureAiAnalysisLegalSnapshot.count.mockResolvedValue(5);
    });

    it('should return PASS when activation is valid', async () => {
      mockPrismaService.legalUpdateLog.findUnique.mockResolvedValue(mockLogWithHistory);
      mockPrismaService.procedureTypeVersion.findUnique
        .mockResolvedValueOnce({ id: 'newVer1', status: 'ACTIVE', procedureTypeId: 'pt1', effectiveFrom: new Date() })
        .mockResolvedValueOnce({ id: 'oldVer1', status: 'REPLACED', procedureTypeId: 'pt1', effectiveTo: new Date() });
      mockPrismaService.procedureTypeVersion.count.mockResolvedValue(1);

      const res = await service.getActivationVerification('log1');
      expect(res.overallStatus).toBe('PASS');
      expect(res.warnings).toHaveLength(0);
      expect(res.versionChecks[0].passed).toBe(true);
      expect(res.caseSafetyChecks.totalCases).toBe(10);
      expect(mockPrismaService.legalUpdateLog.update).not.toHaveBeenCalled();
    });

    it('should return WARNING when no activationHistory exists', async () => {
      mockPrismaService.legalUpdateLog.findUnique.mockResolvedValue({
        ...mockLogWithHistory,
        notes: JSON.stringify({}),
      });

      const res = await service.getActivationVerification('log1');
      expect(res.overallStatus).toBe('WARNING');
      expect(res.warnings[0]).toContain('Không tìm thấy lịch sử kích hoạt');
    });

    it('should return FAIL if newActiveVersionId is not ACTIVE', async () => {
      mockPrismaService.legalUpdateLog.findUnique.mockResolvedValue(mockLogWithHistory);
      mockPrismaService.procedureTypeVersion.findUnique
        .mockResolvedValueOnce({ id: 'newVer1', status: 'DRAFT', procedureTypeId: 'pt1' })
        .mockResolvedValueOnce({ id: 'oldVer1', status: 'REPLACED', procedureTypeId: 'pt1' });
      mockPrismaService.procedureTypeVersion.count.mockResolvedValue(0);

      const res = await service.getActivationVerification('log1');
      expect(res.overallStatus).toBe('FAIL');
      expect(res.warnings[0]).toContain('không ở trạng thái ACTIVE');
    });

    it('should return FAIL if previousActiveVersionId is not REPLACED', async () => {
      mockPrismaService.legalUpdateLog.findUnique.mockResolvedValue(mockLogWithHistory);
      mockPrismaService.procedureTypeVersion.findUnique
        .mockResolvedValueOnce({ id: 'newVer1', status: 'ACTIVE', procedureTypeId: 'pt1' })
        .mockResolvedValueOnce({ id: 'oldVer1', status: 'ACTIVE', procedureTypeId: 'pt1' });
      mockPrismaService.procedureTypeVersion.count.mockResolvedValue(2);

      const res = await service.getActivationVerification('log1');
      expect(res.overallStatus).toBe('FAIL');
      expect(res.warnings[0]).toContain('không ở trạng thái REPLACED');
    });

    it('should return FAIL if multiple ACTIVE versions exist in scope', async () => {
      mockPrismaService.legalUpdateLog.findUnique.mockResolvedValue(mockLogWithHistory);
      mockPrismaService.procedureTypeVersion.findUnique
        .mockResolvedValueOnce({ id: 'newVer1', status: 'ACTIVE', procedureTypeId: 'pt1' })
        .mockResolvedValueOnce({ id: 'oldVer1', status: 'REPLACED', procedureTypeId: 'pt1' });
      mockPrismaService.procedureTypeVersion.count.mockResolvedValue(2);

      const res = await service.getActivationVerification('log1');
      expect(res.overallStatus).toBe('FAIL');
      expect(res.warnings[0]).toContain('Phát hiện 2 phiên bản ACTIVE cùng phạm vi');
    });

    it('should not update database or touch safety tables', async () => {
      mockPrismaService.legalUpdateLog.findUnique.mockResolvedValue(mockLogWithHistory);
      mockPrismaService.procedureTypeVersion.findUnique
        .mockResolvedValueOnce({ id: 'newVer1', status: 'ACTIVE', procedureTypeId: 'pt1' })
        .mockResolvedValueOnce({ id: 'oldVer1', status: 'REPLACED', procedureTypeId: 'pt1' });
      mockPrismaService.procedureTypeVersion.count.mockResolvedValue(1);

      await service.getActivationVerification('log1');
      expect(mockPrismaService.legalUpdateLog.update).not.toHaveBeenCalled();
      expect(mockPrismaService.procedureTypeVersion.update).not.toHaveBeenCalled();
      expect(mockPrismaService.aiPromptVersion.update).not.toHaveBeenCalled();
      expect(mockPrismaService.checklistVersion.update).not.toHaveBeenCalled();
    });
  });
});
