import { FileExchangeModule } from './file-exchange.module';

describe('FileExchangeModule', () => {
  let fileExchangeModule: FileExchangeModule;

  beforeEach(() => {
    fileExchangeModule = new FileExchangeModule();
  });

  it('should create an instance', () => {
    expect(fileExchangeModule).toBeTruthy();
  });
});
