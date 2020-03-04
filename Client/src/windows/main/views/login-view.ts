import viewController from "./view-controller";
import AccountRequests from "./../../../scripts/requests/account"
import Settings from "../../../scripts/services/settings-service"
import headerHandler from './../header-handler';
class LoginView {


  // Render login page
  public renderLogin(): void {
    // Check if user is logged in on overwolf
    overwolf.profile.getCurrentUser((profile: any) => {
      let loginView: HTMLDivElement | undefined = document.createElement("div")
      loginView.id = "loginView"

      loginView ? loginView.innerHTML += '<div class="pitch"> <p><span class="headline">Welcome to </span><span class="headline appname">Helmet Stats</span>! <br />Here you can track your improvements, watch a professional player play at the same time, compare against others using <span class="appname">Helmet Stats</span> and get all news about PUBG. <span class="ending">All at the same place!</span></p> </div>' : undefined

      let loginMessage: HTMLParagraphElement | undefined = document.createElement("p")
      loginMessage.id = "message"
      // Check for username
      if (profile.username) {
        // Login if succeded || give error
        AccountRequests.Login(profile.username, (status: number, data: any) => {
          let loginMessage: any = document.getElementById("message")
          if (data.response === "Auth failed") {
            loginMessage ? loginMessage.innerHTML = 'Could not find account, please connect your Overwolf account <span id="connects">here</span> or login on antoher Overwolf account!' : undefined

            let conRe: any = document.getElementById("connects")
            conRe.addEventListener("click", () => {
              viewController.renderView("connect");
            })
            conRe = null
          } else {
            let loginMessage: any = document.getElementById("message")
            Settings.initSettings(data.name, data.token, (res: any) => {
              if (res) {
                loginMessage ? loginMessage.innerHTML = `Logging you in, gathering your user data...` : undefined
                setTimeout(() => {
                  headerHandler.enableNavbar()
                  viewController.renderView("home")
                }, 5000)
              } else {
                loginMessage ? loginMessage.innerHTML = `Failed to read settings! Please restart app, if you still see me please contact support` : undefined
              }
            })
          }
          loginMessage = undefined
        })
      } else {
        loginMessage ? loginMessage.innerHTML = "Unable to get Overwolf account, please Sign in or restart Overwolf!" : undefined
      }

      if (loginMessage && loginView) {
        loginView.append(loginMessage)
      }

      let main: any | undefined = document.getElementsByTagName("main")
      main[0].append(loginView)
      loginMessage = undefined;
      loginView = undefined;
      main = undefined;
    })
  }
}



const loginView = new LoginView();

export default loginView;