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
} from '@nestjs/common';
import { AdministrativeProceduresService } from './administrative-procedures.service';
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
  constructor(private readonly service: AdministrativeProceduresService) {}

  @Post()
  async createCase(@Body() createDto: CreateProcedureCaseDto, @Request() req: any) {
    return this.service.createCase(createDto, req.user.userId);
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
    return this.service.updateCase(id, updateDto, req.user.userId);
  }

  @Post(':id/notes')
  async addNote(
    @Param('id') id: string,
    @Body() noteDto: AddProcedureNoteDto,
    @Request() req: any,
  ) {
    return this.service.addNote(id, noteDto, req.user.userId);
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
    return this.service.updateChecklist(caseId, itemId, updateDto, req.user.userId);
  }
}
