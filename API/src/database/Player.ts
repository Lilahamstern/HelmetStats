import { Database } from "./Database";


class Player extends Database {
  private db = this.currentDB;

  public getGeneral(playerId: string, cb: (data: any) => any) {
    let sql = "SELECT sum(kills) as totalKills, sum(losses) as totalDeaths, sum(timeSurvived) as totalTimeSurvived, sum(damageDealt) as totalDamage, sum(roundsPlayed) as totalRounds FROM seasonStats WHERE accountId = ?"
    this.openConnection();
    let data: any;
    this.db.query(sql, playerId, (error: any, res: any, _fields) => {
      if (error) {
        data = "Error: " + error.message;
      } else {
        data = res;
      }
      for (let x in data[0]) {
        if (data[0][x] === null) {
          return cb("Not found")
        }
      }
      cb(data)
    })
  }
}

const player = new Player();
export default player;