import { Module } from '@nestjs/common';
import { FinancialObligationsController } from './financial-obligations.controller';
import { FinancialObligationsService } from './financial-obligations.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FinancialObligationsController],
  providers: [FinancialObligationsService],
  exports: [FinancialObligationsService],
})
export class FinancialObligationsModule {}
