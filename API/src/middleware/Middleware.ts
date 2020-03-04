import { Router, Request, Response, NextFunction } from 'express';
import Account from "../database/Account"
import * as jwt from 'jsonwebtoken'
require('dotenv').config()

class Middleware {

  public CheckToken(req: Request, res: Response, next: NextFunction) {
    try {
      let token = req.headers['authorization'];
      if (token === undefined) {
        return res.status(401).json({ data: { status: 401, "response-type": "error", response: "Auth failed" } })
      }
      if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length)
        jwt.verify(token, String(process.env.SECRET), ((err: any, decoded: any) => {
          if (err) {
            return res.status(401).json({ status: 401, response: "Auth failed" })
          }
          Account.get(decoded["owName"], ((response: any) => {
            if (response === undefined) {
              return res.status(401).json({ data: { status: 401, "response-type": "error", response: "Auth failed, token expierd" } })
            } else {
              Account.log(decoded["id"], (data: any) => {
                if (String(data).startsWith("Error: ")) {
                  return res.status(401).json({ data: { status: 401, "response-type": "error", response: "Auth failed" } })
                }
                res.locals.token = decoded
                next()
              })
            }
          }))
        }))
      } else {
        return res.status(401).json({ data: { status: 401, "response-type": "error", response: "Auth failed" } })
      }
    } catch (e) {
      res.status(500).json({ data: { status: 500, "response-type": "error", response: "Auth failed", error: e } })
    }
  }
}

const middleware = new Middleware();

export default middleware;