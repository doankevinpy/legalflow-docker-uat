import { Controller, Get, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { LegalKnowledgeService, RollbackVersionDto } from './legal-knowledge.service';
export { RollbackVersionDto };
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

  @Get('update-logs/:id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF, Role.VIEWER)
  getUpdateLog(@Param('id') id: string) {
    return this.service.getUpdateLogById(id);
  }

  @Get('snapshots')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF, Role.VIEWER)
  getSnapshots() {
    return this.service.getSnapshots();
  }

  @Post('update-logs/analyze-impact')
  @Roles(Role.ADMIN, Role.MANAGER)
  analyzeImpactFromLog(@Body() body: { sourceDocumentId?: string; title?: string; notes?: string }) {
    return this.service.analyzeImpact(body.sourceDocumentId, body.title, body.notes);
  }

  @Post('documents/:id/analyze-impact')
  @Roles(Role.ADMIN, Role.MANAGER)
  analyzeImpactFromDocument(@Param('id') id: string, @Body() body?: { title?: string; notes?: string }) {
    return this.service.analyzeImpact(id, body?.title, body?.notes);
  }

  @Post('update-logs/:id/start-review')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  startReview(@Param('id') id: string, @Body() body: { note?: string; reason?: string }, @Request() req: any) {
    return this.service.handleWorkflowAction(id, 'START_REVIEW', body?.note || '', body?.reason || '', req.user);
  }

  @Post('update-logs/:id/add-review-note')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  addReviewNote(@Param('id') id: string, @Body() body: { note?: string; reason?: string }, @Request() req: any) {
    return this.service.handleWorkflowAction(id, 'ADD_NOTE', body?.note || '', body?.reason || '', req.user);
  }

  @Post('update-logs/:id/request-more-info')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  requestMoreInfo(@Param('id') id: string, @Body() body: { note?: string; reason?: string }, @Request() req: any) {
    return this.service.handleWorkflowAction(id, 'REQUEST_MORE_INFO', body?.note || '', body?.reason || '', req.user);
  }

  @Post('update-logs/:id/approve-for-versioning')
  @Roles(Role.ADMIN, Role.MANAGER)
  approveForVersioning(@Param('id') id: string, @Body() body: { note?: string; reason?: string }, @Request() req: any) {
    return this.service.handleWorkflowAction(id, 'APPROVE_FOR_VERSIONING', body?.note || '', body?.reason || '', req.user);
  }

  @Post('update-logs/:id/reject')
  @Roles(Role.ADMIN, Role.MANAGER)
  rejectUpdate(@Param('id') id: string, @Body() body: { note?: string; reason?: string }, @Request() req: any) {
    return this.service.handleWorkflowAction(id, 'REJECT', body?.note || '', body?.reason || '', req.user);
  }

  @Post('update-logs/:id/close')
  @Roles(Role.ADMIN, Role.MANAGER)
  closeUpdate(@Param('id') id: string, @Body() body: { note?: string; reason?: string }, @Request() req: any) {
    return this.service.handleWorkflowAction(id, 'CLOSE', body?.note || '', body?.reason || '', req.user);
  }

  @Post('update-logs/:id/workflow-action')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  workflowAction(@Param('id') id: string, @Body() body: { action: string; note?: string; reason?: string }, @Request() req: any) {
    return this.service.handleWorkflowAction(id, body?.action || '', body?.note || '', body?.reason || '', req.user);
  }

  @Post('update-logs/:id/create-draft-version')
  @Roles(Role.ADMIN, Role.MANAGER)
  createDraftVersion(
    @Param('id') id: string,
    @Body() body: { draftType: string; sourceVersionId: string; reason: string; draftVersion?: string },
    @Request() req: any,
  ) {
    return this.service.createDraftVersion(
      id,
      body?.draftType || '',
      body?.sourceVersionId || '',
      body?.reason || '',
      body?.draftVersion,
      req.user,
    );
  }

  @Post('update-logs/:id/create-procedure-type-draft')
  @Roles(Role.ADMIN, Role.MANAGER)
  createProcedureTypeDraft(
    @Param('id') id: string,
    @Body() body: { sourceVersionId: string; reason: string; draftVersion?: string },
    @Request() req: any,
  ) {
    return this.service.createDraftVersion(
      id,
      'PROCEDURE_TYPE_VERSION',
      body?.sourceVersionId || '',
      body?.reason || '',
      body?.draftVersion,
      req.user,
    );
  }

  @Post('update-logs/:id/create-prompt-draft')
  @Roles(Role.ADMIN, Role.MANAGER)
  createPromptDraft(
    @Param('id') id: string,
    @Body() body: { sourceVersionId: string; reason: string; draftVersion?: string },
    @Request() req: any,
  ) {
    return this.service.createDraftVersion(
      id,
      'AI_PROMPT_VERSION',
      body?.sourceVersionId || '',
      body?.reason || '',
      body?.draftVersion,
      req.user,
    );
  }

  @Post('update-logs/:id/create-checklist-draft')
  @Roles(Role.ADMIN, Role.MANAGER)
  createChecklistDraft(
    @Param('id') id: string,
    @Body() body: { sourceVersionId: string; reason: string; draftVersion?: string },
    @Request() req: any,
  ) {
    return this.service.createDraftVersion(
      id,
      'CHECKLIST_VERSION',
      body?.sourceVersionId || '',
      body?.reason || '',
      body?.draftVersion,
      req.user,
    );
  }

  @Get('sample-cases')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF, Role.VIEWER)
  getSampleCases() {
    return this.service.getSampleProcedureCases();
  }

  @Post('update-logs/:id/run-draft-simulation')
  @Roles(Role.ADMIN, Role.MANAGER)
  runDraftSimulation(
    @Param('id') id: string,
    @Body() body: { procedureCaseId: string; draftProcedureTypeVersionId?: string; draftPromptVersionId?: string; draftChecklistVersionId?: string; note?: string },
    @Request() req: any,
  ) {
    return this.service.runDraftVersionSimulation(id, body || {}, req.user);
  }

  @Post('update-logs/:id/activate-draft-version')
  @Roles(Role.ADMIN, Role.MANAGER)
  activateDraftVersion(
    @Param('id') id: string,
    @Body() body: any,
    @Request() req: any,
  ) {
    return this.service.activateDraftVersion(id, body || {}, req.user);
  }

  @Get('update-logs/:id/activation-verification')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF, Role.VIEWER)
  getActivationVerification(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.service.getActivationVerification(id, req.user);
  }

  @Post('update-logs/:id/rollback-version')
  @Roles(Role.ADMIN, Role.MANAGER)
  rollbackActivatedVersion(
    @Param('id') id: string,
    @Body() dto: RollbackVersionDto,
    @Request() req: any,
  ) {
    return this.service.rollbackActivatedVersion(id, dto || ({} as RollbackVersionDto), req.user);
  }
}


