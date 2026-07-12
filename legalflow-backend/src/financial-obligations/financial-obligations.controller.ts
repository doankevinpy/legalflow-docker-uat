import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FinancialObligationsService } from './financial-obligations.service';
import { CreateFinancialObligationAssessmentDto } from './dto/create-financial-obligation-assessment.dto';
import { UpdateFinancialObligationAssessmentDto } from './dto/update-financial-obligation-assessment.dto';
import { CreateFinancialObligationItemDto } from './dto/create-financial-obligation-item.dto';
import { UpdateFinancialObligationItemDto } from './dto/update-financial-obligation-item.dto';
import { CreateTaxNoticeRecordDto } from './dto/create-tax-notice-record.dto';
import { CreatePaymentEvidenceRecordDto } from './dto/create-payment-evidence-record.dto';
import { VerifyFinancialObligationDto } from './dto/verify-financial-obligation.dto';
import { MarkFinancialObligationCompletedDto } from './dto/mark-financial-obligation-completed.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/role.enum';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class FinancialObligationsController {
  constructor(private readonly service: FinancialObligationsService) {}

  @Get('procedure-cases/:caseId/financial-obligations')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF, Role.VIEWER)
  async getByCaseId(@Param('caseId') caseId: string, @Request() req: any) {
    return this.service.findByCaseId(caseId, req?.user);
  }

  @Post('procedure-cases/:caseId/financial-obligations')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  async createAssessment(
    @Param('caseId') caseId: string,
    @Body() dto: CreateFinancialObligationAssessmentDto,
    @Request() req: any,
  ) {
    return this.service.createAssessment(caseId, dto, req?.user);
  }

  @Patch('financial-obligations/:assessmentId')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  async updateAssessment(
    @Param('assessmentId') assessmentId: string,
    @Body() dto: UpdateFinancialObligationAssessmentDto,
    @Request() req: any,
  ) {
    return this.service.updateAssessment(assessmentId, dto, req?.user);
  }

  @Post('financial-obligations/:assessmentId/generate-draft')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  async generateDraft(@Param('assessmentId') assessmentId: string, @Request() req: any) {
    return this.service.generateDraft(assessmentId, req?.user);
  }

  @Post('financial-obligations/:assessmentId/items')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  async addItem(
    @Param('assessmentId') assessmentId: string,
    @Body() dto: CreateFinancialObligationItemDto,
    @Request() req: any,
  ) {
    return this.service.addItem(assessmentId, dto, req?.user);
  }

  @Patch('financial-obligation-items/:itemId')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  async updateItem(
    @Param('itemId') itemId: string,
    @Body() dto: UpdateFinancialObligationItemDto,
    @Request() req: any,
  ) {
    return this.service.updateItem(itemId, dto, req?.user);
  }

  @Post('financial-obligations/:assessmentId/tax-notices')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  async addTaxNotice(
    @Param('assessmentId') assessmentId: string,
    @Body() dto: CreateTaxNoticeRecordDto,
    @Request() req: any,
  ) {
    return this.service.addTaxNotice(assessmentId, dto, req?.user);
  }

  @Post('financial-obligations/:assessmentId/payment-evidence')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  async addPaymentEvidence(
    @Param('assessmentId') assessmentId: string,
    @Body() dto: CreatePaymentEvidenceRecordDto,
    @Request() req: any,
  ) {
    return this.service.addPaymentEvidence(assessmentId, dto, req?.user);
  }

  @Post('financial-obligations/:assessmentId/officer-verify')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  async officerVerify(
    @Param('assessmentId') assessmentId: string,
    @Body() dto: VerifyFinancialObligationDto,
    @Request() req: any,
  ) {
    return this.service.officerVerify(assessmentId, dto, req?.user);
  }

  @Post('financial-obligations/:assessmentId/manager-verify')
  @Roles(Role.ADMIN, Role.MANAGER)
  async managerVerify(
    @Param('assessmentId') assessmentId: string,
    @Body() dto: VerifyFinancialObligationDto,
    @Request() req: any,
  ) {
    return this.service.managerVerify(assessmentId, dto, req?.user);
  }

  @Post('financial-obligations/:assessmentId/mark-completed')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  async markCompleted(
    @Param('assessmentId') assessmentId: string,
    @Body() dto: MarkFinancialObligationCompletedDto,
    @Request() req: any,
  ) {
    return this.service.markCompleted(assessmentId, dto, req?.user);
  }

  @Get('financial-obligations/:assessmentId/audit-logs')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF, Role.VIEWER)
  async getAuditLogs(@Param('assessmentId') assessmentId: string, @Request() req: any) {
    return this.service.getAuditLogs(assessmentId, req?.user);
  }
}
