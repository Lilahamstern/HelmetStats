import OverwolfPlugin from './overwolf-plugin'

class Summary {

  private plugin: any = null
  private path = "helmet_stats\\summary\\summary.json"
  private localAppData: any

  constructor() {
    if (this.plugin === null) {
      this.plugin = new OverwolfPlugin("simple-io-plugin", true)
      this.plugin.initialize(() => {
        this.localAppData = this.plugin.get().LOCALAPPDATA;
      })
    }
  }

  public writeSummary() {
    this.plugin.get().fileExists(this.localAppData + "\\" + this.path, (status: any) => {
      if (!status) {
        let summary = { name: "", data: { player: { kills: null, knockout: null, damage_delt: null, headshot: null, revived: null, knockedout: null, dead: false }, game: { matchID: "", team: [], map: "", mode: "", view: "" }, end: { total: null, rank: null, killedBy: "" } } }
        this.plugin.get().writeLocalAppDataFile(this.path, JSON.stringify(summary), (status: any, _name: any) => {
          if (!status) {
            console.log("Could not write summary file!")
          }
        })
      }
    })
  }

  public readSummary(cb: (data: any) => any) {
    this.plugin.get().getTextFile(this.localAppData + "/" + this.path, false, (status: any, data: any) => {
      if (!status) {
        console.log("Failed to read summary!")
        cb(false)
      } else {
        data = JSON.parse(data)
        cb(data)
      }
    })
  }

  public updateSettings(field: string, data: string | number | boolean) {
    let ended = false;
    if (ended) return;
    this.readSummary((res: any) => {
      let end = res.data.end;
      let game = res.data.game;
      let player = res.data.player;
      console.log("Field: " + field);
      console.log("Data: " + data);
      switch (field) {
        // Player
        case 'kill':
          player.kills = data;
          break;
        case 'knockout':
          player.knockout += data;
          break;
        case 'headshot':
          player.headshot += data;
          break;
        case 'damageDealt':
          player.damageDealt = data;
          break;
        case 'revived':
          player.revived += data;
          break;
        case 'death':
          player.dead = true;
          break;
        case 'knockedout':
          player.knockedout += data;
          break;

        // End
        case "killedBy":
          end.killedBy = data;
          break;
        case "rank":
          end.rank = data;
          break;
        case "total":
          end.total = data;
          break;

        // Game
        case "map":
          game.map = data;
          break;

        case "matchID":
          game.matchID = data;
          break;

        case "mode":
          game.mode = data;
          break;

        case "team":
          game.team = data;
          break;

        case "view":
          game.view = data;
          break;

        case "ended":
          ended = true
          break;
      }
      this.plugin.get().writeLocalAppDataFile(this.path, JSON.stringify(res), (status: any, _name: any) => {
        if (status) {
          console.log(status)
        } else {
          console.log(status)
        }
      })
    })
  }
}

const settings = new Summary();
export default settings;