import { WindowNames } from "../constants/window-names";
import { WindowsService } from "./windows-service";
import SummaryService from "./summary-service";

class MainWindowService {
  public toggleMainWindow() {
    overwolf.windows.getOpenWindows((data: any) => {
      if (data.main != undefined) {
        //overwolf.windows.getWindowState(WindowNames.MAIN
        WindowsService.instance.minimize(WindowNames.MAIN)
      } else {
        WindowsService.instance.restore(WindowNames.MAIN)
      }
    })
  }

  public toggleSummaryWindow() {
    overwolf.windows.getWindowState(WindowNames.SUMMARY, (data: any) => {
      if (data.window_state === "closed" || data.window_state === "minimized") {
        WindowsService.instance.restore(WindowNames.SUMMARY)
        SummaryService.writeSummary()
        SummaryService.readSummary((data: any) => {
          console.log(data)
        })
      } else if (data.window_state === "normal") {
        WindowsService.instance.minimize(WindowNames.SUMMARY)
      }

      overwolf.windows.changeSize(WindowNames.SUMMARY, 800, 500, (res: any) => {
        overwolf.games.getRunningGameInfo((data: any) => {
          let width = (data.width / 2);
          let height = 100;
          overwolf.windows.changePosition(WindowNames.SUMMARY, width, height, (data: any) => {
          })
        })
      })
    })
  }
}

export default new MainWindowService();