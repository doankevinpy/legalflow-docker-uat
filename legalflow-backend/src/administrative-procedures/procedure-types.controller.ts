import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdministrativeProceduresService } from './administrative-procedures.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('procedure-types')
@UseGuards(JwtAuthGuard)
export class ProcedureTypesController {
  constructor(private readonly service: AdministrativeProceduresService) {}

  @Get()
  async getProcedureTypes() {
    return this.service.findAllTypes();
  }
}
