import { IsNumber, IsEnum, Min, Max, IsOptional } from 'class-validator';
import { Facing, CommandType } from '@prisma/client';

export class RobotCommandDto {
  @IsEnum(CommandType)
  command: CommandType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(4)
  x?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(4)
  y?: number;

  @IsOptional()
  @IsEnum(Facing)
  facing?: Facing;
}
