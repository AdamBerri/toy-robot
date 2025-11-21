import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { RobotService } from './robot.service';
import { RobotCommandDto } from './dto/robot.dto';

@Controller('robot')
export class RobotController {
  constructor(private readonly robotService: RobotService) {}

  @Get()
  getRobot() {
    return this.robotService.getRobot();
  }

  @Get('history')
  getHistory(@Query('max') max) {
    const max_history = JSON.parse(max as string);
    if (typeof max_history !== 'number') {
      return {
        message: 'No robot placed yet',
        data: null,
      };
    }
    return this.robotService.getHistory(max_history);
  }

  @Post('command')
  executeCommand(@Body() robotCommandDto: RobotCommandDto) {
    return this.robotService.executeCommand(robotCommandDto);
  }
}
