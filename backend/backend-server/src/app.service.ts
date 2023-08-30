import { Injectable } from '@nestjs/common';
import { GameModule } from "./game/game.module";

@Injectable()
export class AppService {
  private readonly  gameModule: GameModule;
  getHello(): string {
    return 'Hello World!';
  }
}
