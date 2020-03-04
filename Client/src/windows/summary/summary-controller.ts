import SummaryView from "./summary-view";

export class SettingsController {
  private static summaryView: SummaryView;

  private constructor() {
  }

  static async run() {
    if (!SettingsController.summaryView) {
      SettingsController.summaryView = new SummaryView();
    }

    try {
      console.log("Working")
    } catch (e) {
      console.error(e);
    }

  }
}

