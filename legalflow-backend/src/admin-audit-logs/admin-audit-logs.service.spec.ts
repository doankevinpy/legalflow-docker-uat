import { Test, TestingModule } from '@nestjs/testing';
import { AdminAuditLogsService } from './admin-audit-logs.service';

describe('AdminAuditLogsService', () => {
  let service: AdminAuditLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminAuditLogsService],
    }).compile();

    service = module.get<AdminAuditLogsService>(AdminAuditLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
