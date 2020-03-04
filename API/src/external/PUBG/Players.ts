import * as request from 'request';
import * as OPTIONS from './Options'

class PlayerRequests {

  public GetPlayerFromID(playerID: string, cb: (error: String, player?: any) => any) {
    request.get("https://api.pubg.com/shards/steam/players/" + playerID, OPTIONS.PUBGRequestOptions, (_error: any, _res: any, body: any) => {
      if (body.errors) {
        cb(body.errors[0].title)
        return
      }
      let data = body.data;
      let matchData = data.relationships.matches.data;
      cb("", "")
    })
  }

  public GetPlayerFromName(playername: string, cb: (error: any, player?: any) => any) {
    request.get("https://api.pubg.com/shards/steam/players?filter[playerNames]=" + playername, OPTIONS.PUBGRequestOptions, (_error: any, _res: any, body: any) => {
      if (body != undefined) {
        if (body.errors) {
          cb(body.errors[0].title)
          return
        }
        let data = body.data[0];
        cb(null, data)
      } else {
        cb("Request limit reached")
      }
    })
  }
}

const playerRequest = new PlayerRequests();

export default playerRequest;