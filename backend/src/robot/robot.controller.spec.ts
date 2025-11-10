import { Test, TestingModule } from '@nestjs/testing';
import { RobotController } from './robot.controller';
import { RobotService } from './robot.service';
import { PrismaService } from '../prisma.service';
import { CommandType, Facing } from '@prisma/client';

describe('RobotController', () => {
  let controller: RobotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RobotController],
      providers: [RobotService, PrismaService],
    }).compile();

    controller = module.get<RobotController>(RobotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return the robot position', async () => {
    const result = await controller.getRobot();
    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data?.x).toBeDefined();
    expect(result.data?.y).toBeDefined();
    expect(result.data?.facing).toBeDefined();
  });

  // it should return the robot position after a PLACE command
  it('should return the robot position after a PLACE command', async () => {
    const result = await controller.executeCommand({
      command: CommandType.PLACE,
      x: 0,
      y: 0,
      facing: Facing.NORTH,
    });
    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data?.x).toBeDefined();
    expect(result.data?.y).toBeDefined();
    expect(result.data?.facing).toBeDefined();
  });

  test.todo('If there is no history, it should return null');
  test.todo('If the command is invalid, it should return an error');
  test.todo('If the command is not supported, it should return an error');
});
