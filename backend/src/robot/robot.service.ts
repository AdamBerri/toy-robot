import { Injectable, BadRequestException } from '@nestjs/common';
import { Facing, CommandType } from '@prisma/client';
import { RobotPositionHistory } from './entities/robot.entity';
import { PrismaService } from '../prisma.service';
import { RobotCommandDto } from './dto/robot.dto';

type RobotResponse = {
  message: string;
  data: RobotPositionHistory | null;
};

type RobotHistory = {
  message: string;
  data: RobotPositionHistory[] | null;
};

// Create a button called “Display History” that upon click displays the last ten positions of the robot. For example:
// PLACE 0, 0, NORTH
// MOVE
// MOVE
// RIGHT
// MOVE
// PLACE 4, 4 NORTH
// LEFT
// MOVE
// DISPLAY HISTORY

// Should render in the DOM
// [0, 0] → [0, 1] → [0, 2] → [1, 2] → [4, 4] → [3, 4]

@Injectable()
export class RobotService {
  private readonly BOARD_MIN = 0;
  private readonly BOARD_MAX = 4;

  constructor(private readonly prisma: PrismaService) {}

  private isOutOfBounds(x: number, y: number): boolean {
    return (
      x < this.BOARD_MIN ||
      x > this.BOARD_MAX ||
      y < this.BOARD_MIN ||
      y > this.BOARD_MAX
    );
  }

  private rotateLeft(facing: Facing): Facing {
    switch (facing) {
      case Facing.NORTH:
        return Facing.WEST;
      case Facing.WEST:
        return Facing.SOUTH;
      case Facing.SOUTH:
        return Facing.EAST;
      case Facing.EAST:
        return Facing.NORTH;
      default:
        return facing;
    }
  }

  private rotateRight(facing: Facing): Facing {
    switch (facing) {
      case Facing.NORTH:
        return Facing.EAST;
      case Facing.EAST:
        return Facing.SOUTH;
      case Facing.SOUTH:
        return Facing.WEST;
      case Facing.WEST:
        return Facing.NORTH;
      default:
        return facing;
    }
  }

  async executeCommand(
    robotCommandDto: RobotCommandDto,
  ): Promise<RobotResponse> {
    // PLACE does not require an existing robot
    if (robotCommandDto.command === CommandType.PLACE) {
      if (
        robotCommandDto.x === undefined ||
        robotCommandDto.y === undefined ||
        robotCommandDto.facing === undefined
      ) {
        throw new BadRequestException(
          'PLACE command requires x, y, and facing parameters',
        );
      }

      if (this.isOutOfBounds(robotCommandDto.x, robotCommandDto.y)) {
        throw new BadRequestException('PLACE command is outside table bounds');
      }

      const historyEntry = await this.prisma.robotPositionHistory.create({
        data: {
          x: robotCommandDto.x,
          y: robotCommandDto.y,
          facing: robotCommandDto.facing,
          command: CommandType.PLACE,
        },
      });

      return {
        message: 'Robot placed successfully',
        data: historyEntry,
      };
    }

    // All other commands require an existing robot
    const currentPosition = await this.prisma.robotPositionHistory.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!currentPosition) {
      throw new BadRequestException('Robot must be placed first');
    }

    let newX = currentPosition.x;
    let newY = currentPosition.y;
    let newFacing = currentPosition.facing;

    switch (robotCommandDto.command) {
      case CommandType.MOVE: {
        let targetX = currentPosition.x;
        let targetY = currentPosition.y;

        switch (currentPosition.facing) {
          case Facing.NORTH:
            targetY = currentPosition.y + 1;
            break;
          case Facing.SOUTH:
            targetY = currentPosition.y - 1;
            break;
          case Facing.EAST:
            targetX = currentPosition.x + 1;
            break;
          case Facing.WEST:
            targetX = currentPosition.x - 1;
            break;
        }

        if (this.isOutOfBounds(targetX, targetY)) {
          // Ignore the move, do not create new history
          return {
            message: 'Move ignored to prevent falling off the table',
            data: currentPosition,
          };
        }

        newX = targetX;
        newY = targetY;
        break;
      }

      case CommandType.LEFT:
        newFacing = this.rotateLeft(currentPosition.facing);
        break;

      case CommandType.RIGHT:
        newFacing = this.rotateRight(currentPosition.facing);
        break;

      default:
        throw new BadRequestException('Unsupported command');
    }
    let historyEntry: RobotPositionHistory | undefined;
    try {
      historyEntry = await this.prisma.robotPositionHistory.create({
        data: {
          x: newX,
          y: newY,
          facing: newFacing,
          command: robotCommandDto.command,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to create history entry', {
        cause: error,
      });
    }

    return {
      message: 'Command executed successfully',
      data: historyEntry,
    };
  }

  async getRobot(): Promise<RobotResponse> {
    const currentPosition = await this.prisma.robotPositionHistory.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!currentPosition) {
      return {
        message: 'No robot placed yet',
        data: null,
      };
    }

    return {
      message: 'Current robot position retrieved',
      data: currentPosition,
    };
  }

  async getHistory(max: number): Promise<RobotHistory> {
    const historyRecord = await this.prisma.robotPositionHistory.findMany({
      orderBy: { createdAt: 'desc' },
      where: {
        command: {
          notIn: [CommandType.LEFT, CommandType.RIGHT],
        },
      },
      take: max,
    });

    if (!historyRecord) {
      return {
        message: 'No robot placed yet',
        data: null,
      };
    }

    return {
      message: 'Retrieved the last ' + max,
      data: historyRecord.reverse(),
    };
  }
}
