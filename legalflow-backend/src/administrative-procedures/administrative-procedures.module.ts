import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AdministrativeProceduresService } from './administrative-procedures.service';
import { ProcedureTypesController } from './procedure-types.controller';
import { ProcedureCasesController } from './procedure-cases.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ProcedureTypesController, ProcedureCasesController],
  providers: [AdministrativeProceduresService],
  exports: [AdministrativeProceduresService],
})
export class AdministrativeProceduresModule {}
