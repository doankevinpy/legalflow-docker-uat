import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { LegalKnowledgeService } from './legal-knowledge.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/role.enum';

@Controller('legal-knowledge')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LegalKnowledgeController {
  constructor(private readonly service: LegalKnowledgeService) {}

  @Get('documents')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF, Role.VIEWER)
  getDocuments() {
    return this.service.getDocuments();
  }

  @Get('documents/:id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF, Role.VIEWER)
  getDocument(@Param('id') id: string) {
    return this.service.getDocument(id);
  }

  @Get('procedure-type-versions')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF, Role.VIEWER)
  getProcedureTypeVersions() {
    return this.service.getProcedureTypeVersions();
  }

  @Get('prompt-versions')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF, Role.VIEWER)
  getPromptVersions() {
    return this.service.getPromptVersions();
  }

  @Get('checklist-versions')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF, Role.VIEWER)
  getChecklistVersions() {
    return this.service.getChecklistVersions();
  }

  @Get('update-logs')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF, Role.VIEWER)
  getUpdateLogs() {
    return this.service.getUpdateLogs();
  }

  @Get('snapshots')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF, Role.VIEWER)
  getSnapshots() {
    return this.service.getSnapshots();
  }
}
