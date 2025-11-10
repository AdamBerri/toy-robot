import { Test, TestingModule } from '@nestjs/testing';
import { RobotService } from './robot.service';
import { PrismaService } from '../prisma.service';

describe('RobotService', () => {
  let service: RobotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RobotService, PrismaService],
    }).compile();

    service = module.get<RobotService>(RobotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
