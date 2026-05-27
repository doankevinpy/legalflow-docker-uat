import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/role.enum';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  async getOverview(@Query() query: any) {
    return this.analyticsService.getOverview(query);
  }

  @Get('by-neighborhood')
  async getByNeighborhood(@Query() query: any) {
    return this.analyticsService.getByNeighborhood(query);
  }

  @Get('by-field')
  async getByField(@Query() query: any) {
    return this.analyticsService.getByField(query);
  }

  @Get('cross-tab')
  async getCrossTab(@Query() query: any) {
    return this.analyticsService.getCrossTab(query);
  }

  @Get('social-insights')
  async getSocialInsights(@Query() query: any) {
    return this.analyticsService.getSocialInsights(query);
  }
}
