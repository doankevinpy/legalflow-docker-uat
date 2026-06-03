import { Test, TestingModule } from '@nestjs/testing';
import { AdminAuditLogsService } from './admin-audit-logs.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AdminAuditLogsService', () => {
  let service: AdminAuditLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminAuditLogsService,
        {
          provide: PrismaService,
          useValue: {
            adminAuditLog: {
              create: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AdminAuditLogsService>(AdminAuditLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
