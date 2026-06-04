import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdminAuditLogsService } from '../admin-audit-logs/admin-audit-logs.service';
import { CreateLandProfileDto } from './dto/create-land-profile.dto';
import { UpdateLandProfileDto } from './dto/update-land-profile.dto';
import { Role } from '../common/role.enum';
import { CaseField } from '../cases/enums/case.enum';

@Injectable()
export class LandProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AdminAuditLogsService,
  ) {}

  private async getCaseAndCheckAccess(caseId: string, user: any, isWrite = false) {
    const caseObj = await this.prisma.legalCase.findFirst({
      where: { id: caseId, deletedAt: null },
    });

    if (!caseObj) {
      throw new NotFoundException('Case not found');
    }

    if (user.role === Role.STAFF) {
      if (caseObj.assignedToId !== user.id && caseObj.createdById !== user.id) {
        const msg = isWrite
          ? 'STAFF can only modify their own or assigned cases'
          : 'STAFF can only view their own or assigned cases';
        throw new ForbiddenException(msg);
      }
    }

    return caseObj;
  }

  async findOne(caseId: string, user: any) {
    await this.getCaseAndCheckAccess(caseId, user, false);

    const landProfile = await this.prisma.landProfile.findUnique({
      where: { caseId },
    });

    if (!landProfile) {
      throw new NotFoundException('Land profile not found for this case');
    }

    return landProfile;
  }

  async create(caseId: string, dto: CreateLandProfileDto, user: any) {
    const caseObj = await this.getCaseAndCheckAccess(caseId, user, true);

    if (caseObj.field !== CaseField.DAT_DAI) {
      throw new BadRequestException(
        'Land profile can only be created for land-related cases (DAT_DAI)',
      );
    }

    const existing = await this.prisma.landProfile.findUnique({
      where: { caseId },
    });

    if (existing) {
      throw new BadRequestException('Land profile already exists for this case');
    }

    const landProfile = await this.prisma.landProfile.create({
      data: {
        ...dto,
        caseId,
      },
    });

    await this.auditLogsService.logAction({
      actorUserId: user.id,
      actorEmail: user.email,
      action: 'CREATE_LAND_PROFILE',
      details: {
        caseId,
        landProfileId: landProfile.id,
        procedureType: landProfile.procedureType,
        area: landProfile.area,
        neighborhood: landProfile.neighborhood,
      },
    });

    return landProfile;
  }

  async update(caseId: string, dto: UpdateLandProfileDto, user: any) {
    const caseObj = await this.getCaseAndCheckAccess(caseId, user, true);

    const existing = await this.prisma.landProfile.findUnique({
      where: { caseId },
    });

    if (!existing) {
      throw new NotFoundException('Land profile not found for this case');
    }

    // Filter out caseId if it's passed in body
    const { caseId: _, ...updateData } = dto as any;

    const updated = await this.prisma.landProfile.update({
      where: { caseId },
      data: updateData,
    });

    // Detect changed fields for audit logs details
    const changedFields: string[] = [];
    for (const key of Object.keys(updateData)) {
      if (updateData[key] !== (existing as any)[key]) {
        changedFields.push(key);
      }
    }

    if (changedFields.length > 0) {
      await this.auditLogsService.logAction({
        actorUserId: user.id,
        actorEmail: user.email,
        action: 'UPDATE_LAND_PROFILE',
        details: {
          caseId,
          landProfileId: updated.id,
          changedFields,
        },
      });
    }

    return updated;
  }
}
