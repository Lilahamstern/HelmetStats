import { Router, Request, Response, NextFunction } from 'express';
import Account from '../database/Account'
import PUBGRequest from '../external/PUBG/Players';
import middleware from '../middleware/Middleware';
import * as jwt from 'jsonwebtoken'
require('dotenv').config()

class AccountController {
  router: Router;
  constructor() {
    this.router = Router();
    this.routes();
  }

  private LoginAccount(req: Request, res: Response): void {
    let name = req.body.name;
    if (!name) {
      res.status(400).json({ data: { status: 400, "response-type": "error", response: "Invalid request need name in request body." } })
    } else {
      Account.login(name, (data: any) => {
        if (data === undefined) {
          return res.status(404).json({ data: { status: 404, "response-type": "error", response: "Auth failed" } })
        }
        const token = jwt.sign({
          id: data["id"],
          name: data["name"],
          accId: data["accountID"],
          owId: data["OWAccountID"],
          owName: data["OWName"]
        },
          String(process.env.SECRET),
          {
            expiresIn: "3h"
          })
        res.status(200).json({ data: { status: 200, "response-type": "success", response: "Auth success", name: data["name"], token: token } })
      })
    }
  }

  private CreateAccount(req: Request, res: Response): void {
    let accountName = req.body.name;
    let profileName = req.body.profileName
    if (!accountName || !profileName) {
      res.status(400).json({ data: { status: 400, "response-type": "error", response: "Invalid request need profileName and name in request body." } })
    } else {
      PUBGRequest.GetPlayerFromName(accountName, ((error: any, data: any) => {
        if (error) {
          return res.status(404).json({ data: { status: 404, "response-type": "error", response: error } })
        }
        Account.create(accountName, data.id, profileName, (data: any) => {
          if (data === "Overwolf") {
            res.status(409).json({ data: { status: 409, "response-type": "error", response: "Overwolf account is in use!" } })
          } else if (data["insertId"] && data["insertId"] != 0) {
            res.status(200).json({ data: { status: 200, "response-type": "success", response: "User created" } })
          } else {
            res.status(409).json({ data: { status: 409, "response-type": "error", response: "User already exists" } })
          }
        })
      }))
    }
  }

  private UpdateAccount(req: Request, res: Response): void {
    let accountID = res.locals.token.id;
    let profileName = req.body.name;
    if (!profileName) {
      res.status(409).json({ data: { status: 409, "response-type": "error", response: "Name is requierd" } })
    }

    PUBGRequest.GetPlayerFromName(profileName, (error: any, data: any) => {
      if (error) {
        return res.status(404).json({ data: { status: 404, "response-type": "error", response: error } })
      }

      Account.update(accountID, data["id"], data.attributes.name, (response: any) => {
        if (String(response).startsWith("Error: ")) {
          if (response === "Error: Account is taken!") {
            return res.status(409).json({ data: { status: 409, "response-type": "error", response: "Username is already taken!" } })
          } else if (String(response).startsWith("Error: Days ")) {
            let days = response.split(" ")
            return res.status(409).json({ data: { status: 409, "response-type": "error", response: `You need to wait ${20 - days[2]} days until you can change name!` } })
          }
          return res.status(500).json({ data: { status: 409, "response-type": "error", response: response } })
        } else {
          return res.status(200).json({ data: { status: 200, "response-type": "success", response: "Account profile uppdated!" } })
        }
      })
    })
  }

  private RemoveAccount(req: Request, res: Response): void {
    let accountID = res.locals.token.id
    Account.remove(accountID, (data: any) => {
      if (data["affectedRows"] === 1) {
        res.status(200).json({ data: { status: 200, "response-type": "success", reponse: "Account deleted successfully!" } })
      } else {
        res.status(500).json({ data: { status: 500, "response-type": "error", reponse: "Error occuerd" } })
      }
    })
  }

  // Setting up the routes
  routes() {
    this.router.post('/', this.CreateAccount);
    this.router.delete('/', middleware.CheckToken, this.RemoveAccount);
    this.router.put('/', middleware.CheckToken, this.UpdateAccount);
    this.router.post('/login', this.LoginAccount)
  }
}

// Export
const accountController = new AccountController();
accountController.routes();

export default accountController.router;