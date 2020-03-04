import { Router, Request, Response, NextFunction } from 'express';
import Season from "./../database/Season"
import Account from "./../database/Account"
import middleware from '../middleware/Middleware';

class SeasonController {

  router: Router;
  constructor() {
    this.router = Router();
    this.routes();
  }

  public updateSeason(req: Request, res: Response): void {
    Season.check((data: any) => {
      if (data === "All up to date") {
        res.status(200).json({ data: { status: 200, "response-type": "success", reponse: "Seasons up to date!" } })
      } else if (data === "Need update") {
        res.status(200).json({ data: { status: 200, "response-type": "warning", reponse: "Seasons need update!" } })
      } else if (data === "Updated") {
        res.status(200).json({ data: { status: 200, "response-type": "success", reponse: "Seasons updated successfully!" } })
      } else if (data === "Rate limit") {
        res.status(404).json({ data: { status: 200, "response-type": "error", reponse: "Rate limit reached!" } })
      } else {
        res.status(200).json({ data: { status: 200, "response-type": "success", reponse: data } })
      }
    });
  }

  public getSeasons(req: Request, res: Response): void {
    Season.getAll((data: any) => {
      if (data.length === 0) {
        res.status(204).json({ data: { status: 204, "response-type": "success", reponse: "No seasons stored, please contact support!" } })
      } else {
        res.status(200).json({ data: { status: 200, "response-type": "success", total: data.length, reponse: data } })
      }
    })
  }

  public getSeasonStats(req: Request, res: Response): void {
    let playerID = res.locals.token.accId
    let id = res.locals.token.id
    let mode = req.query.mode
    const seasonID = req.params.season;
    Season.getStats(seasonID, id, playerID, (data: any) => {
      if (data === "No season") {
        res.status(404).json({ data: { status: 404, "response-type": "error", response: "Season not found." } })
      } else if (data === "Rate limit!") {
        res.status(408).json({ data: { status: 408, "response-type": "error", response: "Rate limit reached!" } })
      } else {
        if (mode === "tpp") {
          res.status(200).json({
            data:
              { status: 200, "response-type": "success", response: { solo: data[2], duo: data[0], squad: data[4] } }
          })
        } else if (mode === "fpp") {
          res.status(200).json({
            data:
              { status: 200, "response-type": "success", response: { "solo-fpp": data[3], "duo-fpp": data[1], "squad-fpp": data[5] } }
          })
        } else {
          res.status(200).json({
            data:
              { status: 200, "response-type": "success", response: { solo: data[2], "solo-fpp": data[3], duo: data[0], "duo-fpp": data[1], squad: data[4], "squad-fpp": data[5] } }
          })
        }
      }
    })
  }

  public getAllSeasonStats(req: Request, res: Response) {
    let playerID = res.locals.token.accId
    let id = res.locals.token.id
    Account.checkSetup(id, (response: any) => {
      if (response.length < 1) {
        res.status(404).json({ data: { status: 204, "response-type": "error", response: "Error occuerd!" } })
        return
      }
      if (response[0].setup === 0) {
        Season.getAll((data: any) => {
          if (data.length === 0) {
            res.status(204).json({ data: { status: 204, "response-type": "success", reponse: "No seasons found, please contact support!" } })
          } else {
            for (let i = 0; i <= data.length; i++) {
              Season.getStats(i.toString(), id, playerID, (data: any) => {
                if (data.toString().startsWith("Error: ")) {
                  i += 5
                  res.status(501).json({ data: { status: 501, "response-type": "error", reponse: data } })
                  return
                }
              })
            }
            Account.changeSetup(id, (response: any) => {
              if (response.affectedRows) {
                res.status(200).json({ data: { status: 200, "response-type": "success", response: "Account setup done!" } })
              } else {
                res.status(501).json({ data: { status: 501, "response-type": "error", response: "Failed with setup" } })
              }
            })
          }
        })
      } else {
        res.status(200).json({ data: { status: 200, "response-type": "success", response: "Everything is done!" } })
      }
    })
  }

  routes() {
    this.router.get("/update", this.updateSeason)
    this.router.get('/', middleware.CheckToken, this.getSeasons);
    this.router.get('/:season', middleware.CheckToken, this.getSeasonStats)
    this.router.post("/all", middleware.CheckToken, this.getAllSeasonStats)
  }
}

// Export
const seasonController = new SeasonController();
seasonController.routes();

export default seasonController.router;   