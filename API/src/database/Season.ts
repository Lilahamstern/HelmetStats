import { Database } from './Database'
import PUBGRequest from './../external/PUBG/Seasons'
class Season extends Database {

  private db = this.currentDB;


  public getOne(id: string, cb: (data: any) => any) {
    let sql = "SELECT seasonId FROM seasons WHERE id = ?;"
    this.openConnection();
    let data: string;
    this.db.query(sql, id, (error: any, res: any, _fields) => {
      if (error) {
        data = "Error: " + error.message;
      } else {
        data = res;
      }
      this.closeConnection();
      this.destoryConnection();
      cb(data)
    })
  }

  public check(cb: (data: any) => any) {
    let sql = "SELECT * FROM seasons;"
    this.openConnection()
    let data: string;
    this.db.query(sql, (error: any, res: any, _fields) => {
      if (error) {
        data = "Error: " + error.message;
      } else {
        data = res;
      }
      this.closeConnection()
      if (res) {
        PUBGRequest.Season((data: any) => {
          if (data === "Rate limit reached") {
            return cb("Rate limit");
          }
          if (res.length != data[0].length) {
            if (res.length === 0) {
              let sql = "INSERT INTO seasons (seasonId, isCurrentSeason) VALUES ?"
              this.openConnection()
              this.db.query(sql, data, (error: any, res: any, _fields) => {
                if (error) {
                  cb("Error: " + error.message)
                }
                cb("Season added")
                this.closeConnection()
                this.destoryConnection()
              })
            } else {
              cb("Need update")
            }
          } else {
            cb("All up to date")
          }
        });
      } else {
        cb(data)
      }
    })
  }

  public getAll(cb: (data: any) => any) {
    let sql = "SELECT * FROM seasons;"
    this.openConnection();
    let data: any
    this.db.query(sql, (error: any, res: any, _fields) => {
      if (error) {
        data = "Error: " + error.message;
      } else {
        data = res;
      }
      this.closeConnection()
      this.destoryConnection()
      cb(data)
    })
  }

  public getStats(seasonId: string, accountId: string, playerID: string, cb: (data: any) => any) {
    this.getOne(seasonId, (resOne: any) => {
      if (resOne.length < 1) {
        cb("No season")
      } else {
        let sql = "SELECT  updatedAt, accountId, seasonId, gameMode, assists, bestRankPoint, boosts, DBNOs, dailyKills, dailyWins, damageDealt, days, headshotKills,heals, kills, longestKill, longestTimeSurvived, losses, maxKillStreaks, mostSurvivalTime, rankPoints, rankPointsTitle, revives, rideDistance, roadKills, roundMostKills, roundsPlayed, suicides, swimDistance, teamKills, timeSurvived, top10s, vehicleDestroys, walkDistance, weaponsAcquired, weeklyKills, weeklyWins, wins FROM seasonStats WHERE seasonId = ? AND accountId = ?;";
        this.openConnection()
        let data: any;
        this.db.query(sql, [seasonId, accountId], (error: any, res: any, _fields) => {
          if (error) {
            data = "Error: " + error.message;
          } else {
            data = res;
          }
          this.closeConnection();
          if (data < 1) {
            PUBGRequest.SeasonStatsPrimary(accountId, seasonId, playerID, resOne[0]["seasonId"], (response: any) => {
              if (data) {
                let sql = "INSERT INTO seasonStats (gameMode, assists, bestRankPoint, boosts, DBNOs, dailyKills, dailyWins, damageDealt, days, headshotKills,heals, kills, longestKill, longestTimeSurvived, losses, maxKillStreaks, mostSurvivalTime, rankPoints, rankPointsTitle, revives, rideDistance, roadKills, roundMostKills, roundsPlayed, suicides, swimDistance, teamKills, timeSurvived, top10s, vehicleDestroys, walkDistance, weaponsAcquired, weeklyKills, weeklyWins, wins, accountId, seasonId, id) VALUES ?;"
                let data: any
                this.db.query(sql, [response], (error: any, res: any, _fields) => {
                  if (error) {
                    return cb("Error: " + error.message);
                  } else {
                    data = res;
                  }
                  this.closeConnection();
                  if (data) {
                    let sql = "SELECT  accountId, seasonId, assists, bestRankPoint, boosts, DBNOs, dailyKills, dailyWins, damageDealt, days, headshotKills,heals, kills, longestKill, longestTimeSurvived, losses, maxKillStreaks, mostSurvivalTime, rankPoints, rankPointsTitle, revives, rideDistance, roadKills, roundMostKills, roundsPlayed, suicides, swimDistance, teamKills, timeSurvived, top10s, vehicleDestroys, walkDistance, weaponsAcquired, weeklyKills, weeklyWins, wins FROM seasonStats WHERE seasonId = ? AND accountId = ?;";
                    this.openConnection();
                    this.db.query(sql, [seasonId, accountId], (error: any, res: any, _fields) => {
                      if (error) {
                        return cb("Error: " + error.message);
                      } else {
                        cb(res)
                      }
                      this.closeConnection();
                      this.destoryConnection();
                    })
                  }
                })
              }
            })
          } else {
            let timeCheck = (new Date().getTime() / 1000) - (new Date(data[0]["updatedAt"]).getTime() / 1000);
            if (timeCheck > 2700) {
              this.getOne(seasonId, (dataSeason: any) => {
                if (dataSeason.length === 0) {
                  cb(data)
                } else {
                  PUBGRequest.SeasonStats(playerID, dataSeason[0]["seasonId"], (response: any) => {
                    this.openConnection()
                    let dataSeason: any;
                    for (let i = 0; i < response.length + 1; i++) {
                      let sql = `UPDATE seasonStats SET gameMode = ?, assists = ?, bestRankPoint = ?, boosts = ?, DBNOs = ?, dailyKills = ?, dailyWins = ?, damageDealt = ?, days = ?, headshotKills = ?, heals = ?, kills = ?, longestKill = ?, longestTimeSurvived = ?, losses = ?, maxKillStreaks = ?, mostSurvivalTime = ?, rankPoints = ?, rankPointsTitle = ?,revives = ?, rideDistance = ?, roadKills = ?, roundMostKills = ?, roundsPlayed = ?, suicides = ?, swimDistance = ?, teamKills = ?, timeSurvived = ?, top10s = ?, vehicleDestroys = ?, walkDistance = ?, weaponsAcquired = ?, weeklyKills = ?, weeklyWins = ?, wins = ? WHERE accountId = ${accountId} AND seasonId = ${seasonId} AND gameMode = '${response[i][0]}';`
                      this.db.query(sql, [response[i][0], response[i][1], response[i][2], response[i][3], response[i][4], response[i][5], response[i][6], response[i][7], response[i][8], response[i][9], response[i][10], response[i][11], response[i][12], response[i][13], response[i][14], response[i][15], response[i][16], response[i][17], response[i][18], response[i][19], response[i][20], response[i][21], response[i][2], response[i][22], response[i][23], response[i][24], response[i][25], response[i][26], response[i][27], response[i][28], response[i][29], response[i][30], response[i][31], response[i][32], response[i][33], response[i][34]], (error: any, res: any, _fields) => {
                        if (error) {
                          dataSeason = "Error: " + error.message;
                          return cb("Error occuerd!")
                        } else {
                          dataSeason = res;
                        }
                      })
                    }
                    console.log("out of it")
                    this.closeConnection()
                    this.destoryConnection()
                  })
                }
              })
            }
            cb(data)
          }
        })
      }
    })
  }
}


const season = new Season();
export default season;