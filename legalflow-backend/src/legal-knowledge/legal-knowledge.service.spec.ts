import { Test, TestingModule } from '@nestjs/testing';
import { LegalKnowledgeService } from './legal-knowledge.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';

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
    },
    aiPromptVersion: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    checklistVersion: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    legalUpdateLog: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    procedureAiAnalysisLegalSnapshot: {
      findMany: jest.fn(),
    },
    administrativeProcedureCase: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
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
});



