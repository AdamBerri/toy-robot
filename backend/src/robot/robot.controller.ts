import { Controller, Get, Post, Body } from '@nestjs/common';
import { RobotService } from './robot.service';
import { RobotCommandDto } from './dto/robot.dto';

@Controller('robot')
export class RobotController {
  constructor(private readonly robotService: RobotService) {}

  @Get()
  getRobot() {
    return this.robotService.getRobot();
  }

  @Post('command')
  executeCommand(@Body() robotCommandDto: RobotCommandDto) {
    return this.robotService.executeCommand(robotCommandDto);
  }
}
