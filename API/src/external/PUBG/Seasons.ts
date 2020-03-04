import * as request from 'request';
import * as OPTIONS from './Options'

class SeasonRequest {
  public Season(cb: (data: any) => any) {
    let seasonCheck = "division.bro.official.pc";
    let totalCorrectSeasons = 0;
    request.get("https://api.pubg.com/shards/steam/seasons", OPTIONS.PUBGRequestOptions, (error: any, _res: any, body: any) => {
      if (!body) {
        return cb("Rate limit reached")
      }
      let data = body.data.reverse()
      for (let i = 0; i < data.length; i++) {
        if (seasonCheck == data[i].id.substr(0, data[i].id.length - 8) || data[i].attributes.isCurrentSeason != false) {
          totalCorrectSeasons += 1;
        }
      }
      data.length = totalCorrectSeasons
      data = data.reverse()
      let dataArray: string[][] = []
      for (let i = 0; i < data.length; i++) {
        dataArray[i] = []
        for (let j = 0; j < 2; j++) {
          dataArray[i][0] = data[i].id
          dataArray[i][1] = data[i].attributes.isCurrentSeason
        }
      }
      cb([dataArray])
    })
  }

  public SeasonStatsPrimary(playerPrimary: string, seasonPrimary: string, playerid: string, seasonId: string, cb: (data: any) => any) {
    request.get("https://api.pubg.com/shards/steam/players/" + playerid + "/seasons/" + seasonId, OPTIONS.PUBGRequestOptions, (_error: any, _res: any, body: any) => {
      if (!body) return cb("Rate limit!")
      if (body.errors) {
        console.log(body.errors)
        cb("No Season Stats Found")
      } else {
        let dataArray: string[][] = [[], [], [], [], [], []];
        let data = body.data.attributes.gameModeStats
        let arrayNum = 0;
        for (var x in data) {
          dataArray[arrayNum].push(x)
          for (let y in data[x]) {
            if (y === "killPoints" || y === "winPoints") {
              continue;
            }
            dataArray[arrayNum].push(data[x][y])
          }
          dataArray[arrayNum].push(playerPrimary)
          dataArray[arrayNum].push(seasonPrimary)
          dataArray[arrayNum].push(playerPrimary + "-" + seasonPrimary + "-" + x)
          arrayNum++;
        }
        cb(dataArray)
      }
    })


  }

  public SeasonStats(playerid: string, seasonId: string, cb: (data: any) => any) {
    request.get("https://api.pubg.com/shards/steam/players/" + playerid + "/seasons/" + seasonId, OPTIONS.PUBGRequestOptions, (_error: any, _res: any, body: any) => {
      if (!body) return cb("Rate limit!")
      if (body.errors) {
        console.log(body.errors)
        cb("No Season Stats Found")
      } else {
        let dataArray: string[][] = [[], [], [], [], [], []];
        let data = body.data.attributes.gameModeStats
        let arrayNum = 0;
        for (var x in data) {
          dataArray[arrayNum].push(x)
          for (let y in data[x]) {
            if (y === "killPoints" || y === "winPoints") {
              continue;
            }
            dataArray[arrayNum].push(data[x][y])
          }
          arrayNum++;
        }
        cb(dataArray)
      }
    })
  }

}

const seasonRequest = new SeasonRequest();

export default seasonRequest;