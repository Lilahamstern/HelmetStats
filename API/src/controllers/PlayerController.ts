import { Router, Request, Response, NextFunction } from 'express';
import playerRequest from '../database/Player'
import middleware from '../middleware/Middleware';

class PlayerController {
  router: Router;
  constructor() {
    this.router = Router();
    this.routes();
  }

  private getGeneral(req: Request, res: Response): void {
    let id = res.locals.token.id;
    playerRequest.getGeneral(id, (data: any) => {
      if (data === "Not found") {
        res.status(404).json({ data: { status: 404, "response-type": "error", response: "Could not find general stats!" } })
      } else {
        res.status(200).json({ data: { status: 200, "response-type": "success", response: data[0] } })
      }
    })
  }

  // Setting up the routes
  routes() {
    this.router.get('/general', middleware.CheckToken, this.getGeneral);
  }
}

// Export
const playerController = new PlayerController();
playerController.routes();

export default playerController.router;