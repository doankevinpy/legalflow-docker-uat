import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
  StreamableFile,
  Res,
} from '@nestjs/common';
import { AdministrativeProceduresService } from './administrative-procedures.service';
import { ProcedureAiService } from './ai/procedure-ai.service';
import { CreateProcedureCaseDto } from './dto/create-procedure-case.dto';
import { UpdateProcedureCaseDto } from './dto/update-procedure-case.dto';
import { AddProcedureNoteDto } from './dto/add-procedure-note.dto';
import { AddProcedureChecklistDto } from './dto/add-procedure-checklist.dto';
import { UpdateProcedureChecklistDto } from './dto/update-procedure-checklist.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { ProcedureField, ProcedureStatus } from '@prisma/client';

@Controller('procedure-cases')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProcedureCasesController {
  constructor(
    private readonly service: AdministrativeProceduresService,
    private readonly aiService: ProcedureAiService,
  ) {}

  @Post()
  async createCase(@Body() createDto: CreateProcedureCaseDto, @Request() req: any) {
    return this.service.createCase(createDto, req?.user?.id || req?.user?.userId);
  }

  @Get()
  async getCases(
    @Query('field') field?: ProcedureField,
    @Query('procedureTypeId') procedureTypeId?: string,
    @Query('status') status?: ProcedureStatus,
    @Query('keyword') keyword?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.service.findAllCases({ field, procedureTypeId, status, keyword, page, limit });
  }

  @Get(':id')
  async getCaseById(@Param('id') id: string) {
    return this.service.findCaseById(id);
  }

  @Patch(':id')
  async updateCase(
    @Param('id') id: string,
    @Body() updateDto: UpdateProcedureCaseDto,
    @Request() req: any,
  ) {
    return this.service.updateCase(id, updateDto, req?.user?.id || req?.user?.userId);
  }

  @Post(':id/notes')
  async addNote(
    @Param('id') id: string,
    @Body() noteDto: AddProcedureNoteDto,
    @Request() req: any,
  ) {
    return this.service.addNote(id, noteDto, req?.user?.id || req?.user?.userId);
  }

  @Post(':id/checklists')
  async addChecklist(
    @Param('id') id: string,
    @Body() checklistDto: AddProcedureChecklistDto,
  ) {
    return this.service.addChecklist(id, checklistDto);
  }

  @Patch(':id/checklists/:itemId')
  async updateChecklist(
    @Param('id') caseId: string,
    @Param('itemId') itemId: string,
    @Body() updateDto: UpdateProcedureChecklistDto,
    @Request() req: any,
  ) {
    return this.service.updateChecklist(caseId, itemId, updateDto, req?.user?.id || req?.user?.userId);
  }

  @Post(':id/ai/land-first-certificate-review')
  async runLandFirstCertificateReview(@Param('id') id: string, @Request() req: any) {
    return this.aiService.reviewLandFirstCertificate(id, req?.user?.id || req?.user?.userId);
  }

  @Post(':id/ai/land-use-purpose-change-review')
  async runLandUsePurposeChangeReview(@Param('id') id: string, @Request() req: any) {
    return this.aiService.reviewLandUsePurposeChange(id, req?.user?.id || req?.user?.userId);
  }

  @Get(':id/ai-analyses')
  async getAiAnalyses(@Param('id') id: string) {
    return this.aiService.getAnalysesByCaseId(id);
  }

  @Post(':id/ai-analyses/:analysisId/accept')
  async acceptAiAnalysis(
    @Param('id') caseId: string,
    @Param('analysisId') analysisId: string,
    @Body() body: { saveToNote?: boolean; applyChecklist?: boolean },
    @Request() req: any,
  ) {
    return this.aiService.acceptAnalysis(caseId, analysisId, req?.user?.id || req?.user?.userId, body);
  }

  @Post(':id/ai-analyses/:analysisId/reject')
  async rejectAiAnalysis(
    @Param('id') caseId: string,
    @Param('analysisId') analysisId: string,
    @Request() req: any,
  ) {
    return this.aiService.rejectAnalysis(caseId, analysisId, req?.user?.id || req?.user?.userId);
  }

  @Get(':id/ai-analyses/:analysisId/export-review-docx')
  async exportReviewDocx(
    @Param('id') caseId: string,
    @Param('analysisId') analysisId: string,
    @Request() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    const { buffer, filename } = await this.aiService.exportReviewDocx(
      caseId,
      analysisId,
      req?.user?.id || req?.user?.userId,
    );
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    return new StreamableFile(buffer);
  }

  @Get(':id/ai-analyses/:analysisId/review-preview-data')
  async getReviewPreviewData(
    @Param('id') caseId: string,
    @Param('analysisId') analysisId: string,
    @Request() req: any,
  ) {
    return this.aiService.getReviewPreviewData(caseId, analysisId, req?.user?.id || req?.user?.userId);
  }
}
