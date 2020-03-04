import { Router, Request, Response, NextFunction } from 'express';
class StatusController {
  router: Router;
  constructor() {
    this.router = Router();
    this.routes();
  }

  public SendPing(req: Request, res: Response): void {
    res.status(200).json({ "status": "success", })
  }


  routes() {
    this.router.get('/', this.SendPing);
  }
}

// Export
const pingController = new StatusController();
pingController.routes();

export default pingController.router;   