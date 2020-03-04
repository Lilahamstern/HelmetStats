import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as logger from 'morgan';

// Import routers
import PlayerController from './controllers/PlayerController';
import StatusController from './controllers/StatusController';
import SeasonsController from './controllers/SeasonsController';
import AccountController from './controllers/AccountController';

// Server class
export class Server {
  public app: express.Application;

  constructor() {
    require('dotenv').config()
    this.app = express();
    this.config();
    this.routes();
  }

  public config() {
    // Configs
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));
    this.app.use(bodyParser.json());
    this.app.use(logger("dev"));
    this.app.use(compression());
    this.app.use(helmet());
    this.app.use(cors())

  }

  routes(): void {
    let router: express.Router;
    router = express.Router();

    this.app.use("/", router);
    this.app.use("/api/v1/player", PlayerController);
    this.app.use("/api/v1/season", SeasonsController);
    this.app.use("/api/v1/account", AccountController);
    this.app.use("/", StatusController)
  }
}

export default new Server().app;
