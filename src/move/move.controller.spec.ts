import { Test, TestingModule } from '@nestjs/testing';
import { MoveController } from './move.controller';
import { MoveService } from './move.service';

describe('MoveController', () => {
  let controller: MoveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoveController],
      providers: [MoveService],
    }).compile();

    controller = module.get<MoveController>(MoveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
