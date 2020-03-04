import Settings from "./../services/settings-service";
class Options {
  public account = "http://helmetstats.com/api/v1/account"
  public season = "http://helmetstats.com/api/v1/season"
  public player = "http://helmetstats.com/api/v1/player"
  public token = ""

  public init() {
    if (this.token === "") {
      Settings.getToken((token: string) => {
        this.token = token;
      })
    }
  }
}

const options = new Options()

export default options;