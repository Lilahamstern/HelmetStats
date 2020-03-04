import { RunningGameService } from "../../scripts/services/running-game-service";
import { DragService } from "../../scripts/services/drag-service";
import viewController from "./views/view-controller";


class HeaderHandler {

  // Buttons 
  private closeButton: HTMLElement | any = document.getElementById('closeButton');
  private minimizeButton: HTMLElement | any = document.getElementById('minimizeButton')
  // Navbar
  private readonly navbarHome: HTMLElement | any = document.getElementById("navbarHome");
  private readonly navbarStats: HTMLElement | any = document.getElementById("navbarStats");
  private readonly navbarLeaderboard: HTMLElement | any = document.getElementById("navbarLeaderboard");
  private readonly navbarMatches: HTMLElement | any = document.getElementById("navbarMatches");
  private readonly navbarTwitch: HTMLElement | any = document.getElementById("navbarTwitch");
  public readonly header: HTMLElement | any = document.getElementsByClassName('app-header')[0];

  private dragService: DragService | any = null;

  public enableImportantButtons() {
    this.closeButton.addEventListener('click', this.onCloseClicked);
    this.minimizeButton.addEventListener('click', this.onMinimizedClicked);
    let that = this;
    overwolf.windows.getCurrentWindow(result => {
      that.dragService = new DragService(result.window, that.header);
    });
    this.closeButton = null
    this.minimizeButton = null
  }


  private async onCloseClicked() {
    let isGameRunning = await RunningGameService.instance.isGameRunning();
    if (isGameRunning) {
      window.close();
    } else {
      let mainWindow = overwolf.windows.getMainWindow();
      mainWindow.close();
    }
  }

  // Minimize window on click
  private async onMinimizedClicked() {
    overwolf.windows.getCurrentWindow((data) => {
      overwolf.windows.minimize(data.window.id, ((data) => {
      }))
    })
  }

  // Change view when click on anchor tag
  private changeView(windowElemet: any, view: string) {
    return async () => {
      this.navbarHome.classList.remove("active");
      this.navbarStats.classList.remove("active");
      this.navbarLeaderboard.classList.remove("active");
      this.navbarMatches.classList.remove("active");
      this.navbarTwitch.classList.remove("active");
      windowElemet.classList.add("active");

      viewController.renderView(view)
    }
  }

  public setApplicationName(name: string) {
    let appTitle = document.getElementById("appTitle")
    if (appTitle != null) {
      appTitle.innerHTML = name + "<span> By Lilahamstern</span>"
    }
    appTitle = null;
  }

  public enableNavbar() {
    this.navbarHome.classList.add("active")
    this.navbarHome.addEventListener('click', this.changeView(this.navbarHome, "home"))
    this.navbarStats.addEventListener('click', this.changeView(this.navbarStats, "stats"))
    this.navbarLeaderboard.addEventListener('click', this.changeView(this.navbarLeaderboard, "leaderboard"))
    this.navbarMatches.addEventListener('click', this.changeView(this.navbarMatches, "matches"))
    this.navbarTwitch.addEventListener('click', this.changeView(this.navbarTwitch, "twitch"))
  }
}

const headerHandler = new HeaderHandler();
export default headerHandler;
