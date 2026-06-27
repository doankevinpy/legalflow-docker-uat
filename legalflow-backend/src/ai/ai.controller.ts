import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AiService } from './ai.service';
import { SummarizePetitionDto } from './dto/summarize-petition.dto';
import { ClassifyPetitionDto } from './dto/classify-petition.dto';
import { SuggestChecklistDto } from './dto/suggest-checklist.dto';
import { DraftResponseDto } from './dto/draft-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/role.enum';

@Controller('ai')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('summarize')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  async summarize(@Body() dto: SummarizePetitionDto, @Request() req: any) {
    return this.aiService.summarize(dto, req.user.id);
  }

  @Post('classify')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  async classify(@Body() dto: ClassifyPetitionDto, @Request() req: any) {
    return this.aiService.classify(dto, req.user.id);
  }

  @Post('checklist')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  async suggestChecklist(@Body() dto: SuggestChecklistDto, @Request() req: any) {
    return this.aiService.suggestChecklist(dto, req.user.id);
  }

  @Post('draft')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  async draftResponse(@Body() dto: DraftResponseDto, @Request() req: any) {
    return this.aiService.draftResponse(dto, req.user.id);
  }
}
