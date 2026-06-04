import { Test, TestingModule } from '@nestjs/testing';
import { LandProfileService } from './land-profile.service';
import { PrismaService } from '../prisma/prisma.service';
import { AdminAuditLogsService } from '../admin-audit-logs/admin-audit-logs.service';
import { Role } from '../common/role.enum';
import { CaseField } from '../cases/enums/case.enum';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { LandType, Neighborhood } from '@prisma/client';

describe('LandProfileService', () => {
  let service: LandProfileService;
  let prisma: PrismaService;
  let auditLogs: AdminAuditLogsService;

  const mockUserAdmin = { id: 'admin1', email: 'admin@test.com', role: Role.ADMIN };
  const mockUserStaff1 = { id: 'staff1', email: 'staff1@test.com', role: Role.STAFF };
  const mockUserStaff2 = { id: 'staff2', email: 'staff2@test.com', role: Role.STAFF };
  const mockUserViewer = { id: 'viewer1', email: 'viewer@test.com', role: Role.VIEWER };

  const mockCaseDatDai = {
    id: 'case-dat-dai',
    field: CaseField.DAT_DAI,
    assignedToId: 'staff1',
    createdById: 'staff1',
    deletedAt: null,
  };

  const mockCaseHinhSu = {
    id: 'case-hinh-su',
    field: 'HINH_SU' as any, // Not DAT_DAI
    assignedToId: 'staff1',
    createdById: 'staff1',
    deletedAt: null,
  };

  const mockLandProfile = {
    id: 'lp-1',
    caseId: 'case-dat-dai',
    landType: LandType.RESIDENTIAL,
    currentLandUseType: LandType.RESIDENTIAL,
    area: 120.5,
    neighborhood: Neighborhood.URBAN,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LandProfileService,
        {
          provide: PrismaService,
          useValue: {
            legalCase: {
              findFirst: jest.fn(),
            },
            landProfile: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: AdminAuditLogsService,
          useValue: {
            logAction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LandProfileService>(LandProfileService);
    prisma = module.get<PrismaService>(PrismaService);
    auditLogs = module.get<AdminAuditLogsService>(AdminAuditLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should throw NotFoundException if case does not exist or is deleted', async () => {
      jest.spyOn(prisma.legalCase, 'findFirst').mockResolvedValue(null as any);
      await expect(service.findOne('non-existent', mockUserAdmin)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if STAFF tries to view case they do not own or are not assigned to', async () => {
      jest.spyOn(prisma.legalCase, 'findFirst').mockResolvedValue(mockCaseDatDai as any);
      await expect(service.findOne('case-dat-dai', mockUserStaff2)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should return land profile if it exists and access is allowed', async () => {
      jest.spyOn(prisma.legalCase, 'findFirst').mockResolvedValue(mockCaseDatDai as any);
      jest.spyOn(prisma.landProfile, 'findUnique').mockResolvedValue(mockLandProfile as any);

      const result = await service.findOne('case-dat-dai', mockUserStaff1);
      expect(result).toEqual(mockLandProfile);
    });

    it('should throw NotFoundException if land profile does not exist for the case', async () => {
      jest.spyOn(prisma.legalCase, 'findFirst').mockResolvedValue(mockCaseDatDai as any);
      jest.spyOn(prisma.landProfile, 'findUnique').mockResolvedValue(null as any);

      await expect(service.findOne('case-dat-dai', mockUserStaff1)).rejects.toThrow(
        new NotFoundException('Land profile not found for this case'),
      );
    });
  });

  describe('create', () => {
    const dto = {
      landType: LandType.RESIDENTIAL,
      currentLandUseType: LandType.RESIDENTIAL,
      area: 150.0,
      neighborhood: Neighborhood.RURAL,
    };

    it('should create land profile, log audit log and return it if validation and permission pass', async () => {
      jest.spyOn(prisma.legalCase, 'findFirst').mockResolvedValue(mockCaseDatDai as any);
      jest.spyOn(prisma.landProfile, 'findUnique').mockResolvedValue(null as any);
      jest.spyOn(prisma.landProfile, 'create').mockResolvedValue({ id: 'new-lp', caseId: 'case-dat-dai', ...dto } as any);

      const result = await service.create('case-dat-dai', dto, mockUserStaff1);
      expect(result.id).toBe('new-lp');
      expect(auditLogs.logAction).toHaveBeenCalledWith({
        actorUserId: mockUserStaff1.id,
        actorEmail: mockUserStaff1.email,
        action: 'CREATE_LAND_PROFILE',
        details: expect.objectContaining({
          caseId: 'case-dat-dai',
          landProfileId: 'new-lp',
        }),
      });
    });

    it('should throw BadRequestException if case is not land-related (DAT_DAI)', async () => {
      jest.spyOn(prisma.legalCase, 'findFirst').mockResolvedValue(mockCaseHinhSu as any);

      await expect(service.create('case-hinh-su', dto, mockUserStaff1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if land profile already exists for the case', async () => {
      jest.spyOn(prisma.legalCase, 'findFirst').mockResolvedValue(mockCaseDatDai as any);
      jest.spyOn(prisma.landProfile, 'findUnique').mockResolvedValue(mockLandProfile as any);

      await expect(service.create('case-dat-dai', dto, mockUserStaff1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    const dto = {
      area: 200.0,
    };

    it('should update land profile, log audit log and return updated entity', async () => {
      jest.spyOn(prisma.legalCase, 'findFirst').mockResolvedValue(mockCaseDatDai as any);
      jest.spyOn(prisma.landProfile, 'findUnique').mockResolvedValue(mockLandProfile as any);
      jest.spyOn(prisma.landProfile, 'update').mockResolvedValue({ ...mockLandProfile, area: 200.0 } as any);

      const result = await service.update('case-dat-dai', dto, mockUserStaff1);
      expect(result.area).toBe(200.0);
      expect(auditLogs.logAction).toHaveBeenCalledWith({
        actorUserId: mockUserStaff1.id,
        actorEmail: mockUserStaff1.email,
        action: 'UPDATE_LAND_PROFILE',
        details: expect.objectContaining({
          caseId: 'case-dat-dai',
          landProfileId: 'lp-1',
          changedFields: ['area'],
        }),
      });
    });

    it('should throw NotFoundException if land profile does not exist', async () => {
      jest.spyOn(prisma.legalCase, 'findFirst').mockResolvedValue(mockCaseDatDai as any);
      jest.spyOn(prisma.landProfile, 'findUnique').mockResolvedValue(null as any);

      await expect(service.update('case-dat-dai', dto, mockUserStaff1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
