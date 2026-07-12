import { Test, TestingModule } from '@nestjs/testing';
import { FinancialObligationsService } from './financial-obligations.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  UnprocessableEntityException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  FinancialObligationAssessmentStatus,
  OfficerReviewStatus,
  ManagerReviewStatus,
  PaymentStatus,
  TaxNoticeStatus,
  FinancialRiskLevel,
  Role,
} from '@prisma/client';

describe('FinancialObligationsService', () => {
  let service: FinancialObligationsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    administrativeProcedureCase: {
      findUnique: jest.fn(),
    },
    financialObligationAssessment: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    financialObligationItem: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    taxNoticeRecord: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    paymentEvidenceRecord: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    financialObligationAuditLog: {
      create: jest.fn().mockResolvedValue({}),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinancialObligationsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<FinancialObligationsService>(FinancialObligationsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAssessment', () => {
    it('should create a new assessment with safety warnings and estimate status', async () => {
      mockPrismaService.administrativeProcedureCase.findUnique.mockResolvedValue({ id: 'case-1' });
      mockPrismaService.financialObligationAssessment.findUnique.mockResolvedValue(null);
      mockPrismaService.financialObligationAssessment.create.mockResolvedValue({
        id: 'assessment-1',
        caseId: 'case-1',
        isEstimate: true,
        estimatedTotalAmount: 0.0,
      });

      const res = await service.createAssessment('case-1', {}, { id: 'user-1', role: Role.STAFF });
      expect(res.success).toBe(true);
      expect(res.safetyWarnings.length).toBeGreaterThan(0);
      expect(res.safetyWarnings[0]).toContain('DỰ KIẾN');
    });

    it('should throw BadRequestException if assessment already exists for case', async () => {
      mockPrismaService.administrativeProcedureCase.findUnique.mockResolvedValue({ id: 'case-1' });
      mockPrismaService.financialObligationAssessment.findUnique.mockResolvedValue({ id: 'assessment-1' });

      await expect(
        service.createAssessment('case-1', {}, { id: 'user-1', role: Role.STAFF }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('generateDraft', () => {
    it('should generate draft estimate without creating official amount and return safety warning', async () => {
      mockPrismaService.financialObligationAssessment.findUnique.mockResolvedValue({
        id: 'assessment-1',
        items: [],
        isEstimate: true,
      });
      mockPrismaService.financialObligationItem.create.mockResolvedValue({});
      mockPrismaService.financialObligationAssessment.update.mockResolvedValue({
        id: 'assessment-1',
        assessmentStatus: FinancialObligationAssessmentStatus.ESTIMATED,
        estimatedTotalAmount: 45000000.0,
        isEstimate: true,
      });

      const res = await service.generateDraft('assessment-1', { id: 'user-1', role: Role.STAFF });
      expect(res.success).toBe(true);
      expect(res.data.isEstimate).toBe(true);
      expect(res.safetyWarnings[1]).toContain('KHÔNG THAY THẾ CƠ QUAN THUẾ');
    });
  });

  describe('markCompleted blocking rules', () => {
    const baseAssessment = {
      id: 'assessment-1',
      isEstimate: false,
      officialTotalAmount: 50000000.0,
      taxNotice: { id: 'tax-1' },
      paymentEvidences: [{ id: 'pay-1' }],
      officerReviewStatus: OfficerReviewStatus.OFFICER_VERIFIED,
      assessmentStatus: FinancialObligationAssessmentStatus.PAYMENT_UPLOADED,
      riskLevel: FinancialRiskLevel.LOW,
      managerReviewStatus: ManagerReviewStatus.NOT_REQUIRED,
    };

    it('should block completion if assessment is estimate-only (no official tax notice)', async () => {
      mockPrismaService.financialObligationAssessment.findUnique.mockResolvedValue({
        ...baseAssessment,
        isEstimate: true,
        officialTotalAmount: null,
      });

      await expect(
        service.markCompleted('assessment-1', {}, { id: 'user-1', role: Role.STAFF }),
      ).rejects.toThrow(UnprocessableEntityException);
    });

    it('should block completion if official tax notice is missing', async () => {
      mockPrismaService.financialObligationAssessment.findUnique.mockResolvedValue({
        ...baseAssessment,
        taxNotice: null,
      });

      await expect(
        service.markCompleted('assessment-1', {}, { id: 'user-1', role: Role.STAFF }),
      ).rejects.toThrow(UnprocessableEntityException);
    });

    it('should block completion if payment evidence is missing', async () => {
      mockPrismaService.financialObligationAssessment.findUnique.mockResolvedValue({
        ...baseAssessment,
        paymentEvidences: [],
      });

      await expect(
        service.markCompleted('assessment-1', {}, { id: 'user-1', role: Role.STAFF }),
      ).rejects.toThrow(UnprocessableEntityException);
    });

    it('should block completion if officer verification is not verified', async () => {
      mockPrismaService.financialObligationAssessment.findUnique.mockResolvedValue({
        ...baseAssessment,
        officerReviewStatus: OfficerReviewStatus.UNVERIFIED,
      });

      await expect(
        service.markCompleted('assessment-1', {}, { id: 'user-1', role: Role.STAFF }),
      ).rejects.toThrow(UnprocessableEntityException);
    });

    it('should block completion if status is MISSING_INFORMATION', async () => {
      mockPrismaService.financialObligationAssessment.findUnique.mockResolvedValue({
        ...baseAssessment,
        assessmentStatus: FinancialObligationAssessmentStatus.MISSING_INFORMATION,
      });

      await expect(
        service.markCompleted('assessment-1', {}, { id: 'user-1', role: Role.STAFF }),
      ).rejects.toThrow(UnprocessableEntityException);
    });

    it('should block completion if risk is HIGH and manager has not verified', async () => {
      mockPrismaService.financialObligationAssessment.findUnique.mockResolvedValue({
        ...baseAssessment,
        riskLevel: FinancialRiskLevel.HIGH,
        managerReviewStatus: ManagerReviewStatus.PENDING,
      });

      await expect(
        service.markCompleted('assessment-1', {}, { id: 'user-1', role: Role.STAFF }),
      ).rejects.toThrow(UnprocessableEntityException);
    });

    it('should successfully complete assessment when all blocking conditions pass', async () => {
      mockPrismaService.financialObligationAssessment.findUnique.mockResolvedValue(baseAssessment);
      mockPrismaService.financialObligationAssessment.update.mockResolvedValue({
        ...baseAssessment,
        assessmentStatus: FinancialObligationAssessmentStatus.COMPLETED,
      });

      const res = await service.markCompleted('assessment-1', {}, { id: 'user-1', role: Role.STAFF });
      expect(res.success).toBe(true);
      expect(res.data.assessmentStatus).toBe(FinancialObligationAssessmentStatus.COMPLETED);
    });
  });
});
