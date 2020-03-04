import OverwolfPlugin from './overwolf-plugin'
import options from '../requests/options';

class Settings {

  private plugin: any = null
  private path = "helmet_stats\\settings.json"
  private localAppData: any

  constructor() {
    if (this.plugin === null) {
      this.plugin = new OverwolfPlugin("simple-io-plugin", true)
      this.plugin.initialize(() => {
        this.localAppData = this.plugin.get().LOCALAPPDATA;
        this.writeSettings();
      })
    }
  }

  private writeSettings() {
    this.plugin.get().fileExists(this.localAppData + "\\" + this.path, (status: any) => {
      if (!status) {
        let settings = { name: "", token: "", settings: { openMainOnEveryStart: true, closeAppOnGameClose: false, openAppAutoOnGameStart: false, } }
        this.plugin.get().writeLocalAppDataFile(this.path, JSON.stringify(settings), (status: any, _name: any) => {
          if (!status) {
            console.log("Could not write settings file!")
          }
        })
      }
    })
  }

  private updateSettings(data: any, cb: (res: boolean) => any) {
    this.plugin.get().writeLocalAppDataFile(this.path, JSON.stringify(data), (status: any, _name: any) => {
      if (status) {
        cb(true)
      } else {
        cb(false)
      }
    })
  }

  private readSettings(cb: (data: any) => any) {
    this.plugin.get().getTextFile(this.localAppData + "/" + this.path, false, (status: any, data: any) => {
      if (!status) {
        console.log("Failed to read settings!")
        cb(false)
      } else {
        data = JSON.parse(data)
        cb(data)
      }
    })
  }

  public getName(cb: (name: string) => any) {
    this.readSettings((data: any) => {
      if (!data) return cb("Undefind");
      if (data.name === "") {
        cb("Undefind")
      } else {
        cb(data.name)
      }
    })
  }

  public getToken(cb: (token: string) => any) {
    this.readSettings((data: any) => {
      if (data.token === "") {
        cb("undefined")
      } else {
        cb(data.token)
      }
    })
  }

  public initSettings(name: string, token: string, cb: (res: any) => any) {
    this.readSettings((data: any) => {
      if (!data) {
        cb(false)
      } else {
        data.name = name;
        data.token = token;
        this.updateSettings(data, (res: any) => {
          if (!res) {
            cb(false)
          } else {
            options.init()
            cb(true)
          }
        })
      }
    })
  }
}

const settings = new Settings();
export default settings;