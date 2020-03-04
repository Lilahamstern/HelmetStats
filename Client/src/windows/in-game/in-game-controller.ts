import { WindowNames } from "../../scripts/constants/window-names";
import { WindowsService } from "../../scripts/services/windows-service";

import { InGameView } from "./in-game-view";

export class InGameController {
  private static inGameView: InGameView;

  private constructor() {
  }

  static run() {
    if (!InGameController.inGameView) {
      InGameController.inGameView = new InGameView();
    }
  }

}


