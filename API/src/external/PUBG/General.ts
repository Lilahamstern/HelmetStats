import * as request from 'request';


class GeneralRequest {
  public GetStatus(cb: (data: any) => any) {
    request.get("https://api.pubg.com/status", (_error: any, _res: any, body: any) => {
      let data = JSON.parse(body)
      cb(data.data)
    })
  }
}

const generalRequest = new GeneralRequest();

export default generalRequest;