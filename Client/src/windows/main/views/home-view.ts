import serverChecks from './../../../scripts/requests/serverChecks'
import Settings from './../../../scripts/services/settings-service'
import SeasonRequest from "./../../../scripts/requests/season"

class HomeView {
  public renderHome() {
    let homeView: HTMLElement | undefined = document.createElement("div");
    homeView.id = "homeView"
    this.welcomeMessage(homeView);
    homeView.innerHTML = '<div class="social"> <p id="twitter" style="color: #1da1f2;">Twitter</p> <p id="discord" style="color: #7289da;">Discord</p> <p id="support" style="color: #FACF53;">Support</p></div>'

    this.appInformaion(homeView);
    this.keys(homeView);
    this.playerStatics(homeView);

    // Connect information
    let main: any | undefined = document.getElementsByTagName("main")
    main[0].append(homeView)
    this.socialLinks()
    homeView = undefined;
    main = undefined;
  }

  private welcomeMessage(homeView: HTMLElement) {
    Settings.getName((name: string) => {
      let message = document.createElement("h1")
      message.id = "welcome"
      message.innerHTML = `Welcome back ${name} to <span id="appname">HelmetStats!</span>`
      homeView.append(message)
    })
  }

  private appInformaion(homeView: HTMLElement) {
    let appInfo = document.createElement("div")
    appInfo.id = "appStatics"
    appInfo.className = "info"

    let title = document.createElement("h1")
    title.textContent = "Application Information"
    appInfo.append(title)
    this.GenerateAppInfo(appInfo)
    homeView.append(appInfo)
  }

  private keys(homeView: HTMLElement) {
    let keysInfo = document.createElement("div")
    keysInfo.id = "scInfo"
    keysInfo.className = "info"

    let title = document.createElement("h1")

    title.textContent = "Shortcuts"

    keysInfo.append(title)
    this.GenerateShortcuts(keysInfo)
    homeView.append(keysInfo)
  }

  private playerStatics(homeView: HTMLElement) {
    let playerInfo = document.createElement("div")
    playerInfo.id = "playerStatics"
    playerInfo.className = "info"

    let title = document.createElement("h1")

    title.textContent = "Player Information"

    playerInfo.append(title)
    this.GeneratePlayerInfo(playerInfo)
    homeView.append(playerInfo)
  }

  private GeneratePlayerInfo(playerInfo: HTMLElement) {
    SeasonRequest.getGeneral((data: any) => {
      let titles: string[] = ["Total kills:", "Total deaths:", "Total playtime:", "Total damage dealt:", "Total rounds:", "Last updated:"]
      let table = document.createElement("table")
      let tbody = document.createElement("tbody")

      for (let i = 0, tr, tdTitle, tdData; i < titles.length; i++) {
        tr = document.createElement("tr")
        tdTitle = document.createElement("td")
        tdData = document.createElement("td")
        tdTitle.textContent = titles[i]
        tdData.textContent = data[i]
        tdData.id = "data" + i.toString();
        tdData.classList.add("data")
        tr.append(tdTitle, tdData)
        tbody.append(tr)
      }
      table.append(tbody)
      playerInfo.appendChild(table)
    })
  }

  private GenerateShortcuts(shotcut: HTMLElement) {
    let titles: string[] = ["Open settings:", "Refresh application:", "Close application", "Open desktop app:"]
    let data: string[] = ["CTRL-0", "CTRL-9", "CTRL-T", "CTRL-J"]
    let table = document.createElement("table")
    let tbody = document.createElement("tbody")

    for (let i = 0, tr, tdTitle, tdData; i < titles.length; i++) {
      tr = document.createElement("tr")
      tdTitle = document.createElement("td")
      tdData = document.createElement("td")
      tdTitle.textContent = titles[i]
      tdData.innerHTML = `<kbd>${data[i]}</kbd>`
      tdData.id = "data" + i.toString();
      tr.append(tdTitle, tdData)
      tbody.append(tr)
    }
    table.append(tbody)
    shotcut.appendChild(table)
  }

  private GenerateAppInfo(appInfo: HTMLElement) {
    let titles: string[] = ["Server status:", "Server ping:", "Your version:", "Next check:"]
    let data: string[] = ["", "", "", ""]
    serverChecks.appInformation((res: string[]) => {
      data[0] = res[0]
      data[1] = res[1]
      data[2] = res[2]
      data[3] = "Starting timer"

      let table = document.createElement("table")
      let tbody = document.createElement("tbody")

      for (let i = 0, tr, tdTitle, tdData; i < titles.length; i++) {
        tr = document.createElement("tr")
        tdTitle = document.createElement("td")
        tdData = document.createElement("td")
        tdTitle.textContent = titles[i]
        tdData.textContent = data[i]
        tdData.id = "data" + i.toString();
        tdData.classList.add("data")
        tr.append(tdTitle, tdData)
        tbody.append(tr)
      }
      table.append(tbody)
      appInfo.appendChild(table)
      this.timer(60)
    })
  }

  private timer(timeLeft: number, ) {
    let that = this;
    let time = timeLeft;
    setInterval(countdown, 1000)
    let timer = document.getElementById("data3")

    function countdown() {
      if (time === 0) {
        that.updateApplicationInfo()
        timer ? timer.innerHTML = "Checking" : undefined
        restart();
      } else {
        timer ? timer.innerHTML = time + " seconds!" : undefined;
        time--;
      }
    }

    function restart() {
      time = timeLeft;
    }
  }

  private updateApplicationInfo() {
    let serverStatus = document.getElementById("data0")
    let ping = document.getElementById("data1")

    serverChecks.appInformation((data: string[]) => {
      serverStatus ? serverStatus.innerHTML = data[0] : undefined;
      ping ? ping.innerHTML = data[1] : undefined;
    })
  }

  private socialLinks() {
    let twitter = document.getElementById("twitter")
    let discord = document.getElementById("discord")
    let support = document.getElementById("support")

    twitter ? twitter.addEventListener("click", () => { this.open("https://twitter.com/HelmetStats") }) : undefined
    discord ? discord.addEventListener("click", () => { this.open("https://discord.gg/CN2uArv") }) : undefined
    support ? support.addEventListener("click", () => { this.open("http://helmetstats.com") }) : undefined
  }

  private open(url: string): void {
    overwolf.utils.openUrlInDefaultBrowser(url)
  }
}

const homeView = new HomeView();

export default homeView;