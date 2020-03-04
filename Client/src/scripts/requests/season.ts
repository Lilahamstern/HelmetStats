import request from 'request';
import Options from './options'
import Settings from "../services/settings-service"
class Season {

  public setGeneral() {
    let options = {
      method: 'post',
      json: true,
      url: Options.season + "/all",
      headers: {
        'Authorization': 'Bearer ' + Options.token
      }
    }
    request(options, (error: any, _res: any, _body: any) => {
      if (error) {
        console.log("Error: " + error.message);
        throw error;
      }
    })
  }

  public getGeneral(cb: (data: any) => any) {
    let options = {
      method: 'get',
      json: true,
      url: Options.player + "/general",
      headers: {
        'Authorization': 'Bearer ' + Options.token
      }
    }
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let data: string[] = ["Null", "Null", "Null", "Null", "Null", time]
    request(options, (error: any, res: any, body: any) => {
      if (error) {
        console.log("Error: " + error.message)
      } else {
        if (body.data.response === "Auth failed!") {
          cb(data)
        }
        let i = 0;
        for (let x in body.data.response) {
          if (x === "totalTimeSurvived") {
            let hour = Math.floor(body.data.response[x] / 60 / 60)
            let min = body.data.response[x] % 60
            data[i] = hour + ":" + min + "h"
            i++;
            continue;
          }
          data[i] = body.data.response[x]
          i++
        }
        cb(data)
      }
    })
  }
}


const season = new Season();

export default season;