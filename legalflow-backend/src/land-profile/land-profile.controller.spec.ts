import { Test, TestingModule } from '@nestjs/testing';
import { LandProfileController } from './land-profile.controller';
import { LandProfileService } from './land-profile.service';
import { Role } from '../common/role.enum';
import { LandType, Neighborhood } from '@prisma/client';

describe('LandProfileController', () => {
  let controller: LandProfileController;
  let service: LandProfileService;

  const mockUser = { id: 'user1', email: 'user@test.com', role: Role.ADMIN };
  const mockLandProfile = {
    id: 'lp-1',
    caseId: 'case-1',
    landType: LandType.RESIDENTIAL,
    currentLandUseType: LandType.RESIDENTIAL,
    area: 100,
    neighborhood: Neighborhood.URBAN,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LandProfileController],
      providers: [
        {
          provide: LandProfileService,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LandProfileController>(LandProfileController);
    service = module.get<LandProfileService>(LandProfileService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should call service.findOne with caseId and user', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockLandProfile as any);
      const req = { user: mockUser };
      const result = await controller.findOne('case-1', req);
      expect(service.findOne).toHaveBeenCalledWith('case-1', mockUser);
      expect(result).toEqual(mockLandProfile);
    });
  });

  describe('create', () => {
    it('should call service.create with caseId, dto and user', async () => {
      const dto = {
        landType: LandType.RESIDENTIAL,
        currentLandUseType: LandType.RESIDENTIAL,
        area: 100,
        neighborhood: Neighborhood.URBAN,
      };
      jest.spyOn(service, 'create').mockResolvedValue({ id: 'lp-1', ...dto } as any);
      const req = { user: mockUser };
      const result = await controller.create('case-1', dto, req);
      expect(service.create).toHaveBeenCalledWith('case-1', dto, mockUser);
      expect(result.id).toBe('lp-1');
    });
  });

  describe('update', () => {
    it('should call service.update with caseId, dto and user', async () => {
      const dto = { area: 150 };
      jest.spyOn(service, 'update').mockResolvedValue({ ...mockLandProfile, area: 150 } as any);
      const req = { user: mockUser };
      const result = await controller.update('case-1', dto, req);
      expect(service.update).toHaveBeenCalledWith('case-1', dto, mockUser);
      expect(result.area).toBe(150);
    });
  });
});
