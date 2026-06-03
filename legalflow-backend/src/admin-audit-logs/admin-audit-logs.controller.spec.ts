import { Test, TestingModule } from '@nestjs/testing';
import { AdminAuditLogsController } from './admin-audit-logs.controller';
import { AdminAuditLogsService } from './admin-audit-logs.service';

describe('AdminAuditLogsController', () => {
  let controller: AdminAuditLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminAuditLogsController],
      providers: [
        {
          provide: AdminAuditLogsService,
          useValue: {
            logAction: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdminAuditLogsController>(AdminAuditLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
