import { Test, TestingModule } from '@nestjs/testing';
import { AdminAuditLogsController } from './admin-audit-logs.controller';

describe('AdminAuditLogsController', () => {
  let controller: AdminAuditLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminAuditLogsController],
    }).compile();

    controller = module.get<AdminAuditLogsController>(AdminAuditLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
