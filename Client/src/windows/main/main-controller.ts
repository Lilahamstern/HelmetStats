import Header from "./header-handler";
import viewController from "./views/view-controller";

export default class MainController {

  private constructor() {
  }

  static async run() {
    Header.enableImportantButtons()

    try {
      await MainController._sendData();
    } catch (e) {
      console.error(e);
    }
  }

  // Send data to main-view
  static async _sendData() {
    await overwolf.extensions.current.getManifest((manifest) => {
      Header.setApplicationName(manifest.meta.name)
    })
    viewController.renderView("login")
  }
}

