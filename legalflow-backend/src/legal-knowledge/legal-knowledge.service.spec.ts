import { Test, TestingModule } from '@nestjs/testing';
import { LegalKnowledgeService } from './legal-knowledge.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('LegalKnowledgeService', () => {
  let service: LegalKnowledgeService;

  const mockPrismaService = {
    legalDocument: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    procedureTypeVersion: {
      findMany: jest.fn(),
    },
    aiPromptVersion: {
      findMany: jest.fn(),
    },
    checklistVersion: {
      findMany: jest.fn(),
    },
    legalUpdateLog: {
      findMany: jest.fn(),
    },
    procedureAiAnalysisLegalSnapshot: {
      findMany: jest.fn(),
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
        },
      });
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
          procedureAiAnalysis: true,
          procedureTypeVersion: true,
          promptVersion: true,
          checklistVersion: true,
        },
      });
    });
  });
});
