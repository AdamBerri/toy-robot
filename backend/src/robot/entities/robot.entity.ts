import { Facing, CommandType } from '@prisma/client';

export class RobotPositionHistory {
  id: number;
  x: number;
  y: number;
  facing: Facing;
  command: CommandType;
  createdAt: Date;
}
