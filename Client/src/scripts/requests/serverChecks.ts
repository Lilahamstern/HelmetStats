import ping from 'node-http-ping'
class ServerChecks {
  private host = "helmetstats.com";
  private getPingServer(cb: (ping: string) => any) {
    ping(this.host, 80)
      .then((time: any) => {
        cb(time)
      })
      .catch((err: any) => {
        cb(err)
      })
  }

  public appInformation(cb: (data: string[]) => any) {
    let data: string[] = ["", "", ""];

    overwolf.extensions.current.getManifest((manifest) => {
      data[2] = manifest.meta.version
      this.getPingServer((ping: string) => {
        if (ping === "-1") {
          data[0] = "Servers down"
          data[1] = "Unknown"
        } else {
          data[0] = "Servers up"
          data[1] = `${ping} ms`
        }
        cb(data)
      })
    })
  }
}

const serverChecks = new ServerChecks()

export default serverChecks;