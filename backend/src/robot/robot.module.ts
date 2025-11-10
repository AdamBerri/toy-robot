import { Module } from '@nestjs/common';
import { RobotService } from './robot.service';
import { RobotController } from './robot.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [RobotController],
  providers: [RobotService, PrismaService],
})
export class RobotModule {}
