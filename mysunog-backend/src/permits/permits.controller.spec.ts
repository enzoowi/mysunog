import { Test, TestingModule } from '@nestjs/testing';
import { PermitsController } from './permits.controller';

describe('PermitsController', () => {
  let controller: PermitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermitsController],
    }).compile();

    controller = module.get<PermitsController>(PermitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
