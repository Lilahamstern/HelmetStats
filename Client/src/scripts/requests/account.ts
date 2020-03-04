import request from 'request';
import Options from './options'

class Account {

  public Login(accountName: string, cb: (status: number, body: any) => any) {
    let postData = {
      name: accountName
    }

    let url = Options.account + "/login"
    let options = {
      method: 'post',
      body: postData,
      json: true,
      url: url
    }

    request(options, (err: any, res: any, body: any) => {
      if (err) {
        console.error('error posting json: ', err)
        throw err
      }
      var statusCode = res.statusCode
      cb(statusCode, body.data)
    })
  }

  public Create(playerName: String, profileName: String, cb: (status: number, body: any) => any) {
    let postData = {
      name: playerName,
      profileName: profileName
    }

    let url = Options.account;
    let options = {
      method: 'post',
      body: postData,
      json: true,
      url: url
    }
    request(options, (err: any, res: any, body: any) => {
      if (err) {
        console.error('error posting json: ', err)
        throw err
      }
      var statusCode = res.statusCode
      cb(statusCode, body)
    })
  }
}


const account = new Account();

export default account;