import { Test, TestingModule } from '@nestjs/testing';
import { UserCodeService } from './user-code.service';

describe('UserCodeService', () => {
  let service: UserCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserCodeService],
    }).compile();

    service = module.get<UserCodeService>(UserCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
