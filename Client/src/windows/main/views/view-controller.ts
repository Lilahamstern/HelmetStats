import connectView from "./connect-view"
import loginView from "./login-view"
import homeView from './home-view'

class ViewController {
  public oldView = "login"

  public renderView(view: string) {
    let removeView = document.getElementById(this.oldView + "View")
    if (removeView != null && removeView.parentNode != null) {
      removeView.parentNode.removeChild(removeView)
    }
    this.oldView = view;
    switch (view.toLowerCase()) {
      case "connect":
        connectView.renderConnect()
        break;
      case "login":
        loginView.renderLogin()
        break;
      case "home":
        homeView.renderHome()
        break;
    }
  }
}

const viewController = new ViewController();

export default viewController;