import { Test, TestingModule } from '@nestjs/testing';
import { DebutController } from './debut.controller';
import { DebutService } from './debut.service';

describe('DebutController', () => {
  let controller: DebutController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DebutController],
      providers: [DebutService],
    }).compile();

    controller = module.get<DebutController>(DebutController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
