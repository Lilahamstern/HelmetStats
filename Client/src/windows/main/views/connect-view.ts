import accountRequests from "../../../scripts/requests/account";
import viewController from "./view-controller";
import seasonRequest from '../../../scripts/requests/season';
class ConnectView {

  public renderConnect() {
    let connect: HTMLDivElement | undefined = document.createElement("div");
    connect.id = "connectView"

    // Connect information
    let connecth1: HTMLHeadingElement | undefined = document.createElement("h1")
    connecth1.textContent = "Connect your account!"

    let connectp: HTMLParagraphElement | undefined = document.createElement("p")
    connectp.id = "info"
    connectp.textContent = "By pressing connect you link your PUBG-name with your Overwolf profile."

    // End of connect information

    // Start of InputArea
    let inputArea: HTMLDivElement | undefined = document.createElement("div")
    inputArea.id = "inputArea"

    let input: HTMLInputElement | undefined = document.createElement("input")
    input.placeholder = "Enter PUBG username"
    input.value = ""
    input.type = "text"
    input.id = "usernameInput"
    input.maxLength = 16

    input.addEventListener("keydown", (e) => {
      let key = e.which || e.keyCode;
      if (key === 13) {
        this.ConnectAccount()
      }
    })

    let svg: SVGElement | undefined = document.createElementNS("http://www.w3.org/2000/svg", "svg")

    svg.setAttributeNS(null, "viewBox", "0 0 448 512")
    svg.setAttributeNS(null, "aria-hidden", "true")
    svg.setAttributeNS(null, "focusable", "false")
    svg.setAttributeNS(null, "data-prefix", "fas")
    svg.setAttributeNS(null, "data-icon", "arrow-right")
    svg.setAttributeNS(null, "class", "svg-inline--fa fa-arrow-right fa-w-14")
    svg.setAttributeNS(null, "roll", "img")
    svg.innerHTML = '<path fill="white" d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path>'

    svg.addEventListener("click", () => {
      this.ConnectAccount()
    })

    let error: HTMLParagraphElement | undefined = document.createElement("p")
    error.id = "message"

    inputArea.append(input, svg, error)
    // End of InputArea

    connect.append(connecth1, connectp, inputArea)

    let main: HTMLCollection | undefined = document.getElementsByTagName("main")
    main[0].append(connect)

    main = undefined;
    connect = undefined;
    connecth1 = undefined;
    connectp = undefined;
    svg = undefined;
    inputArea = undefined;
    input = undefined;
  }

  private ConnectAccount(): void {
    let message: HTMLElement | any = document.getElementById("message")
    overwolf.profile.getCurrentUser((profile: any) => {
      if (profile.status === "success") {
        let input: HTMLElement | any = document.getElementById("usernameInput")
        if (input) {
          message.classList.add("error")
          if (input.value.length < 1) {
            return message.innerHTML = "Field is requierd!"
          } else if (input.value.length < 4) {
            return message.innerHTML = "Minimun 4 characters!"
          }
          accountRequests.Create(input.value, profile.username, (status: number, body: any) => {
            message.classList.add("error")
            if (status === 409 || status === 404) {
              if (body.data.response === "Not Found") {
                return message.innerHTML = "User not found!"
              } else if (body.data.response === "User already exists") {
                return message.innerHTML = "Username is in use!"
              } else {
                return message.innerHTML = body.data.response
              }
            } else {
              seasonRequest.setGeneral()
              message.classList.add("success")
              message.innerHTML = body.data.response
              setTimeout(() => {
                viewController.renderView("login")
              }, 4000);
            }
          })
        }
      }
    })
  }
}

const connectView = new ConnectView();

export default connectView;