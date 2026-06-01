import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface LogActionParams {
  actorUserId?: string;
  actorEmail: string;
  action: string;
  targetUserId?: string;
  targetEmail?: string;
  details?: any;
}

@Injectable()
export class AdminAuditLogsService {
  private readonly logger = new Logger(AdminAuditLogsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async logAction(params: LogActionParams) {
    try {
      const safeDetails = params.details ? { ...params.details } : {};
      const sensitiveKeys = [
        'password',
        'passwordHash',
        'passwordTemp',
        'currentPassword',
        'newPassword',
        'confirmPassword',
        'accessToken',
        'JWT_SECRET',
        'DATABASE_URL',
      ];

      // Deep sanitize if needed, but shallow is usually enough if we pass structured objects
      for (const key of sensitiveKeys) {
        if (key in safeDetails) {
          delete safeDetails[key];
        }
      }

      await this.prisma.adminAuditLog.create({
        data: {
          actorUserId: params.actorUserId || null,
          actorEmail: params.actorEmail,
          action: params.action,
          targetUserId: params.targetUserId || null,
          targetEmail: params.targetEmail || null,
          details: safeDetails, // Pass object directly to Postgres Json field
        },
      });
    } catch (error: any) {
      this.logger.error(
        `Failed to create audit log: ${error.message}`,
        error.stack,
      );
    }
  }

  async findAll(query: any) {
    const {
      page = 1,
      limit = 20,
      action,
      actor,
      target,
      startDate,
      endDate,
    } = query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const where: any = {};
    if (action) {
      where.action = action;
    }
    if (actor) {
      where.actorEmail = { contains: actor, mode: 'insensitive' };
    }
    if (target) {
      where.targetEmail = { contains: target, mode: 'insensitive' };
    }
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate); // Make sure caller passes valid ISO strings
      }
    }

    const [total, data] = await Promise.all([
      this.prisma.adminAuditLog.count({ where }),
      this.prisma.adminAuditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
      }),
    ]);

    const mappedData = data.map((item) => ({
      ...item,
      details:
        typeof item.details === 'string'
          ? JSON.parse(item.details)
          : item.details || {},
    }));

    return {
      data: mappedData,
      meta: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }
}
