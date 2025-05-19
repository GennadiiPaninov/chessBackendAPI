import { Test, TestingModule } from '@nestjs/testing';
import { DebutService } from './debut.service';

describe('DebutService', () => {
  let service: DebutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DebutService],
    }).compile();

    service = module.get<DebutService>(DebutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
