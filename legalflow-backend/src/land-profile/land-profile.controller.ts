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
import { LandProfileService } from './land-profile.service';
import { CreateLandProfileDto } from './dto/create-land-profile.dto';
import { UpdateLandProfileDto } from './dto/update-land-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/role.enum';

@Controller('cases/:caseId/land-profile')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LandProfileController {
  constructor(private readonly landProfileService: LandProfileService) {}

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF, Role.VIEWER)
  findOne(@Param('caseId') caseId: string, @Request() req: any) {
    return this.landProfileService.findOne(caseId, req.user);
  }

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  create(
    @Param('caseId') caseId: string,
    @Body() createLandProfileDto: CreateLandProfileDto,
    @Request() req: any,
  ) {
    return this.landProfileService.create(caseId, createLandProfileDto, req.user);
  }

  @Patch()
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  update(
    @Param('caseId') caseId: string,
    @Body() updateLandProfileDto: UpdateLandProfileDto,
    @Request() req: any,
  ) {
    return this.landProfileService.update(caseId, updateLandProfileDto, req.user);
  }
}
