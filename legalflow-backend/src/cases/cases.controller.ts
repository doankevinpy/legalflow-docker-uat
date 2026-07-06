import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { QueryCasesDto } from './dto/query-cases.dto';
import { AddCaseNoteDto } from './dto/add-case-note.dto';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';
import { ChangeCaseStatusDto } from './dto/change-case-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/role.enum';

@Controller('cases')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  create(@Body() createCaseDto: CreateCaseDto, @Request() req: any) {
    return this.casesService.create(createCaseDto, req.user);
  }

  @Get('stats')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF, Role.VIEWER)
  getStats() {
    return this.casesService.getStats();
  }

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF, Role.VIEWER)
  findAll(@Query() query: QueryCasesDto) {
    return this.casesService.findAll(query);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF, Role.VIEWER)
  findOne(@Param('id') id: string) {
    return this.casesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  update(
    @Param('id') id: string,
    @Body() updateCaseDto: UpdateCaseDto,
    @Request() req: any,
  ) {
    return this.casesService.update(id, updateCaseDto, req.user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  remove(@Param('id') id: string, @Request() req: any) {
    return this.casesService.softDelete(id, req.user);
  }

  @Post(':id/notes')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  addNote(
    @Param('id') id: string,
    @Body() addCaseNoteDto: AddCaseNoteDto,
    @Request() req: any,
  ) {
    return this.casesService.addNote(id, addCaseNoteDto, req.user);
  }

  @Patch(':id/checklist/:itemId')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  updateChecklistItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() updateChecklistItemDto: UpdateChecklistItemDto,
    @Request() req: any,
  ) {
    return this.casesService.updateChecklistItem(
      id,
      itemId,
      updateChecklistItemDto,
      req.user,
    );
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  changeStatus(
    @Param('id') id: string,
    @Body() changeCaseStatusDto: ChangeCaseStatusDto,
    @Request() req: any,
  ) {
    return this.casesService.changeStatus(id, changeCaseStatusDto, req.user);
  }

  @Post(':id/documents')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  @UseInterceptors(FileInterceptor('file'))
  uploadDocument(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    return this.casesService.uploadDocument(id, file, req.user);
  }

  @Get(':id/documents/:docId/download')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF, Role.VIEWER)
  downloadDocument(
    @Param('id') id: string,
    @Param('docId') docId: string,
    @Request() req: any,
  ) {
    return this.casesService.downloadDocument(id, docId, req.user);
  }

  @Get(':id/notes/:noteId/export-docx')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  async exportDocx(
    @Param('id') id: string,
    @Param('noteId') noteId: string,
    @Request() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    const { buffer, filename } = await this.casesService.exportDocx(id, noteId, req.user);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    return new StreamableFile(buffer);
  }

  @Get(':id/notes/:noteId/preview-data')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF, Role.VIEWER)
  async getDraftPreviewData(
    @Param('id') id: string,
    @Param('noteId') noteId: string,
    @Request() req: any,
  ) {
    return this.casesService.getDraftPreviewData(id, noteId, req.user);
  }
}

