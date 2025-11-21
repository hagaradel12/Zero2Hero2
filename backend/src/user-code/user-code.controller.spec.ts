import { Test, TestingModule } from '@nestjs/testing';
import { UserCodeController } from './user-code.controller';

describe('UserCodeController', () => {
  let controller: UserCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserCodeController],
    }).compile();

    controller = module.get<UserCodeController>(UserCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
